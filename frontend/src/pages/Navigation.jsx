import { Link } from 'react-router-dom';
import './Navigation.css'; // Import your CSS file

export default function Navigation() {
    return (
        <div className="landing-page">
        <nav className="navigation">
        </nav>
        <div className="hero-section">
            <h1>Welcome to Your Todo App</h1>
            <p>Organize your tasks and stay productive</p>
            <Link to="/signup" className="cta-button">Get Started</Link>
        </div>
    </div>
    );
}
