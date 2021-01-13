const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');

const questionsRoute = require('./routes/questionsRoute')
const testsRoute = require('./routes/testsRoute')
const organizationRoute = require('./routes/organizationRoute')

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))


app.use(express.json());
app.use(helmet())
mongoose.connect('mongodb://localhost/testsdb', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected.'))
    .catch(() => console.log('MongoDB Failed to connect.'))

    
app.use('/api/questions', questionsRoute);
app.use('/api/tests', testsRoute);
app.use('/api/organizations', organizationRoute);

app.listen(5000, () => console.log('Server is running'));