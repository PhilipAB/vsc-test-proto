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
    hidden: boolean,
    starred: boolean,
    handleHidden: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleStarred: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface MyCourseCardState {
}

export default class MyCourseCard extends React.Component<MyCourseCardProps, MyCourseCardState> {
    constructor(props: MyCourseCardProps) {
        super(props);
    }

    render() {
        return (
            <div className="my-course-card">
                <span className="course-name-wrapper">
                    {this.props.name} <OpenInNew className="open-my-course-in-new" />
                </span>
                <span className="course-props-wrapper">
                    <input
                        type="checkbox"
                        name="hide"
                        id={"hidden" + this.props.id.toString()}
                        onChange={this.props.handleHidden}
                        checked={this.props.hidden} />
                    <label htmlFor={"hidden" + this.props.id.toString()} className="option hidden" tabIndex={0}>
                        <GoogleHide className="hide"></GoogleHide>
                    </label>
                    <input
                        type="checkbox"
                        name="star"
                        id={"starred" + this.props.id.toString()}
                        onChange={this.props.handleStarred}
                        checked={this.props.starred} />
                    <label htmlFor={"starred" + this.props.id.toString()} className="option starred" tabIndex={0}>
                        <GoogleStar className="star"></GoogleStar>
                    </label>
                </span>
            </div>
        );
    }
};