import React from "react";
import { apiBaseUrl } from "../../../constants";
import { UserCourseRole } from "../../../models/User";
import { isUserArray } from "../../../predicates/isUserArray";
import CodiconsSync from "../../../svg/CodiconsSync";
import { UserTable } from "../../user-table/UserTable";
import './Course.css';

export interface CourseProps {
}

export interface CourseState {
    loading: boolean
    authorized: boolean
    userData: UserCourseRole[]
    showUserData: boolean
}

export default class Course extends React.Component<CourseProps, CourseState> {
    id: number;
    name: string;
    role: "CourseAdmin" | "Teacher" | "Student" | "";
    password: string;
    accessToken: string;
    description: string;
    constructor(props: CourseProps) {
        super(props);
        this.state = {
            loading: false,
            authorized: false,
            userData: [],
            showUserData: false
        };

        this.id = Number(initCourseId);

        this.name = courseName;
        this.role = courseUserRole;
        this.accessToken = initialAccessToken;
        this.description = courseDescription;
        this.password = "";
    }

    async componentDidMount() {
        if (this.role) {
            this.setState({
                loading: true
            });
            await this.updateLastVisited();
            this.setState({
                authorized: true,
                loading: false
            });
        } else {
            this.setState({
                loading: true
            });
            await fetch(`${apiBaseUrl}/courses/course/${this.id.toString()}`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).then(response => response.json())
                .then(async data => {
                    // ToDo: Type Check
                    if (Array.isArray(data) && data.length > 0) {
                        this.role = data[0].role;
                        await this.updateLastVisited();
                        this.setState({
                            authorized: true
                        });
                    }
                    this.setState({
                        loading: false
                    });
                });
        }
    }

    updateLastVisited = () => {
        return fetch(`${apiBaseUrl}/courses/visited/${this.id.toString()}`, {
            method: 'PUT',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Length': "0"
            }
        });
    };

    isTeacherOrAdmin = () => {
        return this.role === "CourseAdmin" || this.role === "Teacher";
    };

    renderCoursePage = () => {
        if (this.isTeacherOrAdmin()) {
            if (this.state.showUserData && this.state.userData.length > 0) {
                return (
                    <>
                        <button className="participants-button" onClick={this.onClickUserDataButton}>Hide participants</button>
                        <UserTable userArray={this.state.userData} courseId={this.id} accessToken={this.accessToken}></UserTable>
                    </>
                );
            } else {
                return <button className="participants-button" onClick={this.onClickUserDataButton}>Show participants</button>;
            }
        } else {
            return <></>;
        }

    };

    render() {
        return (
            <div className="course-detail-container">
                <h2 className="course-detail-header">{this.name}</h2>
                <div className="course-description-container">
                    <h3 className="course-description-header">Course description</h3>
                    {this.description ? (
                        <pre>{this.description}</pre>
                    ) : (
                        <em>No course description available!</em>
                    )}
                </div>
                {this.state.loading ? (
                    <CodiconsSync className="loading-loop"></CodiconsSync>
                ) : (this.state.authorized ? (
                    this.renderCoursePage()
                ) : (
                    <form>
                        <div className="course-password">
                            <label className="label">Course Password</label>
                            <input className="input" type="course-pwd" name="course-pwd" id="course-pwd" onChange={this.onChangePassword} required />
                        </div>
                        <button className="course-signup-button" onClick={this.onClickSubmit}>Sign up for course</button>
                    </form>
                ))}
            </div>
        );
    }
    onClickSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.password) {
            event?.preventDefault();
            await fetch(`${apiBaseUrl}/courses/signUp`, {
                method: 'POST',
                // Auth header not required yet to fetch courses from api. 
                // Still included to prevent errors in case of future api updates.    
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.accessToken}`,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Accept': 'application/json',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: this.id, password: this.password })
            }).then(async response => {
                if (response.status === 201) {
                    vscode.postMessage({ type: 'onInfo', value: `Signed up for course "${this.name}" successfully!` });
                    const res = await response.json();
                    // (ToDo: Type Check)
                    this.role = res.role;
                    this.setState({
                        authorized: true
                    });
                } else {
                    vscode.postMessage({ type: 'onInfo', value: `Failed to sign up for course!` });
                }
            });
        }
    };

    onClickUserDataButton = async () => {
        if (!this.state.showUserData) {
            await fetch(`${apiBaseUrl}/courses/course/${this.id.toString()}/users`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).then(response => response.json())
                .then(data => {
                    if (isUserArray(data)) {
                        this.setState({
                            userData: data,
                            showUserData: true
                        });
                    } else {
                        vscode.postMessage({ type: "onInfo", value: "Unable to show participants!" });
                    }
                });
        } else {
            this.setState({
                showUserData: false
            });
        }

    };

    onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.password = event.currentTarget.value;
    }; 
};