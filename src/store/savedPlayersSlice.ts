import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SavedPlayerState {
    players: string[];
}

const initialState = { players: [] } as SavedPlayerState;

export const savedPlayersSlice = createSlice({
    name: "savedPlayers",
    initialState,
    reducers: {
        save: (state, action: PayloadAction<string>) => {
            if (state.players.includes(action.payload)) return;
            state.players.push(action.payload);
        },
        unsave: (state, action: PayloadAction<string>) => {
            state.players = state.players.filter((id) => id !== action.payload);
        },
        clear: (state) => {
            state.players = [];
        },
    },
});

export const { save, unsave, clear } = savedPlayersSlice.actions;
