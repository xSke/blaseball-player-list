import React from "react";
import { Route, Switch, useHistory, useParams } from "react-router";
import ListOptionsSelect from "./ListOptionsSelect";
import Nav from "./Nav";
import PlayerFilterSelect from "./PlayerFilterSelect";
import { PlayerColumnsSelect } from "./PlayerColumnsSelect";
import { TeamSelect } from "./TeamSelect";
import { useLeagueData } from "../../api/fetchhooks";

function Sidebar(): JSX.Element {
    return (
        <div>
            <div className="sidebar-section">
                <Nav />
            </div>

            <Switch>
                <Route path="/" exact>
                    <PlayerFilterSelect />
                </Route>
                <Route path="/team/:abbr">
                    <SingleTeamFilter />
                </Route>
            </Switch>

            <div className="sidebar-section">
                <ListOptionsSelect />
                <PlayerColumnsSelect />
            </div>
        </div>
    );
}

function SingleTeamFilter() {
    const history = useHistory();
    const { abbr } = useParams<{ abbr: string }>();

    const data = useLeagueData();
    if (!data) return null;

    const selectedTeam = Object.values(data.teams).find(
        (t) => t.shorthand === abbr || t.id === abbr
    );

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
                        const newSelected = data.teams[newTeams[0]];
                        history.push(`/team/${newSelected.id}`);
                    }}
                />
            </div>
        </div>
    );
}

export default Sidebar;
