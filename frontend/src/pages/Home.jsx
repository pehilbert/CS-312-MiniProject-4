import '../index.css';
import { useState, useEffect } from 'react';
import Post from "../components/Post";
import axios from 'axios';
import PostList from '../components/PostList';

function Home({ user_id }) {
    // State variables
    const [posts, setPosts] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: ''
    });

    // API call to create a new post
    async function handleCreatePost(e) {
        e.preventDefault();
        try {
            await axios.post('http://localhost/create', {
                ...formData,
                user_id: user_id
            });

            setFormData({
                title: '',
                content: '',
                category: ''
            });
            setShowCreateForm(false);
        } catch (err) {
            console.error("Error creating post", err);
        }
    }

    // Fetch posts from backend
    async function fetchPosts() {
        try {
            const response = await axios.get('http://localhost/posts');
            setPosts(response.data.posts);
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    return (
        <>
            {user_id ? (
                <div style={{ padding: '2rem', margin: '1rem auto', width: 'fit-content' }}>
                    <p>Currently signed in as: {user_id}</p>
                    <a className="login-btn" href="/">Sign Out</a>
                </div>
            ) : (
                <div style={{ padding: '2rem', margin: '1rem auto', width: 'fit-content' }}>
                    <a className="login-btn" href="/login">Log In to create posts</a>
                </div>
            )}

            {user_id && (
                <div className="create-form-container">
                    <button 
                        className="toggle-btn" 
                        type="button"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? '-' : '+'}
                    </button>
                    {showCreateForm && (
                        <form onSubmit={handleCreatePost} className="create-form">
                            <h2>Create Post</h2>
                            <label htmlFor="title">Title:</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title}
                                onChange={handleInputChange}
                                required 
                                className="input-field" 
                            />
                            <label htmlFor="content">Content:</label>
                            <textarea 
                                name="content" 
                                value={formData.content}
                                onChange={handleInputChange}
                                required 
                                className="input-field content-input"
                            />
                            <label htmlFor="category">Category:</label>
                            <select 
                                name="category" 
                                value={formData.category}
                                onChange={handleInputChange}
                                required 
                                className="input-field"
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="General">General</option>
                                <option value="Tech">Tech</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Fashion">Fashion</option>
                            </select>
                            <button type="submit" className="submit-btn">Post</button>
                        </form>
                    )}
                </div>
            )}

            <PostList user_id={user_id} posts={posts} />
        </>
    );
}

export default Home;