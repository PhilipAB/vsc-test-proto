import React, { ReactElement } from 'react';
import classnames from 'classnames';

import { MDCFixedTopAppBarFoundation, MDCShortTopAppBarFoundation, MDCTopAppBarFoundation } from '@material/top-app-bar';

export interface TopAppBarProps {
    className?: string,
    style?: any;
    alwaysCollapsed?: boolean,
    fixed: boolean,
    prominent: boolean,
    short?: boolean,
    title?: string,
    actionItems: ReactElement[],
    navIcon?: ReactElement
}

export interface TopAppBarState {
    classList: Set<string>,
    style: any
}

export default class TopAppBar extends React.Component<TopAppBarProps, TopAppBarState> {

    foundation_: MDCShortTopAppBarFoundation | MDCFixedTopAppBarFoundation | MDCTopAppBarFoundation;
    topAppBarElement: React.RefObject<any>;

    constructor(props: TopAppBarProps) {
        super(props);
        this.topAppBarElement = React.createRef<any>();
        this.foundation_ = {} as MDCTopAppBarFoundation;
    }

    static defaultProps: TopAppBarProps = {
        alwaysCollapsed: false,
        short: false,
        fixed: false,
        prominent: false,
        title: '',
        actionItems: [],
        navIcon: {} as ReactElement
    };

    state: TopAppBarState = {
        classList: new Set(),
        style: {},
    };

    get classes() {
        const { classList } = this.state;
        const {
            alwaysCollapsed,
            className,
            fixed,
            short,
            prominent
        } = this.props;

        return classnames('mdc-top-app-bar', Array.from(classList), className, {
            'mdc-top-app-bar--fixed': fixed,
            'mdc-top-app-bar--short': short,
            'mdc-top-app-bar--short-collapsed': alwaysCollapsed,
            'mdc-top-app-bar--prominent': prominent
        });
    }

    componentDidUpdate(prevProps: TopAppBarProps & React.HTMLProps<HTMLElement>) {
        const { short, fixed, prominent } = this.props;
        const changedToAlwaysCollapsed = prevProps.alwaysCollapsed !== this.props.alwaysCollapsed;
        const changedToShort = prevProps.short !== this.props.short;
        const changedToFixed = prevProps.fixed !== this.props.fixed;
        const changedToProminent = prevProps.prominent !== this.props.prominent;
        if ((!short && !fixed) || (!short && !prominent)) { return; }
        if (changedToAlwaysCollapsed
            || changedToShort
            || changedToFixed
            || changedToProminent) {
            this.initializeFoundation();
        }
    }

    componentDidMount() {
        this.initializeFoundation();
    }

    componentWillUnmount() {
        // remember to always call destroy when the component is removed from the DOM.
        this.foundation_.destroy();
    }

    private initializeFoundation = () => {
        if (this.props.short) {
            this.foundation_ = new MDCShortTopAppBarFoundation(this.adapter);
        } else if (this.props.fixed) {
            this.foundation_ = new MDCFixedTopAppBarFoundation(this.adapter);
        } else {
            this.foundation_ = new MDCTopAppBarFoundation(this.adapter);
        }
    };

    setStyle = (varName: string | number, value: any) => {
        const updatedStyle = Object.assign({}, this.state.style);
        updatedStyle[varName] = value;
        this.setState({ style: updatedStyle });
    };

    getMergedStyles = () => {
        const { style } = this.props;
        const { style: internalStyle } = this.state;
        return Object.assign({}, internalStyle, style);
    };

    get adapter() {
        const { actionItems } = this.props;

        return {
            hasClass: (className: string) => this.classes.split(' ').includes(className),
            addClass: (className: string) => this.setState({ classList: this.state.classList.add(className) }),
            removeClass: (className: string) => {
                const { classList } = this.state;
                classList.delete(className);
                this.setState({ classList });
            },
            setStyle: this.setStyle,
            getTopAppBarHeight: () => this.topAppBarElement.current.clientHeight,
            registerScrollHandler: (handler: (this: Window, ev: Event) => any) => window.addEventListener('scroll', handler),
            deregisterScrollHandler: (handler: (this: Window, ev: Event) => any) => window.removeEventListener('scroll', handler),
            registerResizeHandler: (handler: (this: Window, ev: UIEvent) => any) => window.addEventListener('resize', handler),
            deregisterResizeHandler: (handler: (this: Window, ev: UIEvent) => any) => window.removeEventListener('resize', handler),
            getViewportScrollY: () => window.pageYOffset,
            getTotalActionItems: () => actionItems && actionItems.length,
        };
    }

    render() {
        console.log(this.classes);
        console.log(this.props.actionItems);
        const {
            title,
            navIcon,
        } = this.props;

        return (
            <header
                className={this.classes}
                style={this.getMergedStyles()}
                ref={this.topAppBarElement}
            >
                <div className='mdc-top-app-bar__row'>
                    <section className='mdc-top-app-bar__section mdc-top-app-bar__section--align-start'>
                        {navIcon ? navIcon : null}
                        <span className="mdc-top-app-bar__title">
                            {title}
                        </span>
                    </section>
                    {this.renderActionItems()}
                </div>
            </header>
        );
    }

    renderActionItems() {
        const { actionItems } = this.props;
        if (!actionItems) {
            return;
        }

        return (
            <section className='mdc-top-app-bar__section mdc-top-app-bar__section--align-end' role='toolbar'>
                {/* need to clone element to set key */}
                {actionItems.map((item: ReactElement<{ key: any; }>, key: any) => React.cloneElement(item, { key }))}
            </section>
        );

    }

}