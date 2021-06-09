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
import { User } from '../../models/User';
import { apiBaseUrl } from '../../../constants';
import { isUser } from '../../predicates/isUser';

export interface NavbarProps {
}

export interface NavbarState {
    active: boolean,
    accessToken: string,
    profileLoading: boolean,
    profileData?: User
}

export default class Navbar extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
        this.state = { active: false, accessToken: initialAccessToken, profileLoading: true };
    }

    async componentDidMount() {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "accessToken":
                    this.setState({
                        accessToken: message.value
                    });
            }
        });
        if (this.isAuthenticated()) {
            await fetch(`${apiBaseUrl}/users/profile`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.state.accessToken}`
                }
            }).then(response => response.json())
                .then(data => this.setState({
                    profileLoading: false,
                    profileData: {
                        id: data.id,
                        providerId: data.provider_id,
                        name: data.name,
                        role: data.role
                    }
                }));
        }
    }

    async componentDidUpdate() {
        // When we sign in -> set profile data if it is not set yet.
        // Else if we sign out -> wipe out profile data. 
        if (!this.state.profileData && this.isAuthenticated()) {
            await fetch(`${apiBaseUrl}/users/profile`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.state.accessToken}`
                }
            }).then(response => response.json())
                .then(data => this.setState({
                    profileLoading: false,
                    profileData: {
                        id: data.id,
                        providerId: data.provider_id,
                        name: data.name,
                        role: data.role
                    }
                }));
        } else if (this.state.profileData && !this.isAuthenticated()) {
            this.setState({
                profileData: undefined
            });
        }
    }

    render() {
        let profileParams: string = this.state.profileLoading.toString();
        if (isUser(this.state.profileData)) {
            profileParams = `${profileParams}/${this.state.profileData.role}/${this.state.profileData.name}`;
        }
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
                                <Link to={`/profile/${profileParams}`} onClick={this.handleClick}>
                                    <GooglePerson className="nav-profile"></GooglePerson>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/courselist/${this.state.accessToken}`} onClick={this.handleClick}>Course List</Link>
                            </li>
                            <li className={this.state.profileData && this.state.profileData.role === "Lecturer" ? "nav-item" : "nav-item no-permission"}>
                                <Link className="nav-link" to={`/createCourse/${this.state.accessToken}`} onClick={this.handleClick}>Create Course</Link>
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
                        {isSideBar ? (
                            <Redirect to={`/profile/${profileParams}`} push={true} />
                        ) : (
                            Number(initCourseId) !== -1 ? (
                                // FixMe: (remove) This case can not occur with the current implementation
                                <Redirect to={`/course`} push={true} />
                            ) : (
                                <Redirect to={`/courselist/${this.state.accessToken}`} push={true} />
                            )
                        )}
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