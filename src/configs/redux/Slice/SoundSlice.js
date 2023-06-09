import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    sound: localStorage.getItem("sound") === "false" ? false : true,
};

export const soundSlice = createSlice({
    name: "LocalTheme",
    initialState,
    reducers: {
        changeSound: (state) => {
            state.sound = state.sound === true ? false : true;
            localStorage.setItem("sound", state.sound);
        },
    },
});

// Action creators are generated for each case reducer function
export const { changeSound } = soundSlice.actions;

export default soundSlice.reducer;
