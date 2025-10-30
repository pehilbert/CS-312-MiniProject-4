import '../index.css';
import { useState, useEffect } from 'react';
import Post from "../components/Post";
import axios from 'axios';

function Home({ user_id }) {
    const [posts, setPosts] = useState(null);
    const [filter, setFilter] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: ''
    });

    async function fetchPosts() {
        try {
            const response = await axios.get('http://localhost/posts');
            setPosts(response.data.posts);
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    }

    async function handleCreatePost(e) {
        e.preventDefault();
        try {
            await axios.post('http://localhost/create', {
                ...formData,
                user_id: user_id
            });
            setFormData({ title: '', content: '', category: '' });
            setShowCreateForm(false);
            fetchPosts(); // Refresh posts after creating
        } catch (err) {
            console.error("Error creating post", err);
        }
    }

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        fetchPosts();
    }, []);

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

            {posts ? (
                <div className="posts-container">
                    <select 
                        name="filter" 
                        className="input-field post-filter-input" 
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                    >
                        <option value="" disabled>Filter by Category</option>
                        <option value="General">General</option>
                        <option value="Tech">Tech</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Fashion">Fashion</option>
                        <option value="">Show All</option>
                    </select>
                    {filter && <p>Currently filtering by: {filter}</p>}
                    {posts.filter(post => !filter || post.category === filter).map((post, index) => (
                        <Post key={index} post={post} user_id={user_id} />
                    ))}
                </div>
            ) : (
                <div className="posts-container">
                    <p>No posts available.</p>
                </div>
            )}
        </>
    );
}

export default Home;