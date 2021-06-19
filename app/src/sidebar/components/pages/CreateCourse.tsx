import React from "react";
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
}

class CreateCourse extends React.Component<CreateCourseProps, CreateCourseState> {
    password: string;
    courseName: string;
    courseNameValidated: boolean;
    passwordValidated: boolean;
    confirmedPasswordValidated: boolean;
    constructor(props: CreateCourseProps) {
        super(props);
        this.password = "";
        this.courseName = "";
        this.courseNameValidated = false;
        this.passwordValidated = false;
        this.confirmedPasswordValidated = false;
    }

    render() {
        return (
            <div className="create-container">
                <form>
                    <h2 className="create-header">Create Course</h2>
                    <div className="course-input">
                        <label className="label">Course name</label>
                        <input className="input" name="courseName" placeholder="Course name" onChange={this.onChangeCourseName} required />
                    </div>
                    <div className="course-input">
                        <label className="label">Course description</label>
                        <input className="input" name="courseDescription" placeholder="Course description" />
                    </div>
                    <div className="course-input">
                        <label className="label">Password</label>
                        <input className="input" type="password" name="password" id="password" onChange={this.onChangePassword} required />
                    </div>
                    <div className="course-input">
                        <label className="label">Confirm password</label>
                        <input className="input" type="password" name="password-confirmed" id="password-confirmed" onChange={this.onChangeConfirmedPassword} required />
                    </div>
                    <button onClick={this.onClickSubmit}>Create Course</button>
                </form>
            </div>
        );
    }

    onChangeCourseName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.courseName = event.currentTarget.value;
        if(this.courseName) {
            this.courseNameValidated = true;
        } else {
            this.courseNameValidated = false;
        }
    };

    onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const pwd: string = event.currentTarget.value;
        this.password = pwd;
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
    };

    onChangeConfirmedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const confirmedPwd: string = event.currentTarget.value;
        if (this.password === confirmedPwd
            && confirmedPwd.length >= 8
            && /\d/.test(confirmedPwd) && /[a-z]/.test(confirmedPwd) && /[A-Z]/.test(confirmedPwd)) {
            event.currentTarget.setCustomValidity("");
            this.confirmedPasswordValidated = true;
        } else {
            event.currentTarget.setCustomValidity("Passwords do not match!");
            this.confirmedPasswordValidated = false;
        }
    };

    onClickSubmit = async () => {
        if(this.courseNameValidated && this.passwordValidated && this.confirmedPasswordValidated) {
            await fetch(`${apiBaseUrl}/courses`, {
                method: 'POST',
                // Auth header not required yet to fetch courses from api. 
                // Still included to prevent errors in case of future api updates.    
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.props.match.params.accessToken}`,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Accept': 'application/json',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: this.courseName, password: this.password })
            }).then(response => {
                if (response.status === 201) {
                    vscode.postMessage({ type: 'onInfo', value: `Course "${this.courseName}" created successfully!` });
                } else {
                    vscode.postMessage({ type: 'onInfo', value: `Failed to create course!` });
                }
            });
        }
    };
}
export default withRouter(CreateCourse);