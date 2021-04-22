import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import AllPlayerPage from "./pages/AllPlayerPage";
import { BrowserRouter } from "react-router-dom";
import Sidebar, { PlayerFilters } from "./components/sidebar/Sidebar";
import { ListOptions } from "./components/sidebar/ListOptionsSelect";
import SavedPlayersPage from "./pages/SavedPlayersPage";
import SingleTeamPage from "./pages/SingleTeamPage";

function App(): JSX.Element {
    const [filters, setFilters] = useState<PlayerFilters>(() => ({
        search: "",
        modifiers: [],
        positions: [],
        teams: [],
    }));

    const [options, setOptions] = useState<ListOptions>(() => ({
        group: false,
        showAdvancedStats: true,
        useRealStars: true,
        columns: ["batting", "pitching", "baserunning", "defense"],
    }));

    const [saved, setSaved] = useState<string[]>([]);

    return (
        <BrowserRouter>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3 col-lg-2 sidebar">
                        <Sidebar
                            filters={filters}
                            setFilters={setFilters}
                            options={options}
                            setOptions={setOptions}
                        />
                    </div>
                    <div className="col-md-9 col-lg-10 main">
                        <Switch>
                            <Route path="/saved">
                                <SavedPlayersPage
                                    options={options}
                                    saved={saved}
                                    setSaved={setSaved}
                                />
                            </Route>
                            <Route path="/team/:abbr">
                                <SingleTeamPage
                                    options={options}
                                    saved={saved}
                                    setSaved={setSaved}
                                />
                            </Route>
                            <Route path="/team">
                                <Redirect to="/team/KCBM" />
                            </Route>
                            <Route path="/">
                                <AllPlayerPage
                                    filters={filters}
                                    options={options}
                                    saved={saved}
                                    setSaved={setSaved}
                                />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
