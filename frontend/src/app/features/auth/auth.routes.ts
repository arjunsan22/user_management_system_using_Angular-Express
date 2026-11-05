import { Routes } from "@angular/router";
import { guestGuard } from "../../core/guards/guest.guard";

export const AUTH_ROUTES: Routes=[
    {
        path:'login',
        canActivate:[guestGuard],
        loadComponent:() => import('./pages/login/login').then(m => m.Login)
    },
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    }
]