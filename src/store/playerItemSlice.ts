import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface playerItemState {
    toShow: string[];
}

const initialState = { toShow: [] } as playerItemState;

export const playerItemSlice = createSlice({
    name: "playerItems",
    initialState,
    reducers: {
        toggle: (state, action: PayloadAction<string>) => {
            if (state.toShow.includes(action.payload)) {
                state.toShow = state.toShow.filter((id) => id !== action.payload);
            }
            else {
                state.toShow.push(action.payload);
            }
        },
        clear: (state) => {
            state.toShow = [];
        },
    },
});

export const { toggle, clear } = playerItemSlice.actions;
