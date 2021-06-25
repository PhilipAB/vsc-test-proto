import React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { apiBaseUrl } from "../../../constants";
import './CreateAssignment.css';

export interface CreateAssignmentPathParams {
    accessToken: string
}

export interface CreateAssignmentProps extends RouteComponentProps<CreateAssignmentPathParams> {
}

export interface CreateAssignmentState {
    assignmentName: string;
    repository: string;
    assignmentDescription: string;
}

class CreateAssignment extends React.Component<CreateAssignmentProps, CreateAssignmentState> {
    constructor(props: CreateAssignmentProps) {
        super(props);
        this.state = {
            assignmentName: "",
            repository: "",
            assignmentDescription: ""
        };
    }

    render() {
        return (
            <div className="create-assignment-container">
                <form>
                    <h2 className="create-assignment-header">Create Assignment</h2>
                    <div className="assignment-input">
                        <label className="label">Assignment name</label>
                        <input className="input" name="assignmentName" placeholder="Assignment name" onChange={this.onChangeAssignmentName} value={this.state.assignmentName} required />
                    </div>
                    <div className="assignment-input">
                        <label className="label">Link to repository</label>
                        <input className="input" name="repo" id="Repository link" onChange={this.onChangeRepo} value={this.state.repository} required />
                    </div>
                    <div className="assignment-input">
                        <label className="label">Assignment description</label>
                        <input className="input" name="assignmentDescription" placeholder="Assignment description" onChange={this.onChangeAssignmentDescription} value={this.state.assignmentDescription} />
                    </div>
                    <button onClick={this.onClickSubmit}>Create Assignment</button>
                </form>
            </div>
        );
    }

    onChangeAssignmentName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            assignmentName: event.currentTarget.value
        });
    };

    onChangeRepo = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            repository: event.currentTarget.value
        });
    };

    onChangeAssignmentDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            assignmentDescription: event.currentTarget.value
        });
    };

    onClickSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.state.assignmentName && this.state.repository) {
            // The default behaviour seems to be a redirect to the assignment creation page with the form values as query parameters. 
            // This would result in an error. Therefore, we need to prevent it. 
            event.preventDefault();
            try {
                await fetch(`${apiBaseUrl}/assignments`, {
                    method: 'POST', 
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Authorization': `Bearer ${this.props.match.params.accessToken}`,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Accept': 'application/json',
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: this.state.assignmentName, repository: this.state.repository, description: this.state.assignmentDescription })
                }).then(response => {
                    if (response.status === 201) {
                        vscode.postMessage({ type: 'onInfo', value: `Assignment "${this.state.assignmentName}" created successfully!` });
                        this.setState({
                            assignmentName: "",
                            repository: "",
                            assignmentDescription: ""
                        });
                    } else if (response.status === 409) {
                        vscode.postMessage({ type: 'onInfo', value: `Assignment with name ${this.state.assignmentName} already exists!` });
                    } else {
                        vscode.postMessage({ type: 'onInfo', value: `Failed to create assignment!` });
                    }
                });
            } catch (error) {
                vscode.postMessage({ type: 'onInfo', value: `Failed to create assignment!` });
            }
        }
    };
}
export default withRouter(CreateAssignment);