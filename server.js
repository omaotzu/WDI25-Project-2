//require our packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { port, env, dbURI, sessionSecret} = require('./config/environment');
const errorHandler = require('./lib/errorHandler');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const authentication = require('./lib/authentication');


//create an express app
const app = express();

//set up our template engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

//set up our static files folder
app.use(express.static(`${__dirname}/public`));

//connect to our database
mongoose.connect(dbURI);

//set up our middleware
if (env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride((req) => {
  if(req.body &&typeof req.body === 'object'  && '_method' in req.body) {
    const method= req.body._method;
    delete req.body._method;
    return method;
  }
}));

//set up our sessions
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

//set up flash messages after our sessions -- requires a session to work
app.use(flash());


//custom middleware = we require flash messages in custom responses and authentication so must come after flash but always before routes
app.use(customResponses);
app.use(authentication);

//link our routes file after flash and sessions but before error handler
app.use(routes);

//set up our error handler - always the last piece of middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Express is listening to port ${port}`));
