import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { PostsState } from '../../core/models';
import { fetchPostsByPage } from '../../relay/services';

const initialState: PostsState = {
    posts: [],
    count: 0,
    loading: null,
    error: null,
};

export const getPostsByPage = createAsyncThunk('users/fetchByIdStatus', (page: number) => {
    return fetchPostsByPage(page);
});

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPostsByPage.pending, (state: PostsState) => {
            state.loading = true;
        });
        builder.addCase(getPostsByPage.fulfilled, (state: PostsState, { payload }: any) => {
            state.loading = false;
            state.posts = [...state.posts, ...payload.data];
            state.count = Math.max(...[state.count, payload.count]);
        });
        builder.addCase(getPostsByPage.rejected, (state: PostsState, action: any) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export default postsSlice.reducer;
