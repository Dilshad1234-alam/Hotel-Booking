import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/state/auth.slice'
import adminRouter from './features/admin/state/admin.slice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminRouter
    }
    
})