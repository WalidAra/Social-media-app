const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

let postList = fs.readFileSync(path.resolve(__dirname, 'posts.json'), 'utf-8');
postList = JSON.parse(postList);

let cmntList = fs.readFileSync(path.resolve(__dirname, 'comments.json'), 'utf-8');
cmntList = JSON.parse(cmntList);

app.use(express.json()); 
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'client')));

// create a new Post
app.post('/api/addPosts', async(req, res) => {
// Inside your '/api/addPosts' route
try {
  const { img, title, description } = req.body;
  
  const id = postList.length + 1;
  const newPost = {
    id,
    img,
    title,
    description,
  };

  postList.push(newPost);
  fs.writeFileSync(path.resolve(__dirname, 'posts.json'), JSON.stringify(postList));

  return res.status(200).json({
    postList
  })
} catch (error) {
  console.error('Error adding post:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});
// Example server-side code
app.get('/api/allPosts', (req, res) => {
  // Read the list of posts from your data source (e.g., posts.json)
  const posts = postList;
  
  // Send the list of posts to the client
  res.json({ postList: posts });
});

// create a new Comment});

//Delete Post

app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  const index = postList.findIndex(post => post.id == id);
  postList.splice(index, 1);
  return res.redirect('/');
});

//Update Post

app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { img, title, description } = req.body;
  const index = postList.findIndex(post => post.id == id);
  postList[index] = {
      id,
      img,
      title,
      description,
  };
  
  return res.redirect('/');
});

//filter comments by idPosts  
app.post('/filter/:id', (req, res) => {
  const { id } = req.params;
  const index = postList.findIndex(post => post.id == id);

  return res.status(200).json({
    cmntList: cmntList.filter((cmnt) => cmnt.idPost == index)
  })
});

//addcomments
app.post('/comment/:id', (req, res) => {
  const { cmnt } = req.body;
  const id = cmntList.length + 1;
  const idPost = postList.findIndex(post => post.id == id);
  const newCmnt = {
    id,
    idPost,
    cmnt
  };

  cmntList.push(newCmnt);
  fs.writeFileSync(path.resolve(__dirname, 'comments.json'), JSON.stringify(cmntList));

  return res.status(200).json({
    cmntList
  })
});

//delete comments
app.post('/delt/:id', (req, res) => {
    const { id } = req.params;
    const index = cmntList.findIndex(cmnt => cmnt.id == id);
    cmntList.splice(index, 1);
    return res.status(200).json({
        cmntList
      })
  });



// 404 page not found
// app.use('*', (req, res) => {
//     return res.redirect('/');
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});