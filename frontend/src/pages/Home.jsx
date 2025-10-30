import '../index.css';
import { useState, useEffect } from 'react';
import Post from "../components/Post";
import axios from 'axios';
import PostList from '../components/PostList';
import BlogPostForm from '../components/BlogPostForm';

function Home({ user_id }) {
    // State variables
    const [posts, setPosts] = useState([]);

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

            <BlogPostForm user_id={user_id} refresh={fetchPosts} />
            <PostList user_id={user_id} posts={posts} />
        </>
    );
}

export default Home;