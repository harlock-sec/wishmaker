import { Link } from 'react-router-dom'
import './Extras.css'
export default function Messages(){return <div className="wm-extra"><header><Link to="/">← WISHMAKER_</Link><span>[ MESSAGES ]</span></header><main><h1>Messages</h1><p className="wm-warning">PRIVATE CHAT NOT YET ENABLED</p><p>Real user-to-user messages require a configured backend, authentication, and access controls. No messages are stored or sent by this demo.</p><Link to="/discover">[ explore demo profiles ]</Link></main></div>}
