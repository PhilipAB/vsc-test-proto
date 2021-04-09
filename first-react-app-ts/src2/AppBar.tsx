import React from 'react';
import TopAppBar from './TopAppBar';
import classnames from 'classnames';
import './appb.scss';
// import menu from './menu.svg';

export default class AppB extends React.Component {
  state = {
    isFixed: false,
    isShort: false,
    isProminent: false,
    isAlwaysCollapsed: true,
    noActionItems: true
  };

  get actionItems() {
    const { noActionItems } = this.state;

    if (!noActionItems) {
      const actionItems = [
        <span className="material-icons">
          bookmark
        </span>,
      ];

      return actionItems;
    }
  }

  render() {
    const { isShort, isProminent, isFixed, isAlwaysCollapsed } = this.state;

    return (
      <section
        className='mdc-typography'>
        {
          <TopAppBar
            navIcon={this.renderNavIcon()}
            short={isShort}
            prominent={isProminent}
            fixed={isFixed}
            alwaysCollapsed={isAlwaysCollapsed}
            title='Quick Access'
            actionItems={this.actionItems}
          />
        }
        <div className={classnames('mdc-top-app-bar--fixed-adjust', {
          'mdc-top-app-bar--short-fixed-adjust': isShort || isAlwaysCollapsed,
          'mdc-top-app-bar--prominent-fixed-adjust': isProminent,
        })}>
          {this.renderDemoParagraphs()}
        </div>
      </section>
    );
  }

  renderDemoParagraphs() {
    const createDemoParagraph = (key: React.Key | null | undefined) => (<p key={key}>
      Pellentesque habitant morbi tristique senectus et netus et malesuada fames
      ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
      tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean
      ultricies mi vitae est. Pellentesque habitant morbi tristique senectus et
      netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
      vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
      egestas semper. Aenean ultricies mi vitae est.
    </p>);
    const size = 20;
    const tags = Array.from(Array(size).keys());
    return tags.map((tag, key) => createDemoParagraph(key));
  }

  renderNavIcon() {
    return (
      // <img src={menu} className="material-icons" alt="logo" />
      <span className="material-icons" onClick={() => {console.log('nav icon clicked');}}>
        menu
      </span>
    );
  }

}