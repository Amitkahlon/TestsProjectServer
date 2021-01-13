const express = require('express');
const app = express();
const helmet = require('helmet')
const mongoose = require('mongoose')
const questions = require('./controllers/questionsController')
const testsController = require('./controllers/testsController')


app.use(express.json());
app.use(helmet())
mongoose.connect('mongodb://localhost/testsdb', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected.'))
    .catch(() => console.log('MongoDB Failed to connect.'))

    
app.use('/questionsController', questions);
app.use('/testsController', testsController);

app.listen(5000, () => console.log('Server is running'));