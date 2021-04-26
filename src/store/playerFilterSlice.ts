import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayerFilterSlice {
    search: string;
    teams: string[];
    mods: string[];
    positions: string[];
    statuses: string[];
}

const initialState = {
    search: "",
    teams: [],
    mods: [],
    positions: [],
    statuses: [],
} as PlayerFilterSlice;

export const playerFilterSlice = createSlice({
    name: "playerFilter",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setTeams: (state, action: PayloadAction<string[]>) => {
            state.teams = action.payload;
        },
        setMods: (state, action: PayloadAction<string[]>) => {
            state.mods = action.payload;
        },
        setPositions: (state, action: PayloadAction<string[]>) => {
            state.positions = action.payload;
        },
        setStatuses: (state, action: PayloadAction<string[]>) => {
            state.statuses = action.payload;
        },
    },
});

export const {
    setSearch,
    setTeams,
    setMods,
    setPositions,
    setStatuses,
} = playerFilterSlice.actions;
