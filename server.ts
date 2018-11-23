import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as session from "express-session";
const cors = require("cors")
import * as mongoose from "mongoose"
import * as errorHandler from "errorHandler"
import * as morgan from 'morgan'
import routes from "./routes"

;(<any>mongoose).Promise = global.Promise;

//Configure isProduction variable
const isProduction : boolean = process.env.NODE_ENV === 'production';

//Initiate our app
const app : express.Express = express();

//Configure our app
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction) {
  app.use(errorHandler());
}
app.use()

//Configure Mongoose
const url = "mongodb://localhost/dbtaupe";

mongoose.connect(url,{ useNewUrlParser: true });
mongoose.set('debug', true);

//Models & routes
require('./models/Users.js');
require('./config/passport');
app.use(routes);

//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

if(isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });
}

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));