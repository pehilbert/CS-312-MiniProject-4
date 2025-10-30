import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function EditPost() {
    const navigate = useNavigate();
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        author_id: '',
        title: '',
        content: '',
        category: ''
    });

    const { id, user_id } = useParams();

    useEffect(() => {
        async function fetchPost() {
            if (!id || !user_id) {
                setError('Missing post ID or user ID');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost/post?id=${id}`);
                setFormData({
                    title: response.data.post.title || '',
                    content: response.data.post.content || '',
                    category: response.data.post.category || ''
                });
            } catch (err) {
                console.error("Error fetching post:", err);
                setError('Error loading post');
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id, user_id]);

    async function handleEditPost(e) {
        e.preventDefault();

        try {
            await axios.post('http://localhost/edit', {
                id,
                user_id,
                ...formData,
            });

            navigate('/');
        } catch (err) {
            console.error("Error editing post:", err);
            setError('Error editing post');
        }
    }

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    if (loading) {
        return <div className="create-form"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="create-form"><p>Error: {error}</p></div>;
    }

    return (
        <div className="create-form">
            <h2>Edit Post</h2>
            <form onSubmit={handleEditPost} className="create-form">
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
        </div>
    );
}

export default EditPost;