import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    theme: localStorage.getItem("theme") || "ligth",
};

export const themeSlice = createSlice({
    name: "LocalTheme",
    initialState,
    reducers: {
        change: (state) => {
            state.theme = state.theme === "dark" ? "ligth" : "dark";
            localStorage.setItem("theme", state.theme);
        },
    },
});

// Action creators are generated for each case reducer function
export const { change } = themeSlice.actions;

export default themeSlice.reducer;
