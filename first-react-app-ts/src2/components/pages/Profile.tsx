import * as React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import { apiBaseUrl } from "../../../constants";
import { User } from "../../models/User";
import { isUser } from "../../predicates/isUser";
import GoogleLoop from "../svg/GoogleLoop";
import './Profile.css';

// Param(s) via link to profile. Accessible in 'this.props.match.params.*'
export interface PathParams {
    accessToken: string,
    loading: string,
    name?: string,
    role?: "Student" | "Lecturer"
}

export interface ProfileProps extends RouteComponentProps<PathParams> {
}

export interface ProfileState {
}

class Profile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
    }

    render() {
        const isLoading: boolean = Boolean(JSON.parse(this.props.match.params.loading));
        return (
            <div className="profile-container">
                {isLoading ?
                    (<GoogleLoop className="loading-loop"></GoogleLoop>)
                    : (
                        // User should always have a role. Name may be undefined (e. g. not required on GitHub)
                        this.props.match.params.role ? (
                            <>
                                <p>
                                    Hello {this.props.match.params.name}!
                                    </p>
                                <p>
                                    Your role: {this.props.match.params.role}
                                </p>
                            </>
                        ) : (
                            "No profile data available!"
                        )
                    )}
            </div>
        );
    }
};

export default withRouter(Profile);