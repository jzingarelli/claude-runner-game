import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PostItem { id: string; content: string; platform: string; publishedAt?: string }
export interface PostsState { items: PostItem[]; total: number; }

const initialState: PostsState = { items: [], total: 0 };

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<{ items: PostItem[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;
