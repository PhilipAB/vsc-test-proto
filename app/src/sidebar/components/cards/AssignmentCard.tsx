import * as React from "react";
import { Redirect } from 'react-router';
import CodiconsLinkExternal from "../../../svg/CodiconsLinkExternal";
import './AssignmentCard.css';

export interface AssignmentCardProps {
    id: number
    name: string
    repository: string
    description: string
    accessToken: string
}

export interface AssignmentCardState {
    redirectToAssignment: boolean
}

export default class AssignmentCard extends React.Component<AssignmentCardProps, AssignmentCardState> {
    encodedRepo: string;
    constructor(props: AssignmentCardProps) {
        super(props);
        this.encodedRepo = encodeURIComponent(this.props.repository);
        this.state = {
            redirectToAssignment: false
        };
    }

    render() {
        return this.state.redirectToAssignment ? (
            <Redirect to={`/assignment/${this.props.accessToken}/${this.props.id.toString()}/${this.props.name}/${this.encodedRepo}/${this.props.description}`} push={true} />
        ) : (
            <div className="assignment-card" onClick={this.handleAssignmentCardClick}>
                {this.props.name} <CodiconsLinkExternal className="assignment-open-in-new" />
            </div>
        );
    }

    handleAssignmentCardClick = () => {
        this.setState({
            redirectToAssignment: true
        });
    };
};


