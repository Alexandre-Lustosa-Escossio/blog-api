require('dotenv').config();
const app = require('./api');
const { requestLogin } = require('./controllers/loginController');
const { errorHandler } = require('./middlewares/errorHandler');
const { loginValidator } = require('./middlewares/loginValidator');

// não remova a variável `API_PORT` ou o `listen`
const port = process.env.API_PORT || 3000;

// não remova esse endpoint
app.get('/', (_request, response) => {
  response.send();
});

app.post('/login', loginValidator, requestLogin);

app.use(errorHandler);

app.listen(port, () => console.log('ouvindo porta', port));
