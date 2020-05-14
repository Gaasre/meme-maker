import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import {join} from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Setup mongoose Connection
const mongoDB = 'mongodb://localhost:27017/mememaker';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Setup mongoose models
const Schema = mongoose.Schema;
const TemplateSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true }
});
const Template = mongoose.model('Template', TemplateSchema, 'template');

// Express server
const app = express();


const PORT = 1234;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Example Express Rest API endpoints
app.get('/api/memes', (req, res) => {
  Template.find({}, (err, doc) => {
      if (err) {
          res.send(err);
      }
      res.json(doc);
  });
});
app.post('/api/memes', (req, res) => {
    const memes = req.body;
    console.log(memes);
    Template.collection.insert(memes, (err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.json({success: true});
        }
      });
});

// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
