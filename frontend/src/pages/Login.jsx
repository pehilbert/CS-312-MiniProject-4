import '../index.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login( { setUserId } ) {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost/login', {
                username,
                password
            });

            setUserId(response.data.user_id);
            navigate('/');
        } catch (err) {
            console.error("Error during login", err);

            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("An error occurred during login. Please try again.");
            }
        }
    }

    return (
        <>
        	<form className="login-form" onSubmit={handleSubmit}>
                <h2>Log In</h2>
                {error && <p className="error-message">{error}</p>}
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" required className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="submit-btn">Log In</button>
                <p className="signup-link">Don't have an account?&nbsp;<a href="/signup">Sign Up</a></p>
            </form>
        </>
    )
}

export default Login;