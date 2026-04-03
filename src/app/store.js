import { configureStore } from "@reduxjs/toolkit";
import financeReducer from "../features/finance/financeSlice";

export const store = configureStore({
    reducer: {
        finance: financeReducer,
    },
});