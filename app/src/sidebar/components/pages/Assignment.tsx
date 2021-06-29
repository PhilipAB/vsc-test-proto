import React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { SimpleCourse } from "../../../models/Course";
import { isSimpleCourseArray } from "../../../predicates/isCourseArray";
import { apiBaseUrl } from "../../../constants";
import { CourseTable } from "../course-table/CourseTable";
import { ControlProps, GroupTypeBase, OptionProps } from 'react-select';
import AsyncSelect from 'react-select/async';
import './Assignment.css';
import { CSSObject } from "@emotion/serialize";
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import '../../../react-datetime-styles/DateTimePicker.css';

export interface PathParams {
    accessToken: string
    id: string
    name: string
    repository: string
    description: string
}

export interface AssignmentProps extends RouteComponentProps<PathParams> {
}

export interface AssignmentState {
    showRelatedCourseData: boolean
    showAddToCourses: boolean
    showUpdateCourses: boolean
    relatedCoursesData: SimpleCourse[]
    selectedUpdateOption: SelectOptionType | null
    selectedAddOption: SelectOptionType | null,
    addVisibleFrom: Date | null,
    addVisibleTill: Date | null,
    updateVisibleFrom: Date | null,
    updateVisibleTill: Date | null
}

export type SelectOptionType = {
    [key: string]: any
    value: string
    label: string
};

class Assignment extends React.Component<AssignmentProps, AssignmentState> {
    id: number;
    name: string;
    repository: string;
    description: string;
    constructor(props: AssignmentProps) {
        super(props);
        this.state = {
            showRelatedCourseData: false,
            showAddToCourses: false,
            showUpdateCourses: false,
            relatedCoursesData: [],
            selectedUpdateOption: null,
            selectedAddOption: null,
            addVisibleFrom: null,
            addVisibleTill: null,
            updateVisibleFrom: null,
            updateVisibleTill: null
        };
        this.id = Number(this.props.match.params.id);
        this.name = this.props.match.params.name;
        this.repository = decodeURIComponent(this.props.match.params.repository);
        this.description = this.props.match.params.description;
    }

    render() {
        return (
            <div className="assignment-detail-container">
                <h2 className="assignment-detail-header">{this.name}</h2>
                <div className="assignment-description-container">
                    <h3 className="assignment-description-header">Assignment description</h3>
                    {this.description ? (
                        <pre>{this.description}</pre>
                    ) : (
                        <em>No assignment description available!</em>
                    )}
                </div>
                {this.renderCoursesOfThisAssignment()}
                {this.renderAddCoursesToAssignment()}
                {this.renderUpdateCoursesOfAssignment()}
                <button className="clone-assignment-button" onClick={this.onClickClone}>Clone assignment</button>
            </div>
        );
    }

    renderCoursesOfThisAssignment() {
        if (this.state.showRelatedCourseData) {
            return (
                <>
                    <button className="related-courses-button" onClick={this.onClickRelatedCoursesButton}>Hide assignment's courses</button>
                    <CourseTable courseArray={this.state.relatedCoursesData} assignmentId={this.id} accessToken={this.props.match.params.accessToken}></CourseTable>
                </>
            );
        } else {
            return <button className="related-courses-button" onClick={this.onClickRelatedCoursesButton}>Show assignment's courses</button>;
        }
    }

