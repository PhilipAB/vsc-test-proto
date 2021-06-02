import React from 'react';
import { apiBaseUrl } from '../../../constants';
import { MyCourse } from '../../models/MyCourse';
import { isMyCourseArray } from '../../predicates/isMyCourseArray';
import MyCourseCard from '../cards/MyCourseCard';
import SearchBar from '../searchbar/Searchbar';
import GoogleLoop from '../svg/GoogleLoop';
import './AllCourses.css';

export interface MyCoursesProps {
    accessToken: string
}

export interface MyCoursesState {
    loading: boolean,
    courseData: MyCourse[],
    searchTerm: string
}

export default class MyCourses extends React.Component<MyCoursesProps, MyCoursesState> {
    courses: MyCourse[];
    // ToDos: Display own courses, filter courses, link to course page, delete courses
    // How could we link to course page?
    // Answer: Store course page id like access token with Tokenmanager but pass it as a prop instead of state
    // Switch between all courses/my courses -> state property that we use in fetch  
    constructor(props: MyCoursesProps) {
        super(props);
        this.courses = [];
        this.state = {
            loading: true,
            courseData: [],
            searchTerm: ""
        };
    }

    async componentDidMount() {
        await fetch(`${apiBaseUrl}/courses/myCourses`, {
            method: 'GET',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.accessToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0 && this.checkProperties(data)) {
                    data.forEach(myCourse => {
                        let tempCourse: MyCourse = {
                            courseId: myCourse.course_id,
                            name: myCourse.name,
                            hidden: Boolean(myCourse.hidden).valueOf(),
                            starred: Boolean(myCourse.starred).valueOf(),
                            role: myCourse.role
                        };
                        this.courses.push(tempCourse);
                    });
                    this.setState({
                        courseData: Array.from(this.courses)
                    });
                }
            });
        this.setState({
            loading: false
        });
    }

    render() {
        if (this.state.loading) {
            return (<GoogleLoop className="loading"></GoogleLoop>);
        } else if (isMyCourseArray(this.state.courseData)) {
            return (
                <div className="card-container">
                    {/* <div className="search"> */}
                        <SearchBar searchTerm={this.state.searchTerm} changeFunction={this.handleSearchEdit}></SearchBar>
                    {/* </div> */}
                    <ul className="course-list">
                        {this.courses.filter(course => this.filterCourse(course))
                            .map((course: MyCourse) => {
                                return (
                                    <li className="list-card" key={course.courseId}>
                                        <MyCourseCard
                                            id={course.courseId}
                                            name={course.name}
                                            accessToken={this.props.accessToken}
                                            initialHidden={course.hidden}
                                            initialStarred={course.starred}>
                                        </MyCourseCard>
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

    handleSearchEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    private filterCourse(course: MyCourse) {
        return course.name.toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase());
    }

    private checkProperties(data: any[]): boolean {
        return data[0].hasOwnProperty('course_id') &&
            data[0].hasOwnProperty('name') &&
            data[0].hasOwnProperty('hidden') &&
            data[0].hasOwnProperty('starred') &&
            data[0].hasOwnProperty('role');
    }
}