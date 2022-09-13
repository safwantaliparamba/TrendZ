import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addToPost(state, { payload }) {
            // const oldState = state;
            // oldState.push(payload);
            return state = [payload,...state];
        },
        initialPost(state, { payload }) {
            return state = payload;
        },
    },
});

export default postSlice.reducer;
export const postActions = postSlice.actions;
