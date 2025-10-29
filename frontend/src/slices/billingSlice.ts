import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Plan { key: 'basic' | 'pro' | 'enterprise'; name: string; priceMonthlyCents: number }
export interface Subscription { organizationId: string; planKey: Plan['key']; status: string }
export interface BillingState { plans: Plan[]; subscription?: Subscription }

const initialState: BillingState = { plans: [] };

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setPlans(state, action: PayloadAction<Plan[]>) {
      state.plans = action.payload;
    },
    setSubscription(state, action: PayloadAction<Subscription | undefined>) {
      state.subscription = action.payload;
    },
  },
});

export const { setPlans, setSubscription } = billingSlice.actions;
export default billingSlice.reducer;
