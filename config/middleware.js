var api         = require('./helpers');

module.exports = function (app, express) {
  var apiRouter = express.Router();

  app.use('/api', apiRouter);

  require('./helpers.js')(apiRouter);

};

