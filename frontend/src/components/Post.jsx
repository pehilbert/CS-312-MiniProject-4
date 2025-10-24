import "../index.css"

function Post( { post }) {
    return (
        <div className="post">
            <p className="post-category"><b>{post.category}</b></p>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <p className="post-author">By: {post.author}</p>
            <p className="post-timestamp">{post.timestamp}</p>
        </div>
    )
}

export default Post;