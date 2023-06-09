import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    page: 1,
};

export const CurrentPageSlice = createSlice({
    name: "CurrenrPage",
    initialState,
    reducers: {
        change: (state, action) => {
            state.page = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { change } = CurrentPageSlice.actions;

export default CurrentPageSlice.reducer;
