import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllGroup } from "configs/firebase/ServiceFirebase/ServiceFind";

const initialState = {
    listGroup: [],
};

export const GetAll = createAsyncThunk("AllGroup/getall", async (uid) => {
    return await getAllGroup(uid);
});

export const AllGroupSlice = createSlice({
    name: "AllGroup",
    initialState,
    reducers: {
        add: (state, action) => {
            state.listGroup = action.payload;
        },
        clear: (state) => {
            state.listGroup = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(GetAll.pending, (state, action) => {});
        builder.addCase(GetAll.fulfilled, (state, action) => {
            state.listGroup = action.payload;
        });
    },
});

// Action creators are generated for each case reducer function
export const { add, clear } = AllGroupSlice.actions;

export default AllGroupSlice.reducer;
