import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: false };

export const ShowMessageSlice = createSlice({
    name: "showMessage",
    initialState,
    reducers: {
        show: (state) => {
            state.value = true;
        },
        invisible: (state) => {
            state.value = false;
        },
    },
});

export const { show, invisible } = ShowMessageSlice.actions;

export default ShowMessageSlice.reducer;
