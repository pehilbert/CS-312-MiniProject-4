import '../index.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup( { setUserId } ) {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    
    const submitLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost/signup', {
                username,
                name,
                password,
                confirm_password: confirmPassword
            });

            setUserId(response.data.user_id);
            navigate('/');
        } catch (err) {
            console.error("Error during signup", err);

            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("An error occurred during signup. Please try again.");
            }
        }
    }
    return (
        <>
            <form className="login-form" onSubmit={submitLogin}>
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" required className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="confirm_password">Confirm Password:</label>
                <input type="password" name="confirm_password" required className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit" className="submit-btn">Sign Up</button>
                <p className="signup-link">Have an account?&nbsp;<a href="/login">Log In</a></p>
            </form>
        </>
    )
}

export default Signup;