import React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { apiBaseUrl } from "../../../constants";
import './Assignment.css';

export interface PathParams {
    accessToken: string
    id: string
    name: string
    repository: string
    description: string
}

export interface CourseProps extends RouteComponentProps<PathParams> {
}

export interface CourseState {
}

class Course extends React.Component<CourseProps, CourseState> {
    id: number;
    name: string;
    repository: string;
    description: string;
    constructor(props: CourseProps) {
        super(props);
        this.state = {
        };
        this.id = Number(this.props.match.params.id);
        this.name = this.props.match.params.name;
        this.repository = this.props.match.params.repository;
        this.description = this.props.match.params.description;
    }

    async componentDidMount() {
    }

    renderCoursePage = () => {
    };

    render() {
        return (
            <div className="assignment-detail-container">
                <h2 className="assignment-detail-header">{this.name}</h2>
            </div>
        );
    }
};
export default withRouter(Course);