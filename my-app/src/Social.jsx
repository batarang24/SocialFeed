import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Card, CardContent, CardActions, IconButton, Box, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

function Social() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [userName, setUserName] = useState(""); // New state for username
  const [newComment, setNewComment] = useState(""); // New state for comment input
  const [selectedPostId, setSelectedPostId] = useState(null); // Track the post for adding comments

  // Fetch posts from the backend
  useEffect(() => {
    axios.get('https://socialfeed-9l2w.onrender.com/api/posts')
      .then(response => {
        // Ensure that each post has a 'comments' field initialized to an empty array if undefined
        const updatedPosts = response.data.map(post => ({
          ...post,
          comments: post.comments || [], // Ensure comments is an array, even if undefined
        }));
        setPosts(updatedPosts);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handleLike = (postId) => {
    axios.post(`https://socialfeed-9l2w.onrender.com/api/posts/${postId}/like`)
      .then(response => {
        setPosts(posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
      })
      .catch(error => {
        console.error('Error liking post:', error);
      });
  };

  const handleNewPost = () => {
    if (newPostContent.trim() === "" || userName.trim() === "") {
      alert("Both username and post content are required!");
      return;
    }
  
    const newPost = { userName, content: newPostContent };
  
    axios.post('https://socialfeed-9l2w.onrender.com/api/posts', newPost)
      .then(response => {
        // Add the new post to the state (instead of just adding it to the array)
        setPosts(prevPosts => [response.data, ...prevPosts]);  // Prepend the new post to the list
        setNewPostContent(""); // Clear input after posting
      })
      .catch(error => {
        console.error('Error creating post:', error);
      });
  };
  
  const handleAddComment = (postId) => {
    if (newComment.trim() === "") {
      alert("Comment cannot be empty!");
      return;
    }

    axios.post(`https://socialfeed-9l2w.onrender.com/api/posts/${postId}/comment`, { comment: newComment })
      .then(response => {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, comments: [...post.comments, newComment] };
          }
          return post;
        }));
        setNewComment(""); // Clear comment input after adding
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };

  const handleOpenCommentBox = (postId) => {
    setSelectedPostId(postId); // Set the post ID to track which post the comment belongs to
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#4CAF50' }}>
        Social Feed
      </Typography>

      {/* Input for username */}
      <TextField
        label="Enter your username"
        variant="outlined"
        fullWidth
        value={userName}
        onChange={e => setUserName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Input for post content */}
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
              {console.log(post)}
              {post.username}
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

            {/* Comment Icon */}
            <IconButton color="secondary" onClick={() => handleOpenCommentBox(post.id)} sx={{ marginLeft: 2 }}>
              <CommentIcon />
            </IconButton>
          </CardActions>

          {/* Comments section */}
          <Divider sx={{ margin: '20px 0' }} />
          <Box sx={{ paddingLeft: 3, paddingBottom: 2 }}>
            <Typography variant="h6">Comments:</Typography>
            {post.comments && post.comments.length > 0 ? (
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

          {/* Comment input field */}
          {selectedPostId === post.id && (
            <Box sx={{ paddingLeft: 3 }}>
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddComment(post.id)}
                sx={{ width: '100%' }}
              >
                Add Comment
              </Button>
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );
}

export default Social;
