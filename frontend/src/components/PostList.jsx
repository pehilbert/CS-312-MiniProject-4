import { useState } from 'react';
import Post from './Post';
import '../index.css';

function PostList({ user_id, posts }) {
    // State variables
    const [filter, setFilter] = useState('');

    return (
        <>
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

export default PostList;