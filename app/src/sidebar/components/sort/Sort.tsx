import React from 'react';
import CodiconsListOrdered from '../../../svg/CodiconsListOrdered';
import './Sort.css';

export interface SortProps {
    showSortMenu: boolean,
    alphabetize: boolean,
    handleAlphabetize: () => void,
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
                    <label htmlFor="sort-alphabetical">
                        Alphabetical
                    </label>
                    <input type="checkbox" name="sort" id="sort-alphabetical" onChange={this.props.handleAlphabetize} checked={this.props.alphabetize} />
                </div>
            </div>
        );
    }
};

export default Sort;