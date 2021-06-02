import React from 'react';
import { Link } from 'react-router-dom';
import GoogleClose from '../svg/GoogleClose';
import GoogleMenu from '../svg/GoogleMenu';
import OpenInNew from '../svg/OpenInNew';
import OppseeComponent from '../svg/OppseeLogo';
import { Redirect } from 'react-router';
import './Navbar.css';
import AutoLogoutCountdown from '../timer/AutoLogoutCountdown';
import GoogleRefresh from '../svg/GoogleRefresh';
import GooglePerson from '../svg/GooglePerson';

export interface NavbarProps {
}

export interface NavbarState {
    active: boolean,
    accessToken: string
}

export default class Navbar extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
        this.state = { active: false, accessToken: initialAccessToken };
    }

    componentDidMount() {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "accessToken":
                    this.setState({
                        accessToken: message.value
                    });
            }
        });
    }

    render() {
        return (
            <nav className='navbar'>
                <h1 className="navbar-oppsee">HAW-OPPSEE</h1>
                <OppseeComponent className="App-logo" />
                {this.isAuthenticated() ? (
                    <div className="authenticated">
                        {/* We need to pass a key, so React can differentiate different access token objects. */}
                        {/* Since access tokens itself are almost certainly unique, we can use them as a key.  */}
                        <AutoLogoutCountdown key={this.state.accessToken} initAccesstoken={this.state.accessToken}></AutoLogoutCountdown>
                        <GoogleRefresh className="refresh-icon" onClick={this.refreshSession}></GoogleRefresh>
                        <span className="menu-icon" onClick={this.handleClick}>
                            {this.state.active ? <GoogleClose /> : <GoogleMenu />}
                        </span>
                        <ul className={this.state.active ? 'navbar-menu active' : 'navbar-menu'}>
                            <li className="nav-item">
                                {/* Link to profile */}
                                <Link to={`/profile/${this.state.accessToken}`} onClick={this.handleClick}>
                                    <GooglePerson className="nav-profile"></GooglePerson>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/courselist/${this.state.accessToken}`} onClick={this.handleClick}>Course List</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/createcourse" onClick={this.handleClick}>Create Course</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-button" type="button" onClick={this.handleButtonClick}>
                                    <span className="nav-button-text">
                                        Course Overview&nbsp;
                                    </span>
                                    <OpenInNew className="open-new" />
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-button" type="button" onClick={this.signOut}>
                                    <span className="nav-button-text">
                                        Sign out
                                    </span>
                                </button>
                            </li>
                        </ul>
                        <Redirect to={`/profile/${this.state.accessToken}`} push={true} />
                    </div>
                ) : (
                    <Redirect to="/login" push={true} />
                )}
            </nav>
        );
    }

    handleClick = () => {
        this.setState({ active: !this.state.active });
    };
    handleButtonClick = () => {
        vscode.postMessage({ type: 'executeCommand', value: 'protoPanel' });
    };
    isAuthenticated = () => {
        return this.state.accessToken ? true : false;
    };
    refreshSession = () => {
        vscode.postMessage({ type: 'refresh' });
    };
    signOut = () => {
        vscode.postMessage({ type: 'signOut' });
    };
}