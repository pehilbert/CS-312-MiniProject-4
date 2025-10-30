import { useState } from 'react';
import axios from 'axios';
import '../index.css';

function BlogPostForm({ user_id, refresh }) {
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
            refresh();
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

    return (
        <>
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
        </>
    )
}

export default BlogPostForm;