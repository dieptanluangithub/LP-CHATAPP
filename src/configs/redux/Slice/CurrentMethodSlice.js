import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    method: null,
};

export const CurrentMethodSlice = createSlice({
    name: "CurrenrMethod",
    initialState,
    reducers: {
        changeMethod: (state, action) => {
            state.method = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { changeMethod } = CurrentMethodSlice.actions;

export default CurrentMethodSlice.reducer;
