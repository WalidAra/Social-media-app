document.addEventListener('DOMContentLoaded', () => {
    const addPostForm = document.getElementById('addPostForm');
    const postForm = document.getElementById('postForm');
    const postList = document.getElementById('postList');
    const commentsSection = document.getElementById('commentsSection');
    const commentList = document.getElementById('commentList');
    const addCommentForm = document.getElementById('addCommentForm');
    const commentForm = document.getElementById('commentForm');

    const fetchPosts = () => {
        fetch('/api/allPosts')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const posts = data.postList;
                const postList = document.getElementById('postList');
                postList.innerHTML = ''; // Clear previous posts
    
                posts.forEach((post) => {
                    // Create a new list item for each post and add it to the list
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <img src="${post.img}" alt="${post.title}">
                        <h3>${post.title}</h3>
                        <p>${post.description}</p>
                    `;
                    postList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    };
    
    // Call the fetchPosts function to load posts when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        fetchPosts();
    });
    

    // Show/hide the "Add New Post" form
    addPostForm.addEventListener('click', () => {
        postForm.style.display = 'block';
    });

    // Handle form submission for adding a new post
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const img = document.getElementById('imgUrl').value;
        const title = document.getElementById('postTitle').value;
        const description = document.getElementById('postDescription').value;

        fetch('/api/addPosts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ img, title, description }),
        })
            .then(() => {
                fetchPosts(); // Refresh the post list
                postForm.style.display = 'none'; // Hide the form
            });
    });

    // Handle "View Comments" links
    postList.addEventListener('click', (e) => {
        if (e.target.classList.contains('viewComments')) {
            const postId = e.target.getAttribute('data-id');
            fetch(`/filter/${postId}`)
                .then((response) => response.json())
                .then((data) => {
                    const comments = data.cmntList;
                    commentList.innerHTML = ''; // Clear previous comments
                    comments.forEach((comment) => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = comment.cmnt;
                        commentList.appendChild(listItem);
                    });
                    commentsSection.style.display = 'block'; // Show the comments section
                    addCommentForm.style.display = 'block'; // Show the add comment form
                });
        }
    });


    // Handle form submission for adding a new comment
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const comment = document.getElementById('commentText').value;
        const postId = /* Get the current post ID */

        fetch(`/comment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment }),
        })
            .then(() => {
                // Clear the comment text area after submission
                document.getElementById('commentText').value = '';
                // Refresh the comments list after adding a comment
                // You may need to fetch comments again for the current post.
            });
    });

    // Initial fetch of posts
    fetchPosts();
});

