import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ListColumn =
    | "playerid"
    | "team"
    | "position"
    | "items"
    | "batting"
    | "pitching"
    | "baserunning"
    | "defense"
    | "vibestats"
    | "misc";

export interface TableOptionsSlice {
    columns: Record<ListColumn, boolean>;
    useRealStars: boolean;
    showAdvancedStats: boolean;
    applyItemAdjustments: boolean;
    showUnscatteredNames: boolean;
}

const initialState = {
    columns: {
        playerid: false,
        team: true,
        position: true,
        items: false,
        batting: true,
        pitching: true,
        baserunning: true,
        defense: true,
        vibestats: false,
        misc: true,
    },
    applyItemAdjustments: true,
    useRealStars: true,
    showAdvancedStats: true,
    showUnscatteredNames: true
} as TableOptionsSlice;

export const tableOptionsSlice = createSlice({
    name: "options",
    initialState,
    reducers: {
        setColumn: (
            state,
            action: PayloadAction<{ column: ListColumn; value: boolean }>
        ) => {
            state.columns[action.payload.column] = action.payload.value;
        },
        setUseRealStars: (state, action: PayloadAction<boolean>) => {
            state.useRealStars = action.payload;
        },
        setShowAdvancedStats: (state, action: PayloadAction<boolean>) => {
            state.showAdvancedStats = action.payload;
        },
        setApplyItemAdjustments: (state, action: PayloadAction<boolean>) => {
            state.applyItemAdjustments = action.payload;
        },
        setShowUnscatteredNames: (state, action: PayloadAction<boolean>) => {
            state.showUnscatteredNames = action.payload;
        },
    },
});

export const {
    setColumn,
    setUseRealStars,
    setShowAdvancedStats,
    setApplyItemAdjustments,
    setShowUnscatteredNames,
} = tableOptionsSlice.actions;
