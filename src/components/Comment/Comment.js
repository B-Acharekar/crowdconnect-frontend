import React, { useState, useEffect } from 'react';

const Comment = ({ solutionId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  // Fetch comments for the specific solution
  useEffect(() => {
    fetch(`http://localhost:8080/api/comments/solutions/${solutionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error('Error fetching comments:', error));
  }, [solutionId]);

  // Add a new comment
  const handleAddComment = () => {
    if (!newComment) return; // Ensure the comment is not empty

    fetch(`http://localhost:8080/api/comments/solution/${solutionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then((response) => response.json())
      .then((addedComment) => {
        setComments([...comments, addedComment]);
        setNewComment(''); // Clear the input field
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  // Edit a comment
  const handleEditComment = (commentId) => {
    fetch(`http://localhost:8080/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: editedComment }),
    })
      .then((response) => response.json())
      .then((updatedComment) => {
        setComments(
          comments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
          )
        );
        setEditingCommentId(null);
        setEditedComment('');
      })
      .catch((error) => console.error('Error updating comment:', error));
  };

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:8080/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setComments(comments.filter((comment) => comment.id !== commentId));
      })
      .catch((error) => console.error('Error deleting comment:', error));
  };

  return (
    <div className="comment-section bg-gray-50 p-4 rounded-lg shadow-md">
      <div className="flex mb-1 space-x-4">
        <textarea
          className="w-full h-16 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
          rows="3"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="w-12 h-12  bg-green-500 text-white flex justify-center items-center rounded-full mt-2 hover:scale-105 hover:shadow-lg transform transition-transform duration-300"
          onClick={handleAddComment}
        >
          <ion-icon name="arrow-up-circle" style={{ fontSize: "28px" }}></ion-icon>
        </button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 border-b pb-2">
          {editingCommentId === comment.id ? (
            <>
              <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="2"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2 hover:bg-green-600"
                onClick={() => handleEditComment(comment.id)}
              >
                Save
              </button>
            </>
          ) : (
            <p>{comment.content}</p>
          )}
          <div className="text-sm text-gray-500 mt-1">
            {comment.username}
            {currentUser === comment.username && (
              <>
                <button
                  className="ml-4 text-blue-500 hover:underline"
                  onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditedComment(comment.content);
                  }}
                >
                  Edit
                </button>
                <button
                  className="ml-2 text-red-500 hover:underline"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comment;
