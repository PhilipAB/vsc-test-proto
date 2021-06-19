import React from "react";
import './Login.css';

export default class Login extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="wrapper">
                    <button className="login-button" type="button" onClick={this.handleButtonClick}>
                        Sign in
                    </button>
                </div>
            </div>
        );
    }

    handleButtonClick = () => {
        vscode.postMessage({ type: 'executeCommand', value: 'authenticate' });
    };
};
