import * as React from "react";
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

    handleStarred = () => {
        // TODO -> api call
        // delete console.log in backend
        this.setState((prevState: MyCourseCardState) => ({
            starred: !prevState.starred
        }));
    };
    handleHidden = () => {
        // TODO -> api call
        this.setState((prevState: MyCourseCardState) => ({
            hidden: !prevState.hidden
        }));
    };
};