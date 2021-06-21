import React from 'react';
import CodiconsListOrdered from '../../../svg/CodiconsListOrdered';
import './Sort.css';

export interface SortProps {
    showSortMenu: boolean,
    alphabetize: boolean,
    sortByTimeOfCreation: boolean,
    lastVisited: boolean,
    handleAlphabetize: () => void,
    handleSortByTimeOfCreation: () => void,
    handleLastVisited: () => void,
    handleSortButtonClick: () => void
}

export interface SortState {
}

class Sort extends React.Component<SortProps, SortState> {
    render() {
        return (
            <div className="sort-container">
                <button onClick={this.props.handleSortButtonClick}>
                    <CodiconsListOrdered className="sort-icon"></CodiconsListOrdered>
                </button>
                <div className={this.props.showSortMenu ? "sort-menu active" : "sort-menu"}>
                    <div className="sort-option">
                        <label className="sort-label" htmlFor="sort-alphabetical">
                            Alphabetical
                        </label>
                        <input className="sort-input" type="radio" name="sort" id="sort-alphabetical" onChange={this.props.handleAlphabetize} checked={this.props.alphabetize} />
                    </div>
                    <div className="sort-option">
                        <label className="sort-label" htmlFor="sort-by-time-of-creation">
                            By time of creation
                        </label>
                        <input className="sort-input" type="radio" name="sort" id="sort-by-time-of-creation" onChange={this.props.handleSortByTimeOfCreation} checked={this.props.sortByTimeOfCreation} defaultChecked />
                    </div>
                    <div className="sort-option">
                        <label className="sort-label" htmlFor="last-visited">
                            Last visited
                        </label>
                        <input className="sort-input" type="radio" name="sort" id="last-visited" onChange={this.props.handleLastVisited} checked={this.props.lastVisited} />
                    </div>
                </div>
            </div>
        );
    }
};

export default Sort;