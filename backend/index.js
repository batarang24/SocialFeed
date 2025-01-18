
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors()); 
app.use(bodyParser.json()); 

let posts = [];


app.post('/api/posts', (req, res) => {
  const { userName, content } = req.body;
  if (!userName || !content) {
    return res.status(400).json({ message: "Username and content are required." });
  }
  
  const newPost = {
    id: posts.length + 1,
    userName,
    content,
    likes: 0,
    comments: [],
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

// GET: Retrieve all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// PUT: Like a post
app.put('/api/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }
  
  post.likes += 1;
  res.json(post);
});

// POST: Add a comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const { comment } = req.body;
  
  if (!comment) {
    return res.status(400).json({ message: "Comment cannot be empty." });
  }
  
  const post = posts.find(post => post.id === postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }
  
  post.comments.push(comment);
  res.status(201).json(post);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
