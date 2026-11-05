import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import * as userModel from '../../models/userModel.js';
import bcrypt from 'bcryptjs'

// GET: All users list
export const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.getAllUsers();
  
  return res.status(200).json(
    new ApiResponse(200, users, 'Users fetched successfully')
  );
});

// GET: Single user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(
    new ApiResponse(200, user, 'User retrieved successfully')
  );
});

// GET: Admin Dashboard Statistics
export const getStats = asyncHandler(async (req, res) => {
  const stats = await userModel.getDashboardStats();
  const recentUsers = await userModel.getRecentUsers();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats,
        recentUsers
      },
      'Dashboard stats fetched successfully'
    )
  );
});

// admin only -------


export const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, Email, and Password are required');
  }
 
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
    role
  });
  return res.status(201).json(
    new ApiResponse(201, { id: userId, name, email, role }, 'User created successfully')
  );

});

// PUT: Edit Existing User (Admin only)

export const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    throw new ApiError(400, 'Name, Email, and Role are required');
  }
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await userModel.updateUser(id, { name, email, role });
  return res.status(200).json(
    new ApiResponse(200, { id, name, email, role }, 'User updated successfully')
  );
});

// DELETE: Delete User (Admin only)

export const removeUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Security Rule: Admin-u swantham account delete cheyyaan permission kodukkaruthu!
  if (req.user.id === Number(id)) {
    throw new ApiError(400, 'You cannot delete your own admin account');
  }
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await userModel.deleteUser(id);
  return res.status(200).json(
    new ApiResponse(200, {}, 'User deleted successfully')
  );
});
