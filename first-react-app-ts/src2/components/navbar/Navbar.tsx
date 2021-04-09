import React from 'react';
import { Link } from 'react-router-dom';
import GoogleClose from '../svg/GoogleClose';
import GoogleMenu from '../svg/GoogleMenu';
import OpenInNew from '../svg/OpenInNew';
import OppseeComponent from '../svg/OppseeLogo';
import './Navbar.css';

export interface NavbarProps {

}

export interface NavbarState {
    active: boolean
}

export default class Navbar extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
        this.state = { active: false };
    }

    render() {
        return (
            <nav className="navbar">
                <h1 className="navbar-oppsee">HAW-OPPSEE</h1>
                <OppseeComponent className="App-logo" />
                <span className="menu-icon" onClick={this.handleClick}>
                    {this.state.active ? <GoogleClose /> : <GoogleMenu />}
                </span>
                <ul className={this.state.active ? 'navbar-menu active' : 'navbar-menu'}>
                    <li className="nav-item">
                        <Link className="nav-link" to="/" onClick={this.handleClick}>Course List</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/createcourse" onClick={this.handleClick}>Create Course</Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-button" type="button" onClick={this.handleButtonClick}>
                            <span className="course-overview">
                                Course Overview&nbsp;
                            </span>
                            <OpenInNew className="open-new"/>
                        </button>
                    </li>
                </ul>
                {/* <button className="nav-button" type="button" onClick={this.handleButtonClick}>Course Overview</button> */}
            </nav>
        );
    }

    handleClick = () => {
        this.setState({ active: !this.state.active });
    };
    handleButtonClick = () => {
        vscode.postMessage({ type: 'executeCommand', value: 'protoPanel' });
    };
}