const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Import the MySQL connection
console.log(db)
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Route to fetch all posts
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT posts.*, users.username 
       FROM posts 
       JOIN users ON posts.user_id = users.id 
       ORDER BY posts.id DESC`
    );
    res.json(rows); // Send the posts with username to the client
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching posts.');
  }
});

// Route to add a new post
app.post('/api/posts', async (req, res) => {
  const { userName, content } = req.body;

  if (!userName || !content) {
    return res.status(400).send('Username and content are required.');
  }

  try {
    // Check if the user already exists and get the user ID
    const [userResult] = await db.query(
      'SELECT id FROM users WHERE username = ?',
      [userName]
    );

    let userId;
    if (userResult.length === 0) {
      // If the user doesn't exist, insert a new user
      const [newUserResult] = await db.query(
        'INSERT INTO users (username) VALUES (?)',
        [userName]
      );
      userId = newUserResult.insertId; // Get the new user's ID
    } else {
      userId = userResult[0].id; // Get the existing user's ID
    }

    // Insert the new post with the userId
    const [result] = await db.query(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [userId, content]
    );

    const newPostId = result.insertId; // Get the new post's ID

    // Fetch the newly created post to return it
    const [newPost] = await db.query(
      `SELECT posts.*, users.username
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = ?`,
      [newPostId]
    );

    res.json(newPost[0]); // Return the newly created post
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding post.');
  }
});


// Route to like a post
app.post('/api/posts/:postId/like', async (req, res) => {
  const postId = req.params.postId;
  try {
    // Increment the likes for the given post
    await db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);
    res.status(200).send('Post liked successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error liking post.');
  }
});

// Route to add a comment to a post
app.post('/api/posts/:postId/comment', async (req, res) => {
  const postId = req.params.postId;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).send('Comment cannot be empty.');
  }

  try {
    // Insert the comment into the comments table
    await db.query('INSERT INTO comments (post_id, comment) VALUES (?, ?)', [postId, comment]);

    res.status(200).send('Comment added successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding comment.');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running ');
});
