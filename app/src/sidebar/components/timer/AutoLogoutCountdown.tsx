import * as React from 'react';
import jwt from "jsonwebtoken";
import { isJwtPayloadWithExp } from '../../../predicates/isJwtPayloadWithExp';
import './AutoLogoutCountdown.css';

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const AutoLogoutCountdown = (props: { initAccesstoken: string }) => {
    let timer: number = 0;
    let interval: number = 60;
    if (props.initAccesstoken) {
        const currentTime: number = Date.now() / 1000;
        const payload = jwt.decode(props.initAccesstoken, { json: true });
        if (isJwtPayloadWithExp(payload)) {
            if (payload.exp < currentTime) {
                vscode.postMessage({ type: 'signOut' });
                vscode.postMessage({ type: 'onInfo', value: 'Session expired!' });
            } else {
                timer = payload.exp - currentTime;
                interval = timer % 60;
            }
        }
    }
    const [minutes, setMinutes] = React.useState(Math.ceil(timer / 60));

    React.useEffect(() => {
        if (minutes > 0) {
            const timeout = setTimeout(() => setMinutes(minutes - 1), interval * 1000);
            return () => { clearTimeout(timeout); };
        } else {
            setMinutes(0);
        }
    });

    return (
        <div className={minutes > 0 ? "logout-timer active" : "logout-timer"}>
            <pre style={minutes > 15 ? { color: "green" } : minutes > 5 ? { color: "yellow" } : { color: "red" }}>
                {minutes}
            </pre>
        </div>
    );
};

export default AutoLogoutCountdown;