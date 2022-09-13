import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice';
import alertReducer from './alertSlice'
import postReducer from './postSlice'


const store = configureStore({
    reducer:{
        auth:authReducer,
        alert:alertReducer,
        posts:postReducer
    }
})

export default store