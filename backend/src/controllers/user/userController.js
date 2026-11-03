import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import * as userModel from '../../models/userModel.js';

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