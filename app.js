const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const clientRoutes = require('./routes/clientRoutes')

require('dotenv').config()

const app = express();

//Connect to mongodb
const dbURI = process.env.DBURI
const port = process.env.PORT

mongoose.connect(dbURI)
    .then((result) => app.listen(port, () => console.log(`Server running on port: http://localhost:${port}`)))
    .catch((err) => console.log(err));

//Middlewares
app.use(express.static('public'));  
app.use(morgan('dev'));  
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.get('/', (req, res) => {
    res.redirect('/clients');
});

app.use('/clients', clientRoutes)