import '../index.css';
import { useState, useEffect } from 'react';
import Post from "../components/Post"
import axios from 'axios';

function Home() {
    const [posts, setPosts] = useState(null);

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
    })

    return (
        <>
            {posts ?
            <div className="posts-container">
                {posts.map((post, index) => (
                    <Post key={index} post={post} />
                ))}
            </div> : 
            <div className="posts-container">
                <p>No posts available.</p>
            </div>}
        </>
    )
}

export default Home;