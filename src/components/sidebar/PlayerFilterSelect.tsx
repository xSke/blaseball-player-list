import React, { Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { useAllModifiers } from "../../hooks";
import ModifierSelect from "./ModifierSelect";
import { TeamSelect } from "./TeamSelect";

export interface PlayerFilters {
    search: string;
    modifiers: string[];
    positions: string[];
    teams: string[];
}

export interface PlayerFilterSelectProps {
    filters: PlayerFilters;
    setFilters: Dispatch<SetStateAction<PlayerFilters>>;
}

function PlayerFilterSelect(props: PlayerFilterSelectProps): JSX.Element {
    const mods = useAllModifiers();

    return (
        <div className="sidebar-section">
            <div className="mb-3">
                <label htmlFor="player-name-search" className="form-label">
                    Search
                </label>
                <Search {...props} />
            </div>

            <div className="mb-3">
                <label htmlFor="player-name-search" className="form-label">
                    Modification
                </label>
                <ModifierSelect
                    id={"player-mods"}
                    selected={props.filters.modifiers}
                    setSelected={(modifiers) => {
                        props.setFilters((old) => ({ ...old, modifiers }));
                    }}
                    mods={Object.values(mods)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="player-mods" className="form-label">
                    Position
                </label>
                <PositionSelect {...props} />
            </div>

            <div className="mb-3">
                <label htmlFor="player-team" className="form-label">
                    Team
                </label>
                <TeamSelect
                    id="player-team"
                    multi={true}
                    teams={props.filters.teams}
                    setTeams={(teams) =>
                        props.setFilters((filters) => ({ ...filters, teams }))
                    }
                />
            </div>
        </div>
    );
}

function Search(props: PlayerFilterSelectProps) {
    return (
        <input
            id="player-name-search"
            type="text"
            className="form-control"
            value={props.filters.search}
            onChange={(e) =>
                props.setFilters((old) => ({
                    ...old,
                    search: e.target.value,
                }))
            }
            placeholder="Search by name..."
        />
    );
}

function PositionSelect(props: PlayerFilterSelectProps) {
    return (
        <Select
            isMulti
            options={[
                { value: "lineup", label: "Lineup" },
                { value: "rotation", label: "Rotation" },
                { value: "bullpen", label: "Bullpen" },
                { value: "bench", label: "Bench" },
            ]}
            onChange={(newItems) => {
                const positions = newItems.map((item) => item.value);
                props.setFilters((old) => ({
                    ...old,
                    positions,
                }));
            }}
        />
    );
}

export default PlayerFilterSelect;
