const express = require('express');
const router = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to Lambda blogs',
  });
});

app.use('/api/posts', router);

app.all('*', (req, res) => {
  res.status(404).send({
    status: 404,
    message: 'The resource you are looking for does not exist',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
