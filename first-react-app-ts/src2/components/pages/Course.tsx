import React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { apiBaseUrl } from "../../../constants";
import { UserCourseRole } from "../../models/User";
import { isUserArray } from "../../predicates/isUserArray";
import GoogleLoop from "../svg/GoogleLoop";
import { UserTable } from "../user-table/UserTable";
import './Course.css';

export interface PathParams {
    accessToken: string,
    id: string,
    name: string,
    role?: "CourseAdmin" | "Teacher" | "Student"
}

export interface CourseProps extends RouteComponentProps<PathParams> {
}

export interface CourseState {
    loading: boolean
    authorized: boolean
    userData: UserCourseRole[]
    showUserData: boolean
}

class Course extends React.Component<CourseProps, CourseState> {
    id: number;
    name: string;
    role?: "CourseAdmin" | "Teacher" | "Student";
    password: string;
    constructor(props: CourseProps) {
        super(props);
        this.state = {
            loading: false,
            authorized: false,
            userData: [],
            showUserData: false
        };
        this.id = Number(this.props.match.params.id);
        this.name = this.props.match.params.name;
        this.role = this.props.match.params.role;
        this.password = "";
        // if (this.props.match.params.id) {
        //     this.id = Number(this.props.match.params.id);
        // }

        // FixMe: (remove) this case can not occur with the current implementation
        // else {
        //     this.id = Number(initCourseId);
        //     vscode.postMessage({ type: "setCourseId", value: "-1" });
        // }
    }

    async componentDidMount() {
        if (this.role) {
            this.setState({
                authorized: true
            });
        } else {
            this.setState({
                loading: true
            });
            await fetch(`${apiBaseUrl}/courses/course/${this.id.toString()}`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.props.match.params.accessToken}`,
                }
            }).then(response => response.json())
                .then(data => {
                    // ToDo: Type Check
                    if (Array.isArray(data) && data.length > 0) {
                        this.role = data[0].role;
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

    isTeacherOrAdmin = () => {
        return this.role === "CourseAdmin" || this.role === "Teacher";
    };

    renderCoursePage = () => {
        if (this.isTeacherOrAdmin()) {
            if (this.state.showUserData && this.state.userData.length > 0) {
                return (
                    <>
                        <button className="participants-button" onClick={this.onClickUserDataButton}>Hide participants</button>
                        <UserTable userArray={this.state.userData} courseId={this.id} accessToken={this.props.match.params.accessToken}></UserTable>
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
                {this.state.loading ? (
                    <GoogleLoop className="loading-loop"></GoogleLoop>
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
    onClickSubmit = async () => {
        if (this.password) {
            await fetch(`${apiBaseUrl}/courses/signUp`, {
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
                    'Authorization': `Bearer ${this.props.match.params.accessToken}`,
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
export default withRouter(Course);