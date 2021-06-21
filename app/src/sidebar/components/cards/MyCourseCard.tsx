import React from "react";
import CodiconsCircleSlash from "../../../svg/CodiconsCircleSlash";
import CodiconsStarFull from "../../../svg/CodiconsStarFull";
import CodiconsLinkExternal from "../../../svg/CodiconsLinkExternal";
import './MyCourseCard.css';

export interface MyCourseCardProps {
    id: number
    name: string
    role: "CourseAdmin" | "Teacher" | "Student"
    hidden: boolean
    starred: boolean
    description: string
    handleHidden: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleStarred: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface MyCourseCardState {
}

export default class MyCourseCard extends React.Component<MyCourseCardProps, MyCourseCardState> {
    constructor(props: MyCourseCardProps) {
        super(props);
    }

    render() {
        return (
            <div className="my-course-card" onClick={this.handleCourseCardClick}>
                <span className="course-name-wrapper">
                    {this.props.name} <CodiconsLinkExternal className="open-my-course-in-new" />
                </span>
                <span className="course-props-wrapper" onClick={this.handleCourseCardClick}>
                    <input
                        type="checkbox"
                        name="hide"
                        id={"hidden" + this.props.id.toString()}
                        onChange={this.props.handleHidden}
                        checked={this.props.hidden} />
                    <label htmlFor={"hidden" + this.props.id.toString()} className="option hidden" tabIndex={0}>
                        <CodiconsCircleSlash className="hide"></CodiconsCircleSlash>
                    </label>
                    <input
                        type="checkbox"
                        name="star"
                        id={"starred" + this.props.id.toString()}
                        onChange={this.props.handleStarred}
                        checked={this.props.starred} />
                    <label htmlFor={"starred" + this.props.id.toString()} className="option starred" tabIndex={0}>
                        <CodiconsStarFull className="star"></CodiconsStarFull>
                    </label>
                </span>
            </div>
        );
    }

    handleCourseCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.currentTarget.className === "course-props-wrapper") {
            event.stopPropagation();
        } else {
            vscode.postMessage(
                {
                    type: "openCourseInNewTab",
                    value: {
                        id: this.props.id,
                        name: this.props.name,
                        role: this.props.role,
                        description: this.props.description
                    }
                });
        }
    };
};