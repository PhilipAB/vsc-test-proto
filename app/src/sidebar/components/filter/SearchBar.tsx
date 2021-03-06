import React from 'react';
import './SearchBar.css';

export interface SearchBarProps {
    searchTerm: string,
    placeHolder: string,
    changeFunction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface SearchBarState {
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
    render() {
        return (
            <input
                className="search-bar"
                key="random1"
                value={this.props.searchTerm}
                placeholder={this.props.placeHolder}
                onChange={this.props.changeFunction}
            />
        );
    }
};

export default SearchBar;