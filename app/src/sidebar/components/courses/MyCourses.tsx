import React from 'react';
import { apiBaseUrl } from '../../../constants';
import { MyCourse } from '../../../models/MyCourse';
import { isMyCourseArray } from '../../../predicates/isMyCourseArray';
import MyCourseCard from '../cards/MyCourseCard';
import Filter from '../filter/Filter';
import SearchBar from '../filter/SearchBar';
import Sort from '../sort/Sort';
import CodiconsSync from '../../../svg/CodiconsSync';
import './MyCourses.css';

export interface MyCoursesProps {
    accessToken: string
}

export interface MyCoursesState {
    loading: boolean,
    courseData: MyCourse[],
    searchTerm: string,
    filterActive: boolean,
    showHidden: boolean,
    showStarred: boolean,
    showNonHighlighted: boolean,
    sortMenuActive: boolean,
    alphabetical: boolean,
    sortByCreation: boolean,
    lastVisited: boolean
}

export default class MyCourses extends React.Component<MyCoursesProps, MyCoursesState> {
    // ToDos: (Delete courses), create Assignments (from existing Assignments), change course roles, submit assignments 
    // How could we link to course page?
    // Answer: Store course page id like access token with Tokenmanager but pass it as a prop instead of state
    // Switch between all courses/my courses -> state property that we use in fetch  
    constructor(props: MyCoursesProps) {
        super(props);
        this.state = {
            loading: true,
            courseData: [],
            searchTerm: "",
            filterActive: false,
            showHidden: false,
            showStarred: true,
            showNonHighlighted: true,
            sortMenuActive: false,
            alphabetical: false,
            sortByCreation: true,
            lastVisited: false
        };
    }

