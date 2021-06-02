import React from 'react';
import { apiBaseUrl } from '../../../constants';
import { MyCourse } from '../../models/MyCourse';
import { isMyCourseArray } from '../../predicates/isMyCourseArray';
import MyCourseCard from '../cards/MyCourseCard';
import GoogleLoop from '../svg/GoogleLoop';
import './AllCourses.css';

export interface MyCoursesProps {
    accessToken: string
}

export interface MyCoursesState {
    loading: boolean,
    courseData: MyCourse[]
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
            courseData: []
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
            let initHidden: boolean[] = [];
            let initStarred: boolean[] = [];
            return (
                <div className="card-container">
                    <ul className="course-list">
                        {this.courses.map((course: MyCourse, i: number) => {
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

    private checkProperties(data: any[]): boolean {
        return data[0].hasOwnProperty('course_id') &&
            data[0].hasOwnProperty('name') &&
            data[0].hasOwnProperty('hidden') &&
            data[0].hasOwnProperty('starred') &&
            data[0].hasOwnProperty('role');
    }
}