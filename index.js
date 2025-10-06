const express = require('express');
const pg = require('pg');
const { format } = require('date-fns');

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

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes

// Main page
app.get('/', (req, res) => {
    db.query('SELECT * FROM blogs', (err, result) => {
        if (err) {
            console.error(err);
            return res.render('pages/error', { message: 'Database error' });
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

        if (req.query && req.query.filter) {
            const filteredPosts = dbPosts.filter(post => post.category === req.query.filter);
            return res.render('index', { posts: filteredPosts, filter: req.query.filter, user_id: req.query.user_id });
        }

        res.render('index', { posts: dbPosts, user_id: req.query.user_id });
    });
});

// Edit post form
app.get('/edit', (req, res) => {
    const post = posts.find(post => post.id === parseInt(req.query.id));

    if (!post) {
        return res.status(404).render('pages/error', { message: 'Post to edit not found' });
    }

    res.render('pages/edit', post);
});

// Delete post confirmation page
app.get('/delete', (req, res) => {
    const post = posts.find(post => post.id === parseInt(req.query.id));

    if (!post) {
        return res.status(404).render('pages/error', { message: 'Post to delete not found' });
    }

    res.render('pages/delete', post);
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
        return res.render('pages/error', { message: "You must be signed in to create a post." });
    }

    if (!title || !content || !category) {
        return res.render('pages/error', { message: "All values must be provided to create a post." });
    }

    try {
        const getName = await db.query(
            'SELECT name FROM users WHERE user_id = $1',
            [user_id.trim()]
        );

        if (getName.rowCount === 0) {
            return res.render('pages/error', { message: "Invalid user signed in to create post. Sign in again." });
        }

        const username = getName.rows[0].name;

        await db.query(
            'INSERT INTO blogs(creator_name, creator_user_id, title, body, date_created, category) VALUES ($1, $2, $3, $4, NOW(), $5)',
            [username, user_id.trim(), title, content, category]
        );

        res.redirect(`/?user_id=${user_id.trim()}`);
    } catch (err) {
        console.error(err);
        res.render('pages/error', { message: 'Database error' });
    }
});

// Edit post logic
app.post('/edit', (req, res) => {
    const { id, author, title, content, category } = req.body;
    const postIndex = posts.findIndex(post => post.id === parseInt(id));
    posts[postIndex] = { ...posts[postIndex], author, title, content, category };
    res.redirect('/');
});

// Delete post logic
app.post('/delete', (req, res) => {
    posts = posts.filter(post => post.id !== parseInt(req.body.id));
    res.redirect('/');
});

// Sign up Logic
app.post('/signup', async (req, res) => {
    try {
        const { username, password, confirm_password, name } = req.body || {};

        if (!username || !password || !confirm_password || !name) {
            return res.render('pages/signup', { error: 'All values must be provided' });
        }

        if (password.trim() !== confirm_password.trim()) {
            return res.render('pages/signup', { error: 'Confirm password must match' });
        }

        // Check if user exists
        const check = await db.query(
            'SELECT 1 FROM public.users WHERE user_id = $1',
            [username.trim()]
        );

        if (check.rowCount > 0) {
            return res.render('pages/signup', { error: 'Username already taken' });
        }

        // If user does not exist, insert new user
        await db.query(
            'INSERT INTO public.users (user_id, password, name) VALUES ($1, $2, $3)',
            [username.trim(), password.trim(), name.trim()]
        );

        return res.redirect('/login');
    } catch (err) {
        console.error(err);
        return res.render('pages/error', { message: 'Database error' });
    }
});

// Log In logic
app.post('/login', (req, res) => {
    const {username, password} = req.body || {};

    if (!username || !password) {
        return res.render('pages/login', { error: 'All values must be provided' });
    }

    db.query(
        "SELECT * FROM users WHERE user_id = $1 AND password = $2", 
        [username.trim(), password.trim()],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.render('pages/error', { message: 'Database error' });
            }

            if (result.rowCount === 0) {
                return res.render('pages/login', { error: 'Incorrect username or password' });
            }

            res.redirect(`/?user_id=${username.trim()}`);
        }
    );
});

// Start app
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});