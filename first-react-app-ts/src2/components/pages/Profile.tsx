import * as React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import { User } from "../../models/User";
import { isUser } from "../../predicates/isUser";
import GoogleLoop from "../svg/GoogleLoop";
import './Profile.css';

// Param(s) via link to profile. Accessible in 'this.props.match.params.*'
export interface PathParams {
    accessToken: string
}

export interface ProfileProps extends RouteComponentProps<PathParams> {
}

export interface ProfileState {
    loading: boolean,
    data: User | { error: string }
}

class Profile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);

        this.state = {
            loading: true,
            data: { error: "User not defined!" },
        };
    }

    async componentDidMount() {
        const apiBaseUrl: string = "http://localhost:3000";
        await fetch(`${apiBaseUrl}/users/profile`, {
            method: 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${this.props.match.params.accessToken}`
            }
        }).then(response => response.json())
            .then(data => this.setState({
                loading: false,
                data: {
                    id: data.id,
                    providerId: data.provider_id,
                    name: data.name,
                    role: data.role
                }
            }));

    }

    render() {
        return (
            <div className="container">
                {this.state.loading ?
                    (<GoogleLoop className="loading-loop"></GoogleLoop>)
                    : (
                        isUser(this.state.data) ?
                            (
                                <div className="profile">
                                    <p>
                                        Hello {this.state.data.name}!
                                    </p>
                                    <p>
                                        Your role: {this.state.data.role}
                                    </p>
                                </div>
                            ) :
                            (
                                "No profile data available!"
                            )
                    )}
            </div>
        );
    }
};

export default withRouter(Profile);