const express = require('express');
const { format } = require('date-fns');

// Constants
const posts = [];
const PORT = 3000;

// Initialize express
const app = express();

// Initialize EJS
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/edit', (req, res) => {
    res.render('pages/edit');
});

app.post('/create', (req, res) => {
    const { author, title, content } = req.body;

    if (author && title && content) {
        const newPost = {
            author,
            title,
            content,
            timestamp: format(new Date(), 'MMMM d, yyyy hh:mm a')
        };
        posts.push(newPost);
        res.redirect('/');
    } else {
        res.status(400).send('All fields are required.');
    }
});

// Start app
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});