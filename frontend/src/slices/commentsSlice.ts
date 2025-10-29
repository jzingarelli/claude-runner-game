import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CommentItem { id: string; postId: string; content: string; }
export interface CommentsState { items: CommentItem[]; total: number; }

const initialState: CommentsState = { items: [], total: 0 };

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<{ items: CommentItem[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
  },
});

export const { setComments } = commentsSlice.actions;
export default commentsSlice.reducer;
