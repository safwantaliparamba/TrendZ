import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice';
import alertReducer from './alertSlice'


const store = configureStore({
    reducer:{
        auth:authReducer,
        alert:alertReducer
    }
})

export default store