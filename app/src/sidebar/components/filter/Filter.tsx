import React from 'react';
import CodiconsFilter from '../../../svg/CodiconsFilter';
import './Filter.css';

export interface FilterProps {
    showFilterMenu: boolean,
    showHidden: boolean,
    showStarred: boolean,
    showNonHighlighted: boolean,
    handleShowHidden: () => void,
    handleShowStarred: () => void,
    handleShowNonHighlighted: () => void,
    handleFilterButtonClick: () => void
}

export interface FilterState {
}

class Filter extends React.Component<FilterProps, FilterState> {
    render() {
        return (
            <div className="filter-container">
                <button onClick={this.props.handleFilterButtonClick}>
                    <CodiconsFilter className="filter-icon"></CodiconsFilter>
                </button>
                <div className={this.props.showFilterMenu ? "filter-menu active" : "filter-menu"}>
                    <div className="filter-option">
                        <label className="filter-label" htmlFor="show-hide">
                            Show hidden courses
                        </label>
                        <input type="checkbox" name="hide" id="show-hide" onChange={this.props.handleShowHidden} checked={this.props.showHidden} />
                    </div>
                    <div className="filter-option">
                        <label className="filter-label" htmlFor="show-hide">
                            Show starred courses
                        </label>
                        <input type="checkbox" name="non-highlighted" id="show-star" onChange={this.props.handleShowStarred} checked={this.props.showStarred} />
                    </div>
                    <div className="filter-option">
                        <label className="filter-label" htmlFor="show-non-highlighted">
                            Show nonhighlighted courses
                        </label>
                        <input type="checkbox" name="non-highlighted" id="show-non-highlighted" onChange={this.props.handleShowNonHighlighted} checked={this.props.showNonHighlighted} />
                    </div>
                </div>
            </div>
        );
    }
};

export default Filter;