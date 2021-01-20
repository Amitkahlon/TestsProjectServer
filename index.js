const express = require('express');
const app = express();
const helmet = require('helmet')
const mongoose = require('mongoose')
const questions = require('./routes/questions')
const tests = require('./routes/tests')
const organizations = require('./routes/organizations')
const users = require('./routes/users')
const login = require('./routes/login')
const fields = require('./routes/fields')
const cors = require('cors')
const corsOptions = require('./options/corsOptions')


const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(helmet())
app.use(cors(corsOptions))

mongoose.connect(`mongodb://${process.env.HOST}/${process.env.DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('MongoDB Connected.'))
    .catch(() => console.log('MongoDB Failed to connect.'))

    
app.use('/api/questions', questions);
app.use('/api/tests', tests);
app.use('/api/organizations', organizations);
app.use('/api/users', users);
app.use('/api/login', login);
app.use('/api/fields', fields);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));