import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WebhookEndpoint { id: string; url: string; enabled: boolean }
export interface WebhooksState { endpoints: WebhookEndpoint[] }

const initialState: WebhooksState = { endpoints: [] };

const webhooksSlice = createSlice({
  name: 'webhooks',
  initialState,
  reducers: {
    setEndpoints(state, action: PayloadAction<WebhookEndpoint[]>) {
      state.endpoints = action.payload;
    },
  },
});

export const { setEndpoints } = webhooksSlice.actions;
export default webhooksSlice.reducer;
