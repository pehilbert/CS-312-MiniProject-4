import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function DeletePost() {    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
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
                setPost(response.data.post);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError('Error loading post');
            }

            setLoading(false);
        }

        fetchPost();
    });

    async function handleDelete() {
        try {
            await axios.post('http://localhost/delete', {
                id: id,
                user_id: user_id
            });
            
            navigate('/');
        } catch (err) {
            console.error("Error deleting post:", err);
            setError('Error deleting post');
        }
    }

    function handleGoBack() {
        navigate('/');
    }

    if (loading) {
        return <div className="create-form"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="create-form"><p>Error: {error}</p></div>;
    }

    return (
        <div className="create-form">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this post?</p>
            
            {post && (
                <div className="post">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{post.content}</p>
                    <p className="post-author">By: {post.author}</p>
                </div>
            )}
            
            <div style={{ marginTop: '20px' }}>
                <button 
                    type="button" 
                    onClick={handleDelete}
                    className="delete-btn"
                >
                    Delete
                </button>
                <button 
                    type="button" 
                    onClick={handleGoBack}
                    className="submit-btn"
                    style={{ marginLeft: '10px' }}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default DeletePost;