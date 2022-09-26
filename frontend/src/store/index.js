import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice';
import alertReducer from './alertSlice'
import postReducer from './postSlice'


const store = configureStore({
    reducer:{
        posts:postReducer,
        auth:authReducer,
        alert:alertReducer,
    }
})

export default store