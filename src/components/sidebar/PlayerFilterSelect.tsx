import React from "react";
import {
    setMods,
    setPositions,
    setSearch,
    setTeams,
} from "../../store/playerFilterSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ModifierSelect from "./ModifierSelect";
import { TeamSelect } from "./TeamSelect";
import Select from "react-select";

function PlayerFilterSelect(): JSX.Element {
    return (
        <div className="sidebar-section">
            <Search />
            <ModifierFilter />
            <PositionFilter />
            <TeamFilter />
        </div>
    );
}

function Search() {
    const dispatch = useAppDispatch();
    const search = useAppSelector((state) => state.playerFilter.search);

    return (
        <div className="mb-3">
            <label htmlFor="player-name-search" className="form-label">
                Search
            </label>
            <input
                id="player-name-search"
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                placeholder="Search by name..."
            />
        </div>
    );
}

function TeamFilter() {
    const dispatch = useAppDispatch();
    const selected = useAppSelector((state) => state.playerFilter.teams);

    return (
        <div className="mb-3">
            <label htmlFor="player-team" className="form-label">
                Team
            </label>
            <TeamSelect
                id="player-team"
                multi={true}
                teams={selected}
                setTeams={(teams) => dispatch(setTeams(teams))}
            />
        </div>
    );
}

function PositionFilter() {
    const dispatch = useAppDispatch();

    return (
        <div className="mb-3">
            <label htmlFor="player-position" className="form-label">
                Position
            </label>
            <Select
                id="player-position"
                isMulti
                options={[
                    { value: "lineup", label: "Lineup" },
                    { value: "rotation", label: "Rotation" },
                    { value: "shadows", label: "Shadows" },
                ]}
                onChange={(newItems) => {
                    const positions = newItems.map((item) => item.value);
                    dispatch(setPositions(positions));
                }}
            />
        </div>
    );
}

function ModifierFilter() {
    const dispatch = useAppDispatch();
    const selected = useAppSelector((state) => state.playerFilter.mods);

    return (
        <div className="mb-3">
            <label htmlFor="player-mods" className="form-label">
                Modification
            </label>
            <ModifierSelect
                id="player-mods"
                mods={selected}
                setMods={(newMods) => dispatch(setMods(newMods))}
            />
        </div>
    );
}

export default PlayerFilterSelect;
