import * as React from "react";
import { Redirect } from "react-router-dom";
import OpenInNew from "../svg/OpenInNew";
import './CourseCard.css';

export interface CourseCardProps {
    id: number,
    name: string,
    accessToken: string
}

export interface CourseCardState {
    redirectToCourse: boolean
}

export default class CourseCard extends React.Component<CourseCardProps, CourseCardState> {
    constructor(props: CourseCardProps) {
        super(props);
        this.state = {
            redirectToCourse: false
        };
    }

    render() {
        return this.state.redirectToCourse ? (
            <Redirect to={`/course/${this.props.accessToken}/${this.props.id.toString()}/${this.props.name}`} push={true} />
        ) : (
            <div className="card" onClick={this.handleCourseCardClick}>
                {this.props.name} <OpenInNew className="open-in-new" />
            </div>
        );
    }

    handleCourseCardClick = () => {
        // FixMe
        if(!isSideBar) {
            this.setState({
                redirectToCourse: true
            });
        }
    };
};


