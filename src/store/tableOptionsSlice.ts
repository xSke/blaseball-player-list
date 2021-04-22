import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ListColumn =
    | "team"
    | "position"
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
}

const initialState = {
    columns: {
        team: true,
        position: true,
        batting: true,
        pitching: true,
        baserunning: true,
        defense: true,
        vibestats: true,
        misc: true,
    },
    useRealStars: true,
    showAdvancedStats: true,
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
    },
});

export const {
    setColumn,
    setUseRealStars,
    setShowAdvancedStats,
} = tableOptionsSlice.actions;
