import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    alert:false,
    message:null,
    type:null
}

const alertSlice = createSlice({
    name:'alert',
    initialState,
    reducers:{
        addAlert(state,{payload}){
            state.alert = true;
            state.message = payload.message
            state.type = payload.type
        },
        close(state){
            return state = initialState;
        }
    },
})

export default alertSlice.reducer
export const alertActions = alertSlice.actions