import { configureStore } from "@reduxjs/toolkit";
import { playerFilterSlice } from "./playerFilterSlice";
import { playerItemSlice } from "./playerItemSlice";
import { savedPlayersSlice } from "./savedPlayersSlice";
import { tableOptionsSlice } from "./tableOptionsSlice";

export const store = configureStore({
    reducer: {
        savedPlayers: savedPlayersSlice.reducer,
        tableOptions: tableOptionsSlice.reducer,
        playerFilter: playerFilterSlice.reducer,
        playerItems: playerItemSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