    renderAddCoursesToAssignment() {
        if (this.state.showAddToCourses) {
            type ControlPropsType = ControlProps<{ value: string; label: string; }, false, GroupTypeBase<{ value: string; label: string; }>>;
            type OptionPropsType = OptionProps<{ value: string; label: string; }, false, GroupTypeBase<{ value: string; label: string; }>>;
            const customStyles = {
                control: (provided: CSSObject, state: ControlPropsType) => ({
                    ...provided,
                    width: "100%",
                    border: state.isFocused
                        ? "1px solid var(--vscode-focusBorder)"
                        : "none"
                }),
                placeholder: (provided: CSSObject) => ({
                    ...provided,
                    color: "var(--vscode-input-placeholderForeground)"
                }),
                singleValue: (provided: CSSObject) => ({
                    ...provided,
                    color: "color: var(--vscode-input-foreground)"
                }),
                dropdownIndicator: (provided: CSSObject) => ({
                    ...provided,
                    color: "var(--vscode-list-inactiveSelectionForeground)",
                    backgroundColor: "var(--vscode-input-background)",
                    borderRight: "1px solid white",
                    ":hover": {
                        color: "var(--vscode-list-activeSelectionForeground)",
                    },
                    ":focus": {
                        color: "var(--vscode-list-activeSelectionForeground)",
                    }
                }),
                valueContainer: (provided: CSSObject) => ({
                    ...provided,
                    color: "color: var(--vscode-input-foreground)",
                    backgroundColor: "var(--vscode-input-background)"
                }),
                menu: (provided: CSSObject) => ({
                    ...provided,
                    backgroundColor: "var(--vscode-list-inactiveSelectionBackground)",
                    color: "var(--vscode-list-inactiveSelectionForeground)",
                }),
                option: (provided: CSSObject, state: OptionPropsType) => ({
                    ...provided,
                    backgroundColor: state.isFocused
                        ? "var(--vscode-list-hoverBackground)"
                        : state.isSelected
                            ? "var(--vscode-list-activeSelectionBackground)"
                            : "var(--vscode-list-inactiveSelectionBackground)",
                    color: state.isFocused || state.isSelected
                        ? "var(--vscode-list-activeSelectionForeground)"
                        : "var(--vscode-list-inactiveSelectionForeground)"
                }),
                input: (provided: CSSObject) => ({
                    ...provided,
                    color: "color: var(--vscode-input-foreground)"
                })
            };
            return (
                <div className="add-container">
                    <form className="add-form">
                        <label className="assignment-add-label" htmlFor="course-options">
                            Select a course
                        </label>
                        <AsyncSelect
                            id="course-options"
                            className="select-add"
                            cacheOptions
                            defaultOptions
                            value={this.state.selectedAddOption}
                            getOptionValue={this.getOptionValue}
                            getOptionLabel={this.getOptionLabel}
                            loadOptions={this.getAddOptions}
                            onChange={this.handleSelectAddChange}
                            styles={customStyles}
                            required>
                        </AsyncSelect>
                        <label className="assignment-add-label" htmlFor="visible-from">
                            Visible from
                        </label>
                        <span className="datetime-wrapper" id="visible-from">
                            <DateTimePicker
                                disableCalendar={true}
                                disableClock={true}
                                showLeadingZeros={true}
                                format={"dd.MM.y hh:mm"}
                                minDate={new Date()}
                                maxDate={new Date(9999, 11, 31, 23, 59, 59, 0)}
                                className="react-datetime-picker"
                                value={this.state.addVisibleFrom ?? ""}
                                onChange={this.onChangeAddDateFrom}>
                            </DateTimePicker>
                        </span>
                        <label className="assignment-add-label" htmlFor="visible-till">
                            Visible till
                        </label>
                        <span className="datetime-wrapper" id="visible-till">
                            <DateTimePicker
                                disableCalendar={true}
                                disableClock={true}
                                showLeadingZeros={true}
                                format={"dd.MM.y hh:mm"}
                                minDate={new Date()}
                                maxDate={new Date(9999, 11, 31, 23, 59, 59, 0)}
                                className="react-datetime-picker"
                                value={this.state.addVisibleTill ?? ""}
                                onChange={this.onChangeAddDateTill}>
                            </DateTimePicker>
                        </span>
                        <button className="add-button" onClick={this.onClickHandleAddToCourses}>Add</button>
                    </form>
                    <button className="cancel-button" onClick={this.onClickAddToCoursesButton}>Cancel</button>
                </div>
            );
        } else {
            return <button className="related-courses-button" onClick={this.onClickAddToCoursesButton}>Add to courses</button>;
        }
    }