    async componentDidMount() {
        await fetch(`${apiBaseUrl}/courses/myCourses`, {
            method: 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.accessToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0 && this.checkProperties(data)) {
                    let tempCourses: MyCourse[] = [];
                    data.forEach(myCourse => {
                        let tempCourse: MyCourse = {
                            courseId: myCourse.course_id,
                            name: myCourse.name,
                            hidden: Boolean(myCourse.hidden).valueOf(),
                            starred: Boolean(myCourse.starred).valueOf(),
                            role: myCourse.role,
                            description: myCourse.description,
                            visited: new Date(myCourse.visited)
                        };
                        tempCourses.push(tempCourse);
                    });
                    this.setState({
                        courseData: Array.from(tempCourses)
                    });
                }
            });
        this.setState({
            loading: false
        });
    }

    render() {
        if (this.state.loading) {
            return (<CodiconsSync className="loading"></CodiconsSync>);
        } else if (isMyCourseArray(this.state.courseData)) {
            return (
                <div className="card-container">
                    <div className="filter-wrapper">
                        <Sort
                            showSortMenu={this.state.sortMenuActive}
                            alphabetize={this.state.alphabetical}
                            sortByTimeOfCreation={this.state.sortByCreation}
                            lastVisited={this.state.lastVisited}
                            handleAlphabetize={this.handleAlphabetize}
                            handleSortByTimeOfCreation={this.handleSortByCreation}
                            handleLastVisited={this.handleSortByLastVisited}
                            handleSortButtonClick={this.handleSortButtonClicked}>
                        </Sort>
                        <SearchBar searchTerm={this.state.searchTerm} changeFunction={this.handleSearchEdit}></SearchBar>
                        <Filter
                            showFilterMenu={this.state.filterActive}
                            showHidden={this.state.showHidden}
                            showStarred={this.state.showStarred}
                            showNonHighlighted={this.state.showNonHighlighted}
                            handleShowHidden={this.handleShowHidden}
                            handleShowStarred={this.handleShowStarred}
                            handleShowNonHighlighted={this.handleShowNonHighlighted}
                            handleFilterButtonClick={this.handleFilterButtonClicked}>
                        </Filter>
                    </div>
                    <ul className="course-list">
                        {this.state.courseData.filter(course => this.filterCourse(course))
                            .map((course: MyCourse) => {
                                return (
                                    <li className="list-card" key={course.courseId}>
                                        <MyCourseCard
                                            id={course.courseId}
                                            name={course.name}
                                            role={course.role}
                                            hidden={course.hidden}
                                            starred={course.starred}
                                            description={course.description}
                                            handleHidden={this.handleHidden}
                                            handleStarred={this.handleStarred}>
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

    handleHidden = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const courseId: number = Number(event.currentTarget.id.slice(6));
        const index: number = this.state.courseData.findIndex(course => course.courseId === courseId);
        await fetch(`${apiBaseUrl}/courses/hidden/${courseId}`, {
            method: 'PUT',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hidden: !this.state.courseData[index].hidden })
        }).then(response => {
            if (response.status === 200 && this.state.courseData[index].hidden) {
                vscode.postMessage({ type: 'onInfo', value: `Show ${this.state.courseData[index].name}!` });
            } else if (response.status === 200 && !this.state.courseData[index].hidden) {
                vscode.postMessage({ type: 'onInfo', value: `Hide ${this.state.courseData[index].name}!` });
            } else {
                vscode.postMessage({ type: 'onInfo', value: `Failed to update star property!` });
            }
        });

        let tempCourses: MyCourse[] = [...this.state.courseData];
        let tempCourse: MyCourse = { ...tempCourses[index] };

        tempCourse.hidden = !this.state.courseData[index].hidden;
        tempCourses[index] = tempCourse;
        this.setState({ courseData: tempCourses });
    };

    handleStarred = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const courseId: number = Number(event.currentTarget.id.slice(7));
        const index: number = this.state.courseData.findIndex(course => course.courseId === courseId);
        await fetch(`${apiBaseUrl}/courses/starred/${courseId}`, {
            method: 'PUT',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ starred: !this.state.courseData[index].starred })
        }).then(response => {
            if (response.status === 200 && this.state.courseData[index].starred) {
                vscode.postMessage({ type: 'onInfo', value: `Unstarred ${this.state.courseData[index].name}!` });
            } else if (response.status === 200 && !this.state.courseData[index].starred) {
                vscode.postMessage({ type: 'onInfo', value: `Starred ${this.state.courseData[index].name}!` });
            } else {
                vscode.postMessage({ type: 'onInfo', value: `Failed to update star property!` });
            }
        });

        let tempCourses: MyCourse[] = [...this.state.courseData];
        let tempCourse: MyCourse = { ...tempCourses[index] };

        tempCourse.starred = !this.state.courseData[index].starred;
        tempCourses[index] = tempCourse;
        this.setState({ courseData: tempCourses });
    };

    handleSearchEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    handleShowHidden = () => {
        this.setState((prevState: MyCoursesState) => ({
            showHidden: !prevState.showHidden
        }));
    };

    handleShowStarred = () => {
        this.setState((prevState: MyCoursesState) => ({
            showStarred: !prevState.showStarred
        }));
    };

    handleShowNonHighlighted = () => {
        this.setState((prevState: MyCoursesState) => ({
            showNonHighlighted: !prevState.showNonHighlighted
        }));
    };

    handleFilterButtonClicked = () => {
        // Close sort menu if filter menu is opened to prevent overlapping on small screens
        if (!this.state.filterActive && this.state.sortMenuActive) {
            this.setState((prevState: MyCoursesState) => ({
                sortMenuActive: !prevState.sortMenuActive
            }));
        }
        this.setState((prevState: MyCoursesState) => ({
            filterActive: !prevState.filterActive
        }));
    };

    handleAlphabetize = () => {
        this.setState((prevState: MyCoursesState) => ({
            courseData: prevState.courseData.sort((a: MyCourse, b: MyCourse) => a.name.localeCompare(b.name)),
            alphabetical: true,
            sortByCreation: false,
            lastVisited: false,
        }));
    };

    handleSortByCreation = () => {
        this.setState((prevState: MyCoursesState) => ({
            courseData: prevState.courseData.sort((a: MyCourse, b: MyCourse) => {
                if (a.courseId < b.courseId) {
                    return -1;
                } else {
                    return 1;
                }
            }),
            alphabetical: false,
            sortByCreation: true,
            lastVisited: false
        }));
    };
    
    handleSortByLastVisited = () => {
        this.setState((prevState: MyCoursesState) => ({
            courseData: prevState.courseData.sort((a: MyCourse, b: MyCourse) => {
                if (a.visited && !b.visited || a.visited && b.visited && a.visited.getTime() > b.visited.getTime()) {
                    return -1;
                } else if(!a.visited && b.visited || a.visited && b.visited && a.visited.getTime() < b.visited.getTime()) {
                    return 1;
                } else {
                    return 0;
                }
            }),
            alphabetical: false,
            sortByCreation: false,
            lastVisited: true
        }));
    };

    handleSortButtonClicked = () => {
        // Close filter menu if sort menu is opened to prevent overlapping on small screens
        if (!this.state.sortMenuActive && this.state.filterActive) {
            this.setState((prevState: MyCoursesState) => ({
                filterActive: !prevState.filterActive
            }));
        }
        this.setState((prevState: MyCoursesState) => ({
            sortMenuActive: !prevState.sortMenuActive
        }));
    };

    private filterCourse(course: MyCourse) {
        let showCourse: boolean = course.name.toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase());
        if (!this.state.showHidden) {
            showCourse = showCourse && !course.hidden;
        }
        if (!this.state.showStarred) {
            showCourse = showCourse && !course.starred;
        }
        if (!this.state.showNonHighlighted) {
            showCourse = showCourse && (course.starred || course.hidden);
        }
        return showCourse;
    }

    private checkProperties(data: any[]): boolean {
        console.log(data);
        return data[0].hasOwnProperty('course_id') &&
            data[0].hasOwnProperty('name') &&
            data[0].hasOwnProperty('hidden') &&
            data[0].hasOwnProperty('starred') &&
            data[0].hasOwnProperty('role') &&
            data[0].hasOwnProperty('description') &&
            data[0].hasOwnProperty('visited');
    }
}