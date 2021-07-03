import React from 'react';
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import AllCourses from '../courses/AllCourses';
import MyCourses from '../courses/MyCourses';
import './CourseList.css';

export interface PathParams {
    accessToken: string
}

export interface CourseListProps extends RouteComponentProps<PathParams> {
}

export interface CourseListState {
    allCourses: boolean
}

class CourseList extends React.Component<CourseListProps, CourseListState> {
    // How could we link to course page?
    // Answer: Store course page id like access token with Tokenmanager but pass it as a prop instead of state
    // Switch between all courses/my courses -> state property that we use in fetch  
    constructor(props: CourseListProps) {
        super(props);
        this.state = {
            allCourses: false
        };
    }

    render() {
        return (
            <div className="course-container">
                <h2 className="list-header">Course list</h2>
                <div className="radio-wrapper">
                    <input type="radio" name="select" id="option-1" onChange={this.handleChange} checked={!this.state.allCourses} />
                    <label htmlFor="option-1" className="option option-1" tabIndex={0}>
                        <div className="dot"></div>
                        <span>My Courses</span>
                    </label>
                    <input type="radio" name="select" id="option-2" onChange={this.handleChange} checked={this.state.allCourses} />
                    <label htmlFor="option-2" className="option option-2" tabIndex={0}>
                        <div className="dot"></div>
                        <span>All Courses</span>
                    </label>
                </div>
                {!this.state.allCourses ?
                    (
                        <MyCourses accessToken={this.props.match.params.accessToken}></MyCourses>
                    ): 
                    (
                        <AllCourses accessToken={this.props.match.params.accessToken}></AllCourses>
                    )}
            </div>
        );
    }

    handleChange = () => {
        this.setState({ allCourses: !this.state.allCourses });
    };
}

export default withRouter(CourseList);