import React from 'react';
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import CodiconsSync from '../../../svg/CodiconsSync';
import { Assignment } from '../../../models/Assignment';
import './Assignments.css';
import { apiBaseUrl } from '../../../constants';
import { isNonEmptyAssignmentArray } from '../../../predicates/isAssignmentArray';
import SearchBar from '../filter/SearchBar';
import AssignmentCard from '../cards/AssignmentCard';

export interface PathParams {
    accessToken: string
}

export interface AssignmentsProps extends RouteComponentProps<PathParams> {
}

export interface AssignmentsState {
    loading: boolean,
    assignmentData: Assignment[],
    currentPage: number,
    searchTerm: string
}

class Assignments extends React.Component<AssignmentsProps, AssignmentsState> { 
    assignmentsPerPage: number;
    constructor(props: AssignmentsProps) {
        super(props);
        this.assignmentsPerPage = 2;
        this.state = {
            loading: true,
            assignmentData: [],
            currentPage: 1,
            searchTerm: ""
        };
    }

    async componentDidMount() {
        await fetch(`${apiBaseUrl}/assignments`, {
            method: 'GET',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.match.params.accessToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    if (isNonEmptyAssignmentArray(data)) {
                        this.setState({
                            assignmentData: data
                        });
                    }
                }
            });
        this.setState({
            loading: false
        });
    }

    renderAssignments() {
        if (this.state.loading) {
            return (<CodiconsSync className="assignments-loading"></CodiconsSync>);
        } else if (isNonEmptyAssignmentArray(this.state.assignmentData)) {
            // Logic for displaying courses
            const filteredAssignments: Assignment[] = this.state.assignmentData.filter(assignment => this.filterAllAssignments(assignment));
            const indexLastAssignment = this.state.currentPage * this.assignmentsPerPage;
            const indexFirstAssignment = indexLastAssignment - this.assignmentsPerPage;
            const currentAssignments = filteredAssignments.slice(indexFirstAssignment, indexLastAssignment);
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(filteredAssignments.length / this.assignmentsPerPage); i++) {
                pageNumbers.push(i);
            }
            return (
                <div className="assignments-card-container">
                    <SearchBar searchTerm={this.state.searchTerm} placeHolder={"Search assignment"} changeFunction={this.handleSearchEdit}></SearchBar>
                    <ul className="assignments-list">
                        {currentAssignments.map((assignment: Assignment) => {
                            return (
                                <li className="assignments-list-card" key={assignment.id}>
                                    <AssignmentCard accessToken={this.props.match.params.accessToken} id={assignment.id} name={assignment.name} repository={assignment.repository} description={assignment.description} ></AssignmentCard>
                                </li>
                            );
                        })}
                    </ul>
                    <ul className="assignments-page-numbers">
                        {pageNumbers.map(number => {
                            return (
                                <li className="assignments-page-number" key={number} onClick={this.handlePageNumberClick}>
                                    {number}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        } else {
            return "No assignments to display!";
        }
    }

    handlePageNumberClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        this.setState({ currentPage: Number(event.currentTarget.innerText) });
    };

    handleSearchEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchTerm: event.target.value });
    };

    private filterAllAssignments(assignment: Assignment) {
        return assignment.name.toLocaleLowerCase().includes(this.state.searchTerm.toLocaleLowerCase());
    }

    render() {
        return (
            <div className="assignments-container">
                <h2 className="assignments-header">Assignments</h2>
                {this.renderAssignments()}
            </div>
        );
    }
}

export default withRouter(Assignments);