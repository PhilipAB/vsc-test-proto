import React from "react";
import autosize from "autosize";
import AutosizeInput from 'react-input-autosize';
import { apiBaseUrl } from "../../../constants";
import { UserCourseRole } from "../../../models/User";
import { isUserArray } from "../../../predicates/isUserArray";
import { UserTable } from "../../user-table/UserTable";
import CodiconsSync from "../../../svg/CodiconsSync";
import CodiconsEdit from "../../../svg/CodiconsEdit";
import CodiconsCheck from "../../../svg/CodiconsCheck";
import CodiconsClose from "../../../svg/CodiconsClose";
import CodiconsRemove from "../../../svg/CodiconsRemove";
import './Course.css';
import { snakeToCamelCase } from "../../../sidebar/helpers/snakeToCamelCase";
import { isAssignmentExtendedArray } from "../../../predicates/isAssignmentExtendedArray";
import { AssignmentExtended } from "../../../models/AssignmentExtended";

export interface CourseProps {
}

export interface CourseState {
    loading: boolean
    authorized: boolean
    userData: UserCourseRole[]
    assignmentData: AssignmentExtended[]
    showUserData: boolean
    showStatistics: boolean
    numberVisitors: number
    totalVisits: number
    name: string
    description: string | null
    disableTitleEdit: boolean
    disableDescriptionEdit: boolean
    disableDeleteButton: boolean
}

export default class Course extends React.Component<CourseProps, CourseState> {
    id: number;
    role: "CourseAdmin" | "Teacher" | "Student" | "";
    password: string;
    accessToken: string;
    title: string;
    currentDescription: string | null;
    descriptionTextArea: HTMLTextAreaElement | null;
    constructor(props: CourseProps) {
        super(props);
        this.state = {
            loading: false,
            authorized: false,
            userData: [],
            assignmentData: [],
            showUserData: false,
            showStatistics: false,
            numberVisitors: 0,
            totalVisits: 0,
            name: courseName,
            description: courseDescription || null,
            disableTitleEdit: true,
            disableDescriptionEdit: true,
            disableDeleteButton: false
        };
        this.descriptionTextArea = null;

        this.id = Number(initCourseId);
        this.title = courseName;
        this.currentDescription = courseDescription || null;
        this.role = courseUserRole;
        this.accessToken = initialAccessToken;
        this.password = "";
    }

