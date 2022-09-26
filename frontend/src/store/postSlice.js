import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addToPost(state, { payload }) {
            return (state = [payload, ...state]);
        },
        initialPost(state, { payload }) {
            return (state = payload);
        },
        deletePost(state, { payload }) {
            const postId = payload.postId;
            const posts = state;
            const modifiedPosts = posts.filter((post) => post.id !== postId);
            return state = modifiedPosts;
        },
    },
});

export default postSlice.reducer;
export const postActions = postSlice.actions;
