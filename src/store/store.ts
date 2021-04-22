import { configureStore } from "@reduxjs/toolkit";
import { playerFilterSlice } from "./playerFilterSlice";
import { savedPlayersSlice } from "./savedPlayersSlice";
import { tableOptionsSlice } from "./tableOptionsSlice";
export const store = configureStore({
    reducer: {
        savedPlayers: savedPlayersSlice.reducer,
        tableOptions: tableOptionsSlice.reducer,
        playerFilter: playerFilterSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
