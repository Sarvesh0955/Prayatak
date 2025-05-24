import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URI || "http://localhost:8080";

function UserComments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  // Function to delete a comment
  const deleteComment = async (comment) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Comment?");
    if (confirmDelete) {
    try {
      const url = `${API_URL}/blog/${comment.parent_blog._id}/comment/${comment._id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure this is required for your session
      });

      if (response.ok) {
        // Remove the deleted comment from the state
        setComments((prevComments) =>
          prevComments.filter((c) => c._id !== comment._id)
        );
        alert('Comment deleted successfully');
      } else {
        const error = await response.json();
        console.error('Error deleting comment:', error.error);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }
  else{
    alert('deletion failed');
  }
  };

  // Function to fetch comments
  const getComment = async () => {
    try {
      const url = `${API_URL}/profile/${id}/comments`;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const json = await response.json();
        setComments(json);
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch comments when the component mounts
  useEffect(() => {
    if (id) {
      getComment();
    }
  }, [id]);

  return (
    <div className="comments-body">
      <Helmet>
                <title>Prayatak - Comments</title>
            </Helmet>
      <div className="comments-page">
        <h1 className="page-title">Your Comment History</h1>
        <p className="page-subtitle">See your thoughts on our adventures!</p>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <img
                src={comment.parent_blog.image}
                alt="Blog"
                className="blog-image"
              />
              <div className="comment-details">
                <h2 className="blog-heading">{comment.parent_blog.title}</h2>
                <p className="user-comment">{comment.body}</p>
              </div>
              <div className="comment-actions">
                <button
                  className="delete-btn"
                  onClick={() => deleteComment(comment)} // Pass comment as an argument
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No comments to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserComments;
