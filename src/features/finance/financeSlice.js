import { createSlice } from "@reduxjs/toolkit";
import { mockData } from "../../data/mockData";

const loadTransactions = () => {
    if (typeof window === "undefined") {
        return mockData;
    }

    try {
        const stored = window.localStorage.getItem("transactions");
        return stored ? JSON.parse(stored) : mockData;
    } catch {
        return mockData;
    }
};

const initialState = {
    transactions: loadTransactions(),
    role: "viewer",
    darkMode: false,
    search: "",
    filter: "all",
};

const financeSlice = createSlice({
    name: "finance",
    initialState,
    reducers: {
        addTransaction: (state, action) => {
            state.transactions.push(action.payload);
            localStorage.setItem("transactions", JSON.stringify(state.transactions));
        },
        updateTransaction: (state, action) => {
            const index = state.transactions.findIndex((t) => t.id === action.payload.id);

            if (index !== -1) {
                state.transactions[index] = action.payload;
                localStorage.setItem("transactions", JSON.stringify(state.transactions));
            }
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
    },
});

export const {
    addTransaction,
    updateTransaction,
    setRole,
    toggleDarkMode,
    setSearch,
    setFilter,
} = financeSlice.actions;

export default financeSlice.reducer;