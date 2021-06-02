import React from 'react';
import { apiBaseUrl } from '../../../constants';
import { snakeToCamelCase } from '../../helpers/snakeToCamelCase';
import { Course } from '../../models/Course';
import { isNonEmptyCourseArray } from '../../predicates/isCourseArray';
import CourseCard from '../cards/CourseCard';
import GoogleLoop from '../svg/GoogleLoop';
import './AllCourses.css';

export interface AllCoursesProps {
    accessToken: string
}

export interface AllCoursesState {
    loading: boolean,
    courseData: Course[],
    currentPage: number
}

export default class AllCourses extends React.Component<AllCoursesProps, AllCoursesState> {
    courses: Course[];
    coursesPerPage: number;
    // ToDos: Display own courses, filter courses, link to course page, delete courses
    // How could we link to course page?
    // Answer: Store course page id like access token with Tokenmanager but pass it as a prop instead of state
    // Switch between all courses/my courses -> state property that we use in fetch  
    constructor(props: AllCoursesProps) {
        super(props);
        this.courses = [];
        this.coursesPerPage = 2;
        this.state = {
            loading: true,
            courseData: [],
            currentPage: 1
        };
    }

    async componentDidMount() {
        await fetch(`${apiBaseUrl}/courses`, {
            method: 'GET',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.accessToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    snakeToCamelCase(data);
                    if (isNonEmptyCourseArray(data)) {
                        this.courses = data;
                        this.setState({
                            courseData: data
                        });
                    }
                }
            });
        this.setState({
            loading: false
        });
    }

    render() {
        if(this.state.loading) {
            return (<GoogleLoop className="loading"></GoogleLoop>);
        } else if (isNonEmptyCourseArray(this.state.courseData)) {
            // Logic for displaying courses
            const indexLastCourse = this.state.currentPage * this.coursesPerPage;
            const indexFirstCourse = indexLastCourse - this.coursesPerPage;
            const currentCourses = this.state.courseData.slice(indexFirstCourse, indexLastCourse);
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(this.state.courseData.length / this.coursesPerPage); i++) {
                pageNumbers.push(i);
            }
            return (
                <div className="card-container">
                    <ul className="course-list">
                        {currentCourses.map((course: Course) => {
                            return (
                                <li className="list-card" key={course.id}>
                                    <CourseCard name={course.name} ></CourseCard>
                                </li>
                            );
                        })}
                    </ul>
                    <ul className="page-numbers">
                        {pageNumbers.map(number => {
                            return (
                                <li className="page-number" key={number} onClick={this.handlePageNumberClick}>
                                    {number}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        } else {
            return "No courses to display!";
        }
    }

    handlePageNumberClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        this.setState({ currentPage: Number(event.currentTarget.innerText) });
    };
}