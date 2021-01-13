const express = require('express');
const app = express();
const helmet = require('helmet')
const mongoose = require('mongoose')
const questionsController = require('./controllers/questionsController')
const testsController = require('./controllers/testsController')
const organizationController = require('./controllers/organizationController')


app.use(express.json());
app.use(helmet())
mongoose.connect('mongodb://localhost/testsdb', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected.'))
    .catch(() => console.log('MongoDB Failed to connect.'))

    
app.use('/api/questions', questionsController);
app.use('/api/tests', testsController);
app.use('/api/organizations', organizationController);

app.listen(5000, () => console.log('Server is running'));