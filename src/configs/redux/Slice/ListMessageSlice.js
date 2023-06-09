import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllMessage,
    getInitListMessage,
} from "configs/firebase/ServiceFirebase/ServiceFind";

const initialState = {
    listMessage: [],
};

export const GetListMessage = createAsyncThunk(
    "ListMessage/getAllMessage",
    async (uid) => {
        return await getAllMessage(uid);
    }
);
export const SetListMessage = createAsyncThunk(
    "ListMessage/setListMessage",
    async (promise) => {
        return promise;
    }
);
export const ReInitListMessage = createAsyncThunk(
    "ListMessage/ReInitListMessage",
    async (list) => {
        return await getInitListMessage(list);
    }
);

export const ListMessageSlice = createSlice({
    name: "ListMessage",
    initialState,
    reducers: {
        setList: (state, action) => {
            state.listMessage = action.payload;
        },
        clear: (state) => {
            state.listMessage = [];
        },
        updateTime: (state, action) => {
            var key = action.payload.key;
            var time = action.payload.timeUpdate;
            for (var i = 0; i < state.listMessage.length; i++) {
                if (state.listMessage[i].messageId === key) {
                    if (state.listMessage[i].timeUpdate !== time) {
                        state.listMessage[i].timeUpdate = time;
                        return;
                    }
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(GetListMessage.fulfilled, (state, action) => {
            state.listMessage = action.payload;
        });
        builder.addCase(SetListMessage.fulfilled, (state, action) => {
            state.listMessage = action.payload;
        });
        builder.addCase(ReInitListMessage.fulfilled, (state, action) => {
            state.listMessage = action.payload;
        });
    },
});

// Action creators are generated for each case reducer function
export const { clear, setList, updateTime } = ListMessageSlice.actions;

export default ListMessageSlice.reducer;
