import React from 'react';
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import ListCard from '../cards/ListCard';
import './CourseList.css';

export interface PathParams {
    accessToken: string
}

export interface CourseListProps extends RouteComponentProps<PathParams> {
}

export interface CourseListState {
    loading: boolean,
    data: any
}

class CourseList extends React.Component<CourseListProps, CourseListState> {
    async componentDidMount() {
        const apiBaseUrl: string = "http://localhost:3000";
        await fetch(`${apiBaseUrl}/courses`, {
            method: 'GET',
            // Auth header not required yet to fetch courses from api. 
            // Still included to prevent errors in case of future api updates.    
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.match.params.accessToken}`
            }
        }).then(response => response.json())
            .then(data => this.setState({
                loading: false,
                data: {
                    id: data.id,
                    name: data.name,
                    creatorId: data.creator_id
                }
            }));

    }

    render() {
        return (
            <div className="card-container">
                <h2 className="list-header">Course list</h2>
                <ListCard name="Hello" ></ListCard>
                <ListCard name="Hello 2" ></ListCard>
            </div>
        );
    }
}

export default withRouter(CourseList);