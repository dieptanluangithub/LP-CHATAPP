import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./Slice/ThemeSlice";
import ShowMessageSlice from "./Slice/ShowMessageSlice";
import UserSlice from "./Slice/UserSlice";
import ListFriendWaitSlice from "./Slice/ListFriendWaitSlice";
import AllFriendSlice from "./Slice/AllFriendSlice";
import AllGroupSlice from "./Slice/AllGroupSlice";
import ListMessageSlice from "./Slice/ListMessageSlice";
import CurrentMessageSlide from "./Slice/CurrentMessageSlide";
import SendingSlice from "./Slice/SendingSlice";
import CurrentPageSlice from "./Slice/CurrentPageSlice";
import CurrentMethodSlice from "./Slice/CurrentMethodSlice";
import SoundSlice from "./Slice/SoundSlice";
export const store = configureStore({
    reducer: {
        LocalTheme: ThemeSlice,
        ShowMessage: ShowMessageSlice,
        UserInfo: UserSlice,
        ListFriendWait: ListFriendWaitSlice,
        AllFriend: AllFriendSlice,
        AllGroup: AllGroupSlice,
        ListMessage: ListMessageSlice,
        CurrentMessage: CurrentMessageSlide,
        Sending: SendingSlice,
        CurrentPage: CurrentPageSlice,
        CurrentMethod: CurrentMethodSlice,
        Sound: SoundSlice,
    },
});
