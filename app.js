const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const cors = require('cors')

const clientRoutes = require('./routes/clientRoutes');
const stylistRoutes = require('./routes/stylistRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const emailRoutes = require('./routes/emailRoutes');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./util/errorHandler/appError');
const errorController = require('./util/errorHandler/errorController');

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

app.use(cors({credentials: true, origin: true}));

app.use('/api/v1/clients', clientRoutes)
app.use('/api/v1/stylists', stylistRoutes)
app.use('/api/v1/reservation', reservationRoutes)
app.use('/api/v1/sendEmail', emailRoutes)
app.use('/api/v1/user', userRoutes)

//When route does not match any API endpoint, it captures here
app.all('*', (req, res, next) => {
    throw new AppError(`Requested URL ${req.path} not found!`, 404);
  })

//Global Error Handler Middleware
app.use(errorController)