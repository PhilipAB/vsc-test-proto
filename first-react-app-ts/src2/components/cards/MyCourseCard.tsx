import * as React from "react";
import { apiBaseUrl } from "../../../constants";
import GoogleHide from "../svg/GoogleHide";
import GoogleStar from "../svg/GoogleStar";
import OpenInNew from "../svg/OpenInNew";
import './MyCourseCard.css';

export interface MyCourseCardProps {
    id: number,
    name: string,
    accessToken: string,
    initialHidden: boolean,
    initialStarred: boolean
}

export interface MyCourseCardState {
    hidden: boolean,
    starred: boolean
}

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
export default class MyCourseCard extends React.Component<MyCourseCardProps, MyCourseCardState> {
    constructor(props: MyCourseCardProps) {
        super(props);
        this.state = {
            hidden: props.initialHidden,
            starred: props.initialStarred
        };
    }

    render() {
        return (
            <div className="my-course-card">
                <span className="course-name-wrapper">
                    {this.props.name} <OpenInNew className="open-my-course-in-new" />
                </span>
                <span className="course-props-wrapper">
                    <input type="checkbox" name="hide" id={"hidden" + this.props.id.toString()} onChange={this.handleHidden} checked={this.state.hidden} />
                    <label htmlFor={"hidden" + this.props.id.toString()} className="option hidden" tabIndex={0}>
                        <GoogleHide className="hide"></GoogleHide>
                    </label>
                    <input type="checkbox" name="star" id={"starred" + this.props.id.toString()} onChange={this.handleStarred} checked={this.state.starred} />
                    <label htmlFor={"starred" + this.props.id.toString()} className="option starred" tabIndex={0}>
                        <GoogleStar className="star"></GoogleStar>
                    </label>
                </span>
            </div>
        );
    }

    handleHidden = async () => {
        await fetch(`${apiBaseUrl}/courses/hidden/${this.props.id}`, {
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
            body: JSON.stringify({ hidden: !this.state.hidden })
        }).then(response => {
            if (response.status === 200 && this.state.hidden) {
                vscode.postMessage({ type: 'onInfo', value: `Show ${this.props.name}!` });
            } else if (response.status === 200 && !this.state.hidden) {
                vscode.postMessage({ type: 'onInfo', value: `Hide ${this.props.name}!` });
            } else {
                vscode.postMessage({ type: 'onInfo', value: `Failed to update star property!` });
            }
        });

        this.setState((prevState: MyCourseCardState) => ({
            hidden: !prevState.hidden
        }));
    };

    handleStarred = async () => {
        await fetch(`${apiBaseUrl}/courses/starred/${this.props.id}`, {
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
            body: JSON.stringify({ starred: !this.state.starred })
        }).then(response => {
            if (response.status === 200 && this.state.starred) {
                vscode.postMessage({ type: 'onInfo', value: `Unstarred ${this.props.name}!` });
            } else if (response.status === 200 && !this.state.starred) {
                vscode.postMessage({ type: 'onInfo', value: `Starred ${this.props.name}!` });
            } else {
                vscode.postMessage({ type: 'onInfo', value: `Failed to update star property!` });
            }
        });

        this.setState((prevState: MyCourseCardState) => ({
            starred: !prevState.starred
        }));
    };
};