import * as React from "react";
import { Redirect } from "react-router-dom";
import GoogleHide from "../svg/GoogleHide";
import GoogleStar from "../svg/GoogleStar";
import OpenInNew from "../svg/OpenInNew";
import './MyCourseCard.css';

export interface MyCourseCardProps {
    id: number,
    name: string,
    role: "CourseAdmin" | "Teacher" | "Student",
    accessToken: string,
    hidden: boolean,
    starred: boolean,
    handleHidden: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleStarred: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface MyCourseCardState {
    redirectToCourse: boolean
}

export default class MyCourseCard extends React.Component<MyCourseCardProps, MyCourseCardState> {
    constructor(props: MyCourseCardProps) {
        super(props);
        this.state = {
            redirectToCourse: false
        };
    }

    render() {
        return this.state.redirectToCourse ? (
            <Redirect to={`/course/${this.props.accessToken}/${this.props.id.toString()}/${this.props.name}/${this.props.role}`} push={true} />
        ) : (
            <div className="my-course-card" onClick={this.handleCourseCardClick}>
                <span className="course-name-wrapper">
                    {this.props.name} <OpenInNew className="open-my-course-in-new" />
                </span>
                <span className="course-props-wrapper" onClick={this.handleCourseCardClick}>
                    <input
                        type="checkbox"
                        name="hide"
                        id={"hidden" + this.props.id.toString()}
                        onChange={this.props.handleHidden}
                        checked={this.props.hidden} />
                    <label htmlFor={"hidden" + this.props.id.toString()} className="option hidden" tabIndex={0}>
                        <GoogleHide className="hide"></GoogleHide>
                    </label>
                    <input
                        type="checkbox"
                        name="star"
                        id={"starred" + this.props.id.toString()}
                        onChange={this.props.handleStarred}
                        checked={this.props.starred} />
                    <label htmlFor={"starred" + this.props.id.toString()} className="option starred" tabIndex={0}>
                        <GoogleStar className="star"></GoogleStar>
                    </label>
                </span>
            </div>
        );
    }

    handleCourseCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.currentTarget.className === "course-props-wrapper") {
            event.stopPropagation();
        } else if (isSideBar) {
            // ToDo: The redundant implementation of the lecturer functions (both in the sidebar webview panel) is not recommended.
            // A decision should be made in favour of one view.
            // https://code.visualstudio.com/api/references/extension-guidelines
            // While it is possible to link from the course list within the sidebar to courses in our webview panel, 
            // it makes our code unnecessarily complicated and adds no significant value.

            // Not working anymore since accessToken, role and name are missing!
            // vscode.postMessage({ type: "openCourseInNewTab", value: this.props.id.toString() });
        } else {
            this.setState({ redirectToCourse: true });
        }
    };
};