    renderUpdateCoursesOfAssignment() {
        if (this.state.showUpdateCourses) {
            type ControlPropsType = ControlProps<{ value: string; label: string; }, false, GroupTypeBase<{ value: string; label: string; }>>;
            type OptionPropsType = OptionProps<{ value: string; label: string; }, false, GroupTypeBase<{ value: string; label: string; }>>;
            const customStyles = {
                control: (provided: CSSObject, state: ControlPropsType) => ({
                    ...provided,
                    width: "100%",
                    border: state.isFocused
                        ? "1px solid var(--vscode-focusBorder)"
                        : "none"
                }),
                placeholder: (provided: CSSObject) => ({
                    ...provided,
                    color: "var(--vscode-input-placeholderForeground)"
                }),
                singleValue: (provided: CSSObject) => ({
                    ...provided,
                    color: "color: var(--vscode-input-foreground)"
                }),
                dropdownIndicator: (provided: CSSObject) => ({
                    ...provided,
                    color: "var(--vscode-list-inactiveSelectionForeground)",
                    backgroundColor: "var(--vscode-input-background)",
                    borderRight: "1px solid white",
                    ":hover": {
                        color: "var(--vscode-list-activeSelectionForeground)",
                    },
                    ":focus": {
                        color: "var(--vscode-list-activeSelectionForeground)",
                    }
                }),
                valueContainer: (provided: CSSObject) => ({
                    ...provided,
                    color: "color: var(--vscode-input-foreground)",
                    backgroundColor: "var(--vscode-input-background)"
                }),
                menu: (provided: CSSObject) => ({
                    ...provided,
                    backgroundColor: "var(--vscode-list-inactiveSelectionBackground)",
                    color: "var(--vscode-list-inactiveSelectionForeground)",
                }),
                option: (provided: CSSObject, state: OptionPropsType) => ({
                    ...provided,
                    backgroundColor: state.isFocused
                        ? "var(--vscode-list-hoverBackground)"
                        : state.isSelected
                            ? "var(--vscode-list-activeSelectionBackground)"
                            : "var(--vscode-list-inactiveSelectionBackground)",
                    color: state.isFocused || state.isSelected
                        ? "var(--vscode-list-activeSelectionForeground)"
                        : "var(--vscode-list-inactiveSelectionForeground)"
                }),
                input: (provided: CSSObject) => ({
                    ...provided,
                    color: "color: var(--vscode-input-foreground)"
                })
            };
            return (
                <div className="update-container">
                    <form className="update-form">
                        <label className="assignment-update-label" htmlFor="course-options-update">
                            Select a course
                        </label>
                        <AsyncSelect
                            id="course-options-update"
                            className="select-update"
                            cacheOptions
                            defaultOptions
                            value={this.state.selectedUpdateOption}
                            getOptionValue={this.getOptionValue}
                            getOptionLabel={this.getOptionLabel}
                            loadOptions={this.getUpdateOptions}
                            onChange={this.handleSelectUpdateChange}
                            styles={customStyles}
                            required>
                        </AsyncSelect>
                        <label className="assignment-update-label" htmlFor="-update-visible-from">
                            Visible from
                        </label>
                        <span className="datetime-wrapper" id="update-visible-from">
                            <DateTimePicker
                                disableCalendar={true}
                                disableClock={true}
                                showLeadingZeros={true}
                                format={"dd.MM.y hh:mm"}
                                minDate={new Date()}
                                maxDate={new Date(9999, 11, 31, 23, 59, 59, 0)}
                                className="react-datetime-picker"
                                value={this.state.updateVisibleFrom ?? ""}
                                onChange={this.onChangeUpdateDateFrom}>
                            </DateTimePicker>
                        </span>
                        <label className="assignment-update-label" htmlFor="update-visible-till">
                            Visible till
                        </label>
                        <span className="datetime-wrapper" id="update-visible-till">
                            <DateTimePicker
                                disableCalendar={true}
                                disableClock={true}
                                showLeadingZeros={true}
                                format={"dd.MM.y hh:mm"}
                                minDate={new Date()}
                                maxDate={new Date(9999, 11, 31, 23, 59, 59, 0)}
                                className="react-datetime-picker"
                                value={this.state.updateVisibleTill ?? ""}
                                onChange={this.onChangeUpdateDateTill}>
                            </DateTimePicker>
                        </span>
                        <button className="add-button" onClick={this.onClickHandleUpdateCourses}>Update</button>
                    </form>
                    <button className="cancel-button" onClick={this.onClickUpdateCoursesButton}>Cancel</button>
                </div>
            );
        } else {
            return <button className="related-courses-button" onClick={this.onClickUpdateCoursesButton}>Update</button>;
        }
    }

    onChangeAddDateFrom = (event: Date | null) => {
        this.setState({
            addVisibleFrom: event
        });
    };

    onChangeAddDateTill = (event: Date | null) => {
        this.setState({
            addVisibleTill: event
        });
    };

    onChangeUpdateDateFrom = (event: Date | null) => {
        this.setState({
            updateVisibleFrom: event
        });
    };

    onChangeUpdateDateTill = (event: Date | null) => {
        this.setState({
            updateVisibleTill: event
        });
    };

    onClickClone = async (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        vscode.postMessage({
            type: "cloneRepository",
            value: this.repository
        });
    };

