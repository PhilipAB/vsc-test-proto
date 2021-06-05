import React from 'react';
import GoogleFilter from '../svg/GoogleFilter';
import './Filter.css';

export interface FilterProps {
    showFilterMenu: boolean,
    showHidden: boolean,
    showStarred: boolean,
    handleShowHidden: () => void,
    handleShowStarred: () => void,
    handleFilterButtonClick: () => void
}

export interface FilterState {
}

class Filter extends React.Component<FilterProps, FilterState> {
    render() {
        return (
            <div className="filter-container">
                <button onClick={this.props.handleFilterButtonClick}>
                    <GoogleFilter className="filter-icon"></GoogleFilter>
                </button>
                <div className={this.props.showFilterMenu ? "filter-menu active" : "filter-menu"}>
                    <label htmlFor="show-hide">
                        Show hidden courses
                    </label>
                    <input type="checkbox" name="hide" id="show-hide" onChange={this.props.handleShowHidden} checked={this.props.showHidden} />
                    <label htmlFor="show-hide">
                        Show starred courses
                    </label>
                    <input type="checkbox" name="star" id="show-star" onChange={this.props.handleShowStarred} checked={this.props.showStarred} />
                </div>
            </div>
        );
    }
};

export default Filter;