require('dotenv').config();
const app = require('./api');
const { requestLogin } = require('./controllers/loginController');
const { createUser, getAllUsers, getUser } = require('./controllers/userController');
const { addCategory, getAllCategories } = require('./controllers/categoryController');
const { addPost, getAllPosts, getPost, updatePost } = require('./controllers/postController');
const { errorHandler } = require('./middlewares/errorHandler');
const { loginValidator } = require('./middlewares/loginValidator');
const createUserValidators = require('./middlewares/createUserValidators');
const { validateToken } = require('./middlewares/tokenHandler');
const { nameValidator } = require('./middlewares/nameValidator');
const { createPostValidator, updatePostValidator } = require('./middlewares/postValidators');

// não remova a variável `API_PORT` ou o `listen`
const port = process.env.API_PORT || 3000;

// não remova esse endpoint
app.get('/', (_request, response) => {
  response.send();
});

app.post('/login', loginValidator, requestLogin);

app.get('/user', validateToken, getAllUsers);
app.post('/user', Object.values(createUserValidators), createUser);
app.get('/user/:id', validateToken, getUser);

app.get('/categories', validateToken, getAllCategories);
app.post('/categories', validateToken, nameValidator, addCategory);

app.get('/post', validateToken, getAllPosts);
app.get('/post/:id', validateToken, getPost);
app.post('/post', validateToken, createPostValidator, addPost);
app.put('/post/:id', validateToken, updatePostValidator, updatePost);

app.use(errorHandler);

app.listen(port, () => console.log('ouvindo porta', port));
