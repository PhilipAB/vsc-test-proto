import React from 'react';
import ListCard from '../cards/ListCard';
import './CourseList.css';

export default class CourseList extends React.Component {
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
