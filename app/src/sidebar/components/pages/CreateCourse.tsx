import React from "react";
import autosize from "autosize";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { apiBaseUrl } from "../../../constants";
import './CreateCourse.css';

export interface CreateCoursePathParams {
    accessToken: string
}

export interface CreateCourseProps extends RouteComponentProps<CreateCoursePathParams> {
}

export interface CreateCourseState {
    password: string;
    confirmedPwd: string;
    courseName: string;
    courseDescription: string;
}

class CreateCourse extends React.Component<CreateCourseProps, CreateCourseState> {
    passwordValidated: boolean;
    confirmedPasswordValidated: boolean;
    descriptionTextArea: HTMLTextAreaElement | null;
    constructor(props: CreateCourseProps) {
        super(props);
        this.passwordValidated = false;
        this.confirmedPasswordValidated = false;
        this.descriptionTextArea = null;
        this.state = {
            password: "",
            confirmedPwd: "",
            courseName: "",
            courseDescription: ""
        };
    }

    componentDidMount() {
        if (this.descriptionTextArea) {
            this.descriptionTextArea.focus();
            autosize(this.descriptionTextArea);
        }
    }

    render() {
        return (
            <div className="create-container">
                <form>
                    <h2 className="create-header">Create Course</h2>
                    <div className="course-input">
                        <label className="label">Course name</label>
                        <input className="input" name="courseName" placeholder="Course name" onChange={this.onChangeCourseName} value={this.state.courseName} required />
                    </div>
                    <div className="course-input">
                        <label className="label">Course description</label>
                        <textarea className="input" ref={this.setTextAreaRef} name="courseDescription" placeholder="Course description" onChange={this.onChangeCourseDescription} value={this.state.courseDescription} />
                    </div>
                    <div className="course-input">
                        <label className="label">Password</label>
                        <input className="input" type="password" name="password" id="password" onChange={this.onChangePassword} value={this.state.password} required />
                    </div>
                    <div className="course-input">
                        <label className="label">Confirm password</label>
                        <input className="input" type="password" name="password-confirmed" id="password-confirmed" onChange={this.onChangeConfirmedPassword} value={this.state.confirmedPwd} required />
                    </div>
                    <button onClick={this.onClickSubmit}>Create Course</button>
                </form>
            </div>
        );
    }

    onChangeCourseName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            courseName: event.currentTarget.value
        });
    };

    setTextAreaRef = (textAreaElement: HTMLTextAreaElement | null) => {
        this.descriptionTextArea = textAreaElement;
    };

    onChangeCourseDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            courseDescription: event.currentTarget.value
        });
    };

    onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const pwd: string = event.currentTarget.value;
        if (pwd.length >= 8) {
            let errMsg: string = "";
            if (!/\d/.test(pwd)) {
                errMsg += "Password should countain at least 1 number. ";
            }
            if (!/[a-z]/.test(pwd)) {
                errMsg += "Password should contain at least one lowercase character. ";
            }
            if (!/[A-Z]/.test(pwd)) {
                errMsg += "Password should contain at least one upercase character.";
            }
            if (errMsg) {
                event.currentTarget.setCustomValidity(errMsg);
                this.passwordValidated = false;
            } else {
                event.currentTarget.setCustomValidity("");
                this.passwordValidated = true;
            }
        }
        else {
            event.currentTarget.setCustomValidity("Password should contain at least 8 characters.");
            this.passwordValidated = false;
        }
        this.setState({
            password: pwd
        });
        // Working with the state is prone to errors, since the state is updated asynchronously.
        // Usually we could use the callback method in setState instead of using a local variable.
        // However in this case this results in errors related to the event.
    };

    onChangeConfirmedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const confirmedPwd: string = event.currentTarget.value;
        if (this.state.password === confirmedPwd
            && confirmedPwd.length >= 8
            && /\d/.test(confirmedPwd) && /[a-z]/.test(confirmedPwd) && /[A-Z]/.test(confirmedPwd)) {
            event.currentTarget.setCustomValidity("");
            this.confirmedPasswordValidated = true;
        } else {
            event.currentTarget.setCustomValidity("Passwords do not match!");
            this.confirmedPasswordValidated = false;
        }
        // Working with the state is prone to errors, since the state is updated asynchronously.
        // Usually we could use the callback method in setState instead of using a local variable.
        // However in this case this results in errors related to the event.
        this.setState({
            confirmedPwd: confirmedPwd
        });
    };

    onClickSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.state.courseName && this.passwordValidated && this.confirmedPasswordValidated) {
            // The default behaviour seems to be a redirect to the course creation page with the form values as query parameters. 
            // This would result in an error. Therefore, we need to prevent it. 
            event.preventDefault();
            try {
                await fetch(`${apiBaseUrl}/courses`, {
                    method: 'POST',  
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Authorization': `Bearer ${this.props.match.params.accessToken}`,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Accept': 'application/json',
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: this.state.courseName, password: this.state.password, description: this.state.courseDescription })
                }).then(response => {
                    if (response.status === 201) {
                        vscode.postMessage({ type: 'onInfo', value: `Course "${this.state.courseName}" created successfully!` });
                        this.setState({
                            courseName: "",
                            courseDescription: "",
                            password: "",
                            confirmedPwd: ""
                        });
                    } else if(response.status === 409) {
                        vscode.postMessage({ type: 'onInfo', value: `Course with name ${this.state.courseName} already exists!` });
                    } else {
                        vscode.postMessage({ type: 'onInfo', value: `Failed to create course!` });
                    }
                });
            } catch (error) {
                vscode.postMessage({ type: 'onInfo', value: `Failed to create course!` });
            }
        }
    };
}
export default withRouter(CreateCourse);