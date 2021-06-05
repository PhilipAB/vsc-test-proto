import React from 'react';
import { apiBaseUrl } from '../../../constants';
import { snakeToCamelCase } from '../../helpers/snakeToCamelCase';
import { Course } from '../../models/Course';
import { isNonEmptyCourseArray } from '../../predicates/isCourseArray';
import CourseCard from '../cards/CourseCard';
import SearchBar from '../filter/SearchBar';
import GoogleLoop from '../svg/GoogleLoop';
import './AllCourses.css';

export interface AllCoursesProps {
    accessToken: string
}

export interface AllCoursesState {
    loading: boolean,
    courseData: Course[],
    currentPage: number,
    searchTerm: string
}

export default class AllCourses extends React.Component<AllCoursesProps, AllCoursesState> {
    coursesPerPage: number;
    // ToDos: Display own courses, filter courses, link to course page, delete courses
    // How could we link to course page?
    // Answer: Store course page id like access token with Tokenmanager but pass it as a prop instead of state
    // Switch between all courses/my courses -> state property that we use in fetch  
    constructor(props: AllCoursesProps) {
        super(props);
        this.coursesPerPage = 2;
        this.state = {
            loading: true,
            courseData: [],
            currentPage: 1,
            searchTerm: ""
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
            const filteredCourses: Course[] = this.state.courseData.filter(course => this.filterAllCourses(course));
            const indexLastCourse = this.state.currentPage * this.coursesPerPage;
            const indexFirstCourse = indexLastCourse - this.coursesPerPage;
            const currentCourses = filteredCourses.slice(indexFirstCourse, indexLastCourse);
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(filteredCourses.length / this.coursesPerPage); i++) {
                pageNumbers.push(i);
            }
            return (
                <div className="card-container">
                    <SearchBar searchTerm={this.state.searchTerm} changeFunction={this.handleSearchEdit}></SearchBar>
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

    handleSearchEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    private filterAllCourses(course: Course) {
        return course.name.toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase());
    }
}