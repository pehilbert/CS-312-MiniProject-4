import "../index.css"
import { Link } from 'react-router-dom'

function Post( { post, user_id }) {
    return (
        <div className="post">
            <p className="post-category"><b>{post.category}</b></p>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <p className="post-author">By: {post.author}</p>
            <p className="post-timestamp">{post.timestamp}</p>
            {post.author_id === user_id && (
                <>
                    <Link to={`/edit/${post.id}/user_id=${user_id}`} className="edit-btn">Edit</Link>
                    <Link to={`/delete/${post.id}/user_id=${user_id}`} className="delete-btn">Delete</Link>
                </>
            )}
        </div>
    )
}

export default Post;