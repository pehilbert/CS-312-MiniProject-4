const express = require('express');
const pg = require('pg');
const { format } = require('date-fns');
const cors = require('cors');

// Globals
const PORT = 80;

let posts = [];
let currentId = 0;

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'BlogsDB',
    password: 'password',
    port: 5432,
});

db.connect();

// Initialize express
const app = express();

// Initialize EJS
app.set('view engine', 'ejs');

// CORS middleware
app.use(cors());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use(cors({
  origin: '*'
}));

// Routes

app.get('/post', (req, res) => {
    const { id } = req.query || {};

    if (!id) {
        return res.status(400).send({ message: 'Post ID is required' });
    }

    db.query(
        "SELECT * FROM blogs WHERE blog_id = $1",
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Database error' });
            }
            if (result.rowCount === 0) {
                return res.status(404).send({ message: 'Post not found' });
            }
            const dbPost = result.rows[0];
            const post = {
                id: dbPost.blog_id,
                title: dbPost.title,
                content: dbPost.body,
                author: dbPost.creator_name
            };

            res.send({ post });
        }
    );
});

app.get('/posts', (req, res) => {
    const { filter } = req.body || {};

    db.query('SELECT * FROM blogs', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }

        const dbPosts = result.rows.map(row => ({
            id: row.blog_id,
            author: row.creator_name,
            author_id: row.creator_user_id,
            title: row.title,
            content: row.body,
            category: row.category,
            timestamp: format(new Date(row.date_created), 'MMMM d, yyyy hh:mm a')
        }));

        if (filter) {
            const filteredPosts = dbPosts.filter(post => post.category === filter);
            return res.send({ posts: filteredPosts });
        }

        res.send({ posts: dbPosts });
    });
});

// Edit post form
app.get('/edit', (req, res) => {
    const {id, user_id} = req.query || {};

    if (!id || !user_id) {
        return res.render('pages/error', { message: 'An error ocurrred loading this page' });
    }

    db.query(
        "SELECT * FROM blogs WHERE blog_id = $1",
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.render('pages/error', { message: 'Database error' });
            }

            if (result.rowCount === 0) {
                return res.status(404).render('pages/error', { message: 'Post to edit not found' });
            }

            const dbPost = result.rows[0];

            if (dbPost.creator_user_id !== user_id.trim()) {
                return res.status(403).render('pages/error', { message: "You are not authorized to edit this post." });
            }

            const post = {
                id: dbPost.blog_id,
                title: dbPost.title,
                content: dbPost.body,
                category: dbPost.category
            };

            res.render('pages/edit', { ...post, user_id: user_id.trim() });
        }
    );
});

// Delete post confirmation page
app.get('/delete', (req, res) => {
    const {id, user_id} = req.query || {};

    if (!id || !user_id) {
        return res.render('pages/error', { message: 'An error ocurrred loading this page' });
    }

    db.query(
        "SELECT * FROM blogs WHERE blog_id = $1",
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.render('pages/error', { message: 'Database error' });
            }

            if (result.rowCount === 0) {
                return res.status(404).render('pages/error', { message: 'Post to delete not found' });
            }

            const dbPost = result.rows[0];

            if (dbPost.creator_user_id !== user_id.trim()) {
                return res.status(403).render('pages/error', { message: "You are not authorized to delete this post." });
            }

            const values = {
                id: dbPost.blog_id,
                title: dbPost.title,
                content: dbPost.body,
                author: dbPost.creator_name,
                user_id: user_id
            };

            res.render('pages/delete', values);
        }
    );
});

// Sign up page
app.get('/signup', (req, res) => {
    res.render('pages/signup');
});

// Login page
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// Create post logic
app.post('/create', async (req, res) => {
    const { title, content, category, user_id } = req.body;

    if (!user_id) {
        return res.status(400).send({ message: "You must be signed in to create a post." });
    }

    if (!title || !content || !category) {
        return res.status(400).send({ message: "All values must be provided to create a post." });
    }

    try {
        const getName = await db.query(
            'SELECT name FROM users WHERE user_id = $1',
            [user_id.trim()]
        );

        if (getName.rowCount === 0) {
            return res.status(400).send({ message: "Invalid user signed in to create post. Sign in again." });
        }

        const username = getName.rows[0].name;

        await db.query(
            'INSERT INTO blogs(creator_name, creator_user_id, title, body, date_created, category) VALUES ($1, $2, $3, $4, NOW(), $5)',
            [username, user_id.trim(), title, content, category]
        );

        res.status(200).send({ message: 'Post created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Database error' });
    }
});

// Edit post logic
app.post('/edit', (req, res) => {
    const { id, title, content, category, user_id } = req.body || {};

    if (!id || !title || !content || !category) {
        return res.status(400).send({ message: "All values must be provided to edit a post" });
    }

    db.query(
        "UPDATE blogs SET title = $1, body = $2, category = $3 WHERE blog_id = $4",
        [title, content, category, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: "Database error" });
            }

            res.status(200).send({ message: "Post updated successfully" });
        }
    );
});

// Delete post logic
app.post('/delete', (req, res) => {
    const { id, user_id } = req.body || {};

    if (!id || !user_id) {
        return res.status(400).send({ message: "A post ID must be provided to delete a post." });
    }

    db.query(
        "DELETE FROM blogs WHERE blog_id = $1",
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: "Database error" });
            }

            res.status(200).send({ message: "Post deleted successfully" });
        }
    );
});

// Sign up Logic
app.post('/signup', async (req, res) => {
    try {
        const { username, password, confirm_password, name } = req.body || {};

        if (!username || !password || !confirm_password || !name) {
            return res.status(400).send({ error: 'All values must be provided' });
        }

        if (password.trim() !== confirm_password.trim()) {
            return res.status(400).send({ error: 'Confirm password must match' });
        }

        // Check if user exists
        const check = await db.query(
            'SELECT 1 FROM public.users WHERE user_id = $1',
            [username.trim()]
        );

        if (check.rowCount > 0) {
            return res.status(400).send({ error: 'Username already taken' });
        }

        // If user does not exist, insert new user
        await db.query(
            'INSERT INTO public.users (user_id, password, name) VALUES ($1, $2, $3)',
            [username.trim(), password.trim(), name.trim()]
        );

        return res.status(200).send({ message: 'User created successfully', user_id: username.trim() });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Database error' });
    }
});

// Log In logic
app.post('/login', (req, res) => {
    const {username, password} = req.body || {};

    if (!username || !password) {
        return res.status(400).send({ error: 'All values must be provided' });
    }

    db.query(
        "SELECT * FROM users WHERE user_id = $1 AND password = $2", 
        [username.trim(), password.trim()],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Database error' });
            }

            if (result.rowCount === 0) {
                return res.status(400).send({ error: 'Incorrect username or password' });
            }

            res.status(200).send({ message: 'Login successful', user_id: username.trim() });
        }
    );
});

// Start app
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});