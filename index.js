const express = require('express');
const app = express();
const helmet = require('helmet')
const mongoose = require('mongoose')
const questions = require('./routes/questions')
const tests = require('./routes/tests')
const organizations = require('./routes/organizations')
const users = require('./routes/users')
const login = require('./routes/login')

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(helmet())
mongoose.connect('mongodb://localhost/testsdb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('MongoDB Connected.'))
    .catch(() => console.log('MongoDB Failed to connect.'))

    
app.use('/api/questions', questions);
app.use('/api/tests', tests);
app.use('/api/organizations', organizations);
app.use('/api/users', users);
app.use('/api/login', login);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));