    onClickRelatedCoursesButton = async () => {
        if (!this.state.showRelatedCourseData) {
            await fetch(`${apiBaseUrl}/assignments/assignment/${this.id.toString()}/courses`, {
                method: 'GET',
                // Auth header not required yet to fetch courses from api. 
                // Still included to prevent errors in case of future api updates.    
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.props.match.params.accessToken}`,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Accept': 'application/json',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
                .then(data => {
                    if (isSimpleCourseArray(data)) {
                        this.setState({
                            showRelatedCourseData: true,
                            showAddToCourses: false,
                            showUpdateCourses: false,
                            relatedCoursesData: data
                        });
                    } else {
                        vscode.postMessage({ type: "onInfo", value: "Unable to show related courses!" });
                    }
                });
        } else {
            this.setState({
                showRelatedCourseData: false
            });
        }
    };

    onClickAddToCoursesButton = () => {
        if (!this.state.showAddToCourses) {
            this.setState({
                showRelatedCourseData: false,
                showAddToCourses: true,
                showUpdateCourses: false
            });
        } else {
            this.setState({
                showAddToCourses: false
            });
        }
    };

    onClickHandleAddToCourses = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.state.selectedAddOption) {
            event.preventDefault();
            try {
                await fetch(`${apiBaseUrl}/assignments/assignment/${this.props.match.params.id}/course/${this.state.selectedAddOption.id}`, {
                    method: 'POST',
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Authorization': `Bearer ${this.props.match.params.accessToken}`,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Accept': 'application/json',
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ visibleFrom: this.state.addVisibleFrom, visibleTill: this.state.addVisibleTill })
                }).then(response => {
                    if (response.status === 201) {
                        vscode.postMessage({ type: 'onInfo', value: `Assignment "${this.props.match.params.name}" added to ${this.state.selectedAddOption?.name} successfully!` });
                        this.setState({
                            selectedAddOption: null,
                            addVisibleFrom: null,
                            addVisibleTill: null
                        });
                    } else {
                        vscode.postMessage({ type: 'onInfo', value: `Failed to add assignment to course!` });
                    }
                });
            } catch (error) {
                vscode.postMessage({ type: 'onInfo', value: `Failed to add assignment to course!` });
            }
        }
    };

    onClickHandleUpdateCourses = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.state.selectedUpdateOption) {
            event.preventDefault();
            try {
                await fetch(`${apiBaseUrl}/assignments/assignment/${this.props.match.params.id}/course/${this.state.selectedUpdateOption.id}`, {
                    method: 'PUT',
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Authorization': `Bearer ${this.props.match.params.accessToken}`,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Accept': 'application/json',
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ visibleFrom: this.state.updateVisibleTill, visibleTill: this.state.updateVisibleTill })
                }).then(response => {
                    if (response.status === 200) {
                        vscode.postMessage({ type: 'onInfo', value: `Updated successfully!` });
                        this.setState({
                            selectedUpdateOption: null,
                            updateVisibleFrom: null,
                            updateVisibleTill: null
                        });
                    } else {
                        vscode.postMessage({ type: 'onInfo', value: `Failed to update!` });
                    }
                });
            } catch (error) {
                vscode.postMessage({ type: 'onInfo', value: `Failed to update!` });
            }
        }
    };

    onClickUpdateCoursesButton = () => {
        if (!this.state.showUpdateCourses) {
            this.setState({
                showRelatedCourseData: false,
                showAddToCourses: false,
                showUpdateCourses: true
            });
        } else {
            this.setState({
                showUpdateCourses: false
            });
        }
    };

    handleSelectAddChange = (event: SelectOptionType | null) => {
        this.setState({
            selectedAddOption: event
        });
    };

    handleSelectUpdateChange = (event: SelectOptionType | null) => {
        this.setState({
            selectedUpdateOption: event
        });
    };

    getOptionValue = (option: any) => option.id;
    getOptionLabel = (option: any) => option.name;

    getAddOptions = async (inputValue: string, _callback: any) => {
        if (inputValue) {
            return await fetch(`${apiBaseUrl}/assignments/assignment/${this.id.toString()}/courses/no-relation?name=${inputValue}`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.props.match.params.accessToken}`
                }
            }).then(response => response.json())
                .then(data => {
                    return data;
                })
                .catch(() => {
                    return Promise.resolve([]);
                });
        } else {
            return Promise.resolve([]);
        }
    };

    getUpdateOptions = async (inputValue: string, _callback: any) => {
        if (inputValue) {
            return await fetch(`${apiBaseUrl}/assignments/assignment/${this.id.toString()}/courses?name=${inputValue}`, {
                method: 'GET',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${this.props.match.params.accessToken}`
                }
            }).then(response => response.json())
                .then(data => {
                    return data;
                })
                .catch(() => {
                    return Promise.resolve([]);
                });
        } else {
            return Promise.resolve([]);
        }
    };
};
export default withRouter(Assignment);