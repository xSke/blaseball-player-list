import React from "react";
import { Redirect, Route, Switch } from "react-router";
import AllPlayerPage from "./pages/AllPlayerPage";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import SavedPlayersPage from "./pages/SavedPlayersPage";
import SingleTeamPage from "./pages/SingleTeamPage";

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3 col-lg-2 sidebar">
                        <Sidebar />
                    </div>
                    <div className="col-md-9 col-lg-10 main">
                        <Switch>
                            <Route path="/saved">
                                <SavedPlayersPage />
                            </Route>
                            <Route path="/team/:abbr">
                                <SingleTeamPage />
                            </Route>
                            <Route path="/team">
                                <Redirect to="/team/KCBM" />
                            </Route>
                            <Route path="/">
                                <AllPlayerPage />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
