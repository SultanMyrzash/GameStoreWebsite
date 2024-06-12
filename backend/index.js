const express = require('express');
const db = require('./dbConfig');

const app = express();


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/Routes'));


app.listen(8000, () => console.log('Server started on port 8000'));