    async componentDidMount() {
        if (this.descriptionTextArea) {
            this.descriptionTextArea.focus();
            autosize(this.descriptionTextArea);
        }
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
                if (Array.isArray(data) && data.length > 0) {
                    this.role = data[0].role;
                    await this.updateLastVisited();
                    await this.setAssignmentData(this.role);
                    await this.increaseTotalCourseAccess();
                    this.setState({
                        name: data[0].name,
                        description: data[0].description,
                        authorized: true
                    });
                }
                this.setState({
                    loading: false
                });
            });
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

    increaseTotalCourseAccess = () => {
        return fetch(`${apiBaseUrl}/courses/accessed`, {
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
            body: JSON.stringify({ id: this.id })
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

    renderStatistics = () => {
        if (this.isTeacherOrAdmin()) {
            if (this.state.showStatistics) {
                return (
                    <>
                        <button className="statistics-button" onClick={this.onClickStatisticsButton}>Hide statistics</button>
                        <div>Your course was visited {this.state.totalVisits} times by {this.state.numberVisitors} different participants during the last 7 days!</div>
                    </>
                );
            } else {
                return <button className="statistics-button" onClick={this.onClickStatisticsButton}>Show statistics</button>;
            }
        } else {
            return <></>;
        }
    };

    async setAssignmentData(role: "CourseAdmin" | "Teacher" | "Student" | "") {
        if (role === "CourseAdmin" || role === "Teacher") {
            await fetch(`${apiBaseUrl}/courses/course/${this.id.toString()}/assignments`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        snakeToCamelCase(data);
                        if (isAssignmentExtendedArray(data)) {
                            this.setState({
                                assignmentData: data
                            });
                        }
                    }
                });
        } else {
            await fetch(`${apiBaseUrl}/courses/course/${this.id.toString()}/assignments/visible`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        snakeToCamelCase(data);
                        if (isAssignmentExtendedArray(data)) {
                            this.setState({
                                assignmentData: data
                            });
                        }
                    }
                });
        }
    }

    renderAssignments = () => {
        return (
            <div className="assignments-in-course">
                <h3>Assignments</h3>
                <ul className="course-assignments-list">
                    {this.state.assignmentData.map((assignment: AssignmentExtended) => {
                        return (
                            <li className="assignment" key={assignment.id}>
                                <span className="assignments-details-container">
                                    <details className="assignment-details">
                                        <summary onClick={this.onClickSummary}>{assignment.name}</summary>
                                        <pre>
                                            {assignment.description}
                                        </pre>
                                        <p className="date-from">
                                            {console.log(assignment)}
                                            {assignment.visibleFrom ? 'Assignment available from: ' +
                                                // Prefix 0 if single digit day.
                                                `${this.localDate(assignment.visibleFrom).getDate.toString().length === 1 ? "0" : ""}` +
                                                `${this.localDate(assignment.visibleFrom).getDate().toString()}.` +
                                                // Prefix 0 if single digit month.
                                                `${(this.localDate(assignment.visibleFrom).getMonth() + 1).toString().length === 1 ? "0" : ""}` +
                                                `${(this.localDate(assignment.visibleFrom).getMonth() + 1).toString()}.` +
                                                `${this.localDate(assignment.visibleFrom).getFullYear()} ` +
                                                // Prefix 0 if single digit hour.
                                                `${this.localDate(assignment.visibleFrom).getHours().toString().length === 1 ? "0" : ""}` +
                                                `${this.localDate(assignment.visibleFrom).getHours().toString()}:` +
                                                // Prefix 0 if single digit minute.
                                                `${this.localDate(assignment.visibleFrom).getMinutes().toString().length === 1 ? "0" : ""}` +
                                                `${this.localDate(assignment.visibleFrom).getMinutes().toString()}`
                                                : ""}
                                        </p>
                                        <p className="date-from">
                                            {assignment.visibleTill ? 'Assignment available till: ' +
                                                // Prefix 0 if single digit day.
                                                `${this.localDate(assignment.visibleTill).getDate().toString().length === 1 ? "0" : ""}` +
                                                `${this.localDate(assignment.visibleTill).getDate()}.` +
                                                // Prefix 0 if single digit month.
                                                `${(this.localDate(assignment.visibleTill).getMonth() + 1).toString().length === 1 ? "0" : ""}` +
                                                `${this.localDate(assignment.visibleTill).getMonth() + 1}.` +
                                                `${this.localDate(assignment.visibleTill).getFullYear()} ` +
                                                // Prefix 0 if single digit hour.
                                                `${this.localDate(assignment.visibleTill).getHours().toString().length === 1 ? "0" : ""}` +
                                                `${this.localDate(assignment.visibleTill).getHours()}:` +
                                                // Prefix 0 if single digit minute.
                                                `${this.localDate(assignment.visibleTill).getMinutes().toString().length === 1 ? "0" : ""}` +
                                                `${this.localDate(assignment.visibleTill).getMinutes()}`
                                                : ""}
                                        </p>
                                        <button className="clone-assignment" value={assignment.repository} onClick={this.onClickCloneButton}>
                                            Clone this assignment
                                        </button>
                                    </details>
                                    <button className={this.state.disableDeleteButton ? "assignment-delete-button" : "assignment-delete-button active"} value={assignment.id} onClick={this.onClickDelete}>
                                        <CodiconsRemove className="delete-button-icon"></CodiconsRemove>
                                    </button>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    render() {
        return (
            <div className="course-detail-container">
                <span className="course-title-wrapper">
                    {this.state.disableTitleEdit ? (
                        <h2 className="course-detail-header">{this.state.name}</h2>
                    ) : (
                        <AutosizeInput className="course-detail-header-editable"
                            value={this.state.name} disabled={this.state.disableTitleEdit} onChange={this.onChangeTitle}
                            inputStyle={{ fontSize: "1.5em", fontWeight: "bolder", backgroundColor: "var(--vscode-menu-background)", minWidth: 0 }} />
                    )}
                    <CodiconsEdit className={this.state.disableTitleEdit && this.role === "CourseAdmin" ? "course-edit show" : "course-edit"} onClick={this.handleTitleEditClick}></CodiconsEdit>
                    <CodiconsCheck className={this.state.disableTitleEdit ? "course-check" : "course-check show"} onClick={this.handleTitleCheckClick}></CodiconsCheck>
                    <CodiconsClose className={this.state.disableTitleEdit ? "course-close" : "course-close show"} onClick={this.handleTitleCloseClick}></CodiconsClose>
                </span>
                <span className="course-description-container">
                    <h3 className="course-description-header">Course description</h3>
                    <CodiconsEdit className={this.state.disableDescriptionEdit && (this.role === "CourseAdmin" || this.role === "Teacher") ? "course-edit show" : "course-edit"} onClick={this.handleDescriptionEditClick}></CodiconsEdit>
                    <CodiconsCheck className={this.state.disableDescriptionEdit ? "course-check" : "course-check show"} onClick={this.handleDescriptionCheckClick}></CodiconsCheck>
                    <CodiconsClose className={this.state.disableDescriptionEdit ? "course-close" : "course-close show"} onClick={this.handleDescriptionCloseClick}></CodiconsClose>
                </span>
                <textarea className={this.state.disableDescriptionEdit ? "course-description" : "course-description active"} ref={this.setTextAreaRef} value={this.state.description ?? "No course description available!"} disabled={this.state.disableDescriptionEdit} onChange={this.onChangeDescription} />
                {this.state.loading ? (
                    <CodiconsSync className="loading-loop"></CodiconsSync>
                ) : (this.state.authorized ? (
                    <>
                        {this.renderAssignments()}
                        {this.renderCoursePage()}
                        {this.renderStatistics()}
                    </>
                ) : (
                    <form>
                        <div className="course-password">
                            <label className="label">Course Password</label>
                            <input className="input" name="course-pwd" id="course-pwd" onChange={this.onChangePassword} required />
                        </div>
                        <button className="course-signup-button" onClick={this.onClickSubmit}>Sign up for course</button>
                    </form>
                ))}
            </div>
        );
    }

    setTextAreaRef = (textAreaElement: HTMLTextAreaElement | null) => {
        this.descriptionTextArea = textAreaElement;
    };

    // Converts a mysql string to local Date object.
    localDate(date: string): Date {
        return new Date(date);
    }

    onClickDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const assignmentId = event.currentTarget.value;
        await fetch(`${apiBaseUrl}/courses/course/${this.id}/assignment/${assignmentId}`, {
            method: 'DELETE',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 200) {
                vscode.postMessage({ type: 'onError', value: `Could not delete assignment(s) from course!` });
            } else {
                // remove assignment from course
                let tempAssignmentData: AssignmentExtended[] = [...this.state.assignmentData];
                tempAssignmentData = tempAssignmentData.filter(assignment => assignment.id !== Number(assignmentId));
                this.setState({
                    assignmentData: tempAssignmentData
                });
            }
        });
    };

    onClickSummary = () => {
        this.setState(prevState => ({
            disableDeleteButton: !prevState.disableDeleteButton
        }));
    };

    onClickCloneButton = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        vscode.postMessage({
            type: "cloneRepository",
            value: event.currentTarget.value
        });
    };

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
                    vscode.postMessage({ type: 'onInfo', value: `Signed up for course "${this.state.name}" successfully!` });
                    const res = await response.json();
                    this.role = res.role;
                    this.setState({
                        authorized: true
                    });
                } else {
                    vscode.postMessage({ type: 'onInfo', value: `Failed to sign up for course!` });
                }
            }).catch(_reason => {
                vscode.postMessage({ type: 'onError', value: `Failed to reach backend!` });
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

    onClickStatisticsButton = async () => {
        if (!this.state.showStatistics) {
            await fetch(`${apiBaseUrl}/courses/accessed/${this.id.toString()}`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).then(response => response.json())
                .then(data  => {
                    console.log("visitors: ", data);
                    this.setState({
                        numberVisitors: data[0]["COUNT(*)"]
                    });
                });
            await fetch(`${apiBaseUrl}/courses/accessed/total/${this.id.toString()}`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).then(response => response.json())
                .then(data => {
                    console.log("total: ", data);
                    this.setState({
                        totalVisits: data[0]["COUNT(*)"]
                    });
                });
            this.setState({
                showStatistics: true
            });
        } else {
            this.setState({
                showStatistics: false
            });
        }

    };

    onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.password = event.currentTarget.value;
    };

    onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: event.currentTarget.value
        });
    };

    onChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            description: event.currentTarget.value
        });
    };

    handleTitleEditClick = () => {
        this.setState({
            disableTitleEdit: false
        });
    };

    handleTitleCheckClick = async () => {
        this.setState({
            disableTitleEdit: true
        });
        await fetch(`${apiBaseUrl}/courses/name/${this.id.toString()}`, {
            method: 'PUT',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: this.state.name })
        }).then(response => {
            if (response.status === 200) {
                vscode.postMessage({ type: 'onInfo', value: `Updated course name from ${this.title} to ${this.state.name}!` });
                this.title = this.state.name;
            } else if (response.status === 409) {
                vscode.postMessage({ type: 'onInfo', value: `Course with name ${this.state.name} already exists!` });
                this.setState({
                    name: this.title
                });
            } else {
                vscode.postMessage({ type: 'onInfo', value: `Failed to update course name to ${this.state.name}!` });
                this.setState({
                    name: this.title
                });
            }
        });
    };

    handleTitleCloseClick = () => {
        this.setState({
            disableTitleEdit: true,
            name: this.title
        });
    };

    handleDescriptionEditClick = () => {
        this.setState({
            disableDescriptionEdit: false
        });
    };

    handleDescriptionCheckClick = async () => {
        this.setState({
            disableDescriptionEdit: true
        });
        await fetch(`${apiBaseUrl}/courses/description/${this.id.toString()}`, {
            method: 'PUT',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: this.state.description })
        }).then(response => {
            if (response.status === 200) {
                this.currentDescription = this.state.description;
                if (!this.currentDescription) {
                    this.setState({
                        description: "No course description available!"
                    });
                }
            } else {
                vscode.postMessage({ type: 'onInfo', value: `Failed to update course description!` });
                this.setState({
                    description: this.currentDescription || "No course description available!"
                });
            }
        });
    };

    handleDescriptionCloseClick = () => {
        this.setState({
            disableDescriptionEdit: true,
            description: this.currentDescription || "No course description available!"
        });
    };
};