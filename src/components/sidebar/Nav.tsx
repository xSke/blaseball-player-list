import { NavLink } from "react-router-dom";

function Nav(): JSX.Element {
    return (
        <ul className="nav nav-pills flex-column">
            <li className="nav-item">
                <NavLink
                    className="nav-link"
                    activeClassName="active"
                    to="/"
                    exact
                >
                    All players
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                    className="nav-link"
                    activeClassName="active"
                    to="/team"
                >
                    Single team
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                    className="nav-link"
                    activeClassName="active"
                    to="/saved"
                >
                    Saved players
                </NavLink>
            </li>
        </ul>
    );
}

export default Nav;
