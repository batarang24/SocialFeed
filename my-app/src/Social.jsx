// frontend/src/Components/Social.js
import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Card, CardContent, CardActions, IconButton, Box, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

function Social() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [userName, setUserName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Fetch posts from the backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  const handleLike = (postId) => {
    fetch(`http://localhost:5000/api/posts/${postId}/like`, {
      method: 'PUT',
    })
      .then(response => response.json())
      .then(updatedPost => {
        setPosts(posts.map(post => post.id === postId ? updatedPost : post));
      });
  };

  const handleNewPost = () => {
    if (newPostContent.trim() === "" || userName.trim() === "") {
      alert("Both username and post content are required!");
      return;
    }

    fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, content: newPostContent })
    })
      .then(response => response.json())
      .then(newPost => {
        setPosts([...posts, newPost]);
        setNewPostContent("");
      });
  };

  const handleAddComment = (postId) => {
    if (newComment.trim() === "") {
      alert("Comment cannot be empty!");
      return;
    }

    fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: newComment })
    })
      .then(response => response.json())
      .then(updatedPost => {
        setPosts(posts.map(post => post.id === postId ? updatedPost : post));
        setNewComment("");
      });
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#4CAF50' }}>
        Social Feed
      </Typography>

      <TextField
        label="Enter your username"
        variant="outlined"
        fullWidth
        value={userName}
        onChange={e => setUserName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <TextField
        label="Write a new post"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={newPostContent}
        onChange={e => setNewPostContent(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleNewPost}
        sx={{
          width: '100%',
          backgroundColor: '#3f51b5',
          '&:hover': {
            backgroundColor: '#303f9f',
          },
          marginBottom: 3,
        }}
      >
        Post
      </Button>

      {posts.map(post => (
        <Card key={post.id} sx={{ marginTop: 3, borderRadius: 2, border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
          <CardContent sx={{ padding: 3 }}>
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              {post.userName}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2, color: '#555' }}>
              {post.content}
            </Typography>
          </CardContent>
          <CardActions sx={{ paddingLeft: 3 }}>
            <Typography variant="body2" sx={{ marginRight: 1, color: '#888' }}>
              Likes: {post.likes}
            </Typography>
            <IconButton color="primary" onClick={() => handleLike(post.id)}>
              <ThumbUpIcon />
            </IconButton>

            <IconButton color="secondary" onClick={() => setSelectedPostId(post.id)} sx={{ marginLeft: 2 }}>
              <CommentIcon />
            </IconButton>
          </CardActions>

          {selectedPostId === post.id && (
            <Box sx={{ paddingLeft: 3, paddingBottom: 2, marginTop: 2 }}>
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                sx={{ marginBottom: 1 }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleAddComment(post.id)}
                sx={{ marginTop: 1 }}
              >
                Add Comment
              </Button>
            </Box>
          )}

          <Divider sx={{ margin: '20px 0' }} />
          <Box sx={{ paddingLeft: 3, paddingBottom: 2 }}>
            <Typography variant="h6">Comments:</Typography>
            {post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <Typography key={index} variant="body2" sx={{ color: '#777', marginTop: 1 }}>
                  - {comment}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#aaa', marginTop: 1 }}>
                No comments yet.
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export default Social;
