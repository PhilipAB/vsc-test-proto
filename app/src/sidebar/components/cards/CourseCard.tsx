import * as React from "react";
import CodiconsLinkExternal from "../../../svg/CodiconsLinkExternal";
import './CourseCard.css';

export interface CourseCardProps {
    id: number
    name: string
    description: string
}

export interface CourseCardState {
}

export default class CourseCard extends React.Component<CourseCardProps, CourseCardState> {
    constructor(props: CourseCardProps) {
        super(props);
    }

    render() {
        return (
            <div className="card" onClick={this.handleCourseCardClick}>
                {this.props.name} <CodiconsLinkExternal className="open-in-new" />
            </div>
        );
    }

    handleCourseCardClick = () => {
        vscode.postMessage(
            {
                type: "openCourseInNewTab",
                value: {
                    id: this.props.id,
                    name: this.props.name,
                    role: "",
                    description: this.props.description
                }
            });
    };
};


