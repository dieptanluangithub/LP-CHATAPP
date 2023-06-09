import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: {} };

export const SendingSlice = createSlice({
    name: "Sending",
    initialState,
    reducers: {
        add: (state, action) => {
            if (Array.isArray(state.data[action.payload.key])) {
                var list = [...state.data[action.payload.key]];
                list.push({
                    url: action.payload.url,
                    type: action.payload.type,
                    fileName: action.payload.fileName,
                });
                state.data[action.payload.key] = list;
            } else
                state.data[action.payload.key] = [
                    { url: action.payload.url, type: action.payload.type },
                ];
        },
        remove: (state, action) => {
            state.data[action.payload.key] = state.data[
                action.payload.key
            ].filter((value) => {
                return value.url !== action.payload.url;
            });
        },
    },
});

export const { add, remove } = SendingSlice.actions;

export default SendingSlice.reducer;
