import React, { Dispatch, SetStateAction } from "react";
import { Route, Switch, useHistory, useParams } from "react-router";
import ListOptionsSelect, { ListOptions } from "./ListOptionsSelect";
import Nav from "./Nav";
import PlayerFilterSelect from "./PlayerFilterSelect";
import { PlayerColumnsSelect } from "./PlayerColumnsSelect";
import { TeamSelect } from "./TeamSelect";
import { useTeamData } from "../../hooks";

export interface PlayerFilters {
    search: string;
    modifiers: string[];
    positions: string[];
    teams: string[];
}

export interface SidebarProps {
    filters: PlayerFilters;
    setFilters: Dispatch<SetStateAction<PlayerFilters>>;

    options: ListOptions;
    setOptions: Dispatch<SetStateAction<ListOptions>>;
}

function Sidebar(props: SidebarProps): JSX.Element {
    return (
        <div>
            <div className="sidebar-section">
                <Nav />
            </div>

            <Switch>
                <Route path="/" exact>
                    <PlayerFilterSelect
                        filters={props.filters}
                        setFilters={props.setFilters}
                    />
                </Route>
                <Route path="/team/:abbr">
                    <SingleTeamFilter />
                </Route>
            </Switch>

            <ListOptionsSelect
                options={props.options}
                setOptions={props.setOptions}
            />

            <PlayerColumnsSelect
                columns={props.options.columns}
                setColumns={(columns) =>
                    props.setOptions((opts) => ({ ...opts, columns: columns }))
                }
            />
        </div>
    );
}

function SingleTeamFilter() {
    const history = useHistory();
    const { abbr } = useParams<{ abbr: string }>();
    const teams = useTeamData();

    console.log("abbr", abbr);
    const selectedTeam = Object.values(teams.teamMap).find(
        (t) => t.shorthand === abbr
    );

    console.log("team", selectedTeam);

    return (
        <div className="sidebar-section">
            <div className="mb-3">
                <label htmlFor="player-team" className="form-label">
                    Team
                </label>
                <TeamSelect
                    id="player-team"
                    multi={false}
                    teams={selectedTeam ? [selectedTeam.id] : []}
                    setTeams={(newTeams) => {
                        const newSelected = teams.teamMap[newTeams[0]];
                        history.push(`/team/${newSelected.shorthand}`);
                    }}
                />
            </div>
        </div>
    );
}

export default Sidebar;
