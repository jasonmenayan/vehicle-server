var api = require('request-promise');

var options = {
  url: 'http://interview.carlypso.com',
  headers: {
    'User-Agent': 'vehicle-server'
  },
  transform: function(body, response) {  
    return JSON.parse(body);
  }
};

module.exports = function (app) {

  var fleetSize = 0;
  var collectedRecords = 0;
  var fleet = [];

  var getFleetSize = function() {
    options.url = 'http://interview.carlypso.com/count';
    return api(options);
  };

  var addCarChunk = function(obj, callback) {
    fleet = fleet.concat(obj.value);
    collectedRecords += obj.value.length;
    console.log('Collected records: ', collectedRecords);
    callback();
  };

  // endpoint for populating fleet array in memory
  app.get('/populatefleet', function(req, res, next) {

    var addFleet = function() {
      options.url = 'http://interview.carlypso.com/listings?offset=' + collectedRecords + '&limit=10000';
      api(options)
        .then(function(response) {
          addCarChunk(response, function() {
            if (collectedRecords >= fleetSize) { 
              console.log('Entire fleet stored in memory.');
              res.json({ message: 'Entire fleet stored in memory. API ready.' });
              return; 
            }
            addFleet();
          });   
        })
        .catch(console.error);
      };

    getFleetSize()
    .then(function(response) {
      fleetSize = response.value;
      console.log('Fleet size: ', fleetSize);  
      addFleet();
    }); 
    
  });


  app.get('/sortedmatches', function(req, res, next) {
    var sort1 = req.query.sort1;
    var sort2 = req.query.sort2 || null;
    var sort3 = req.query.sort3 || null;
    var sortfxn;

    if (!sort3 && !sort2) {
      sortfxn = sortit1;
    } else if (!sort3) {
      sortfxn = sortit2;
    } else {
      sortfxn = sortit3;
    }

    function sortit1(a,b) {
      if (a[sort1] < b[sort1]) {
        return -1;
      }
      if (a[sort1] > b[sort1]) {
        return 1;
      }
      return 0;
    }

    function sortit2(a,b) {
      if (a[sort1] < b[sort1]) {
        return -1;
      }
      if (a[sort1] > b[sort1]) {
        return 1;
      }
      if (a[sort2] < b[sort2]) {
        return -1;
      }
      if (a[sort2] > b[sort2]) {
        return 1;
      }
      return 0;
    }

    function sortit3(a,b) {
      if (a[sort1] < b[sort1]) {
        return -1;
      }
      if (a[sort1] > b[sort1]) {
        return 1;
      }
      if (a[sort2] < b[sort2]) {
        return -1;
      }
      if (a[sort2] > b[sort2]) {
        return 1;
      }
      if (a[sort3] < b[sort3]) {
        return -1;
      }
      if (a[sort3] > b[sort3]) {
        return 1;
      }
      return 0;
    }

    var sorted = fleet.sort(sortfxn);
    res.json(sorted);

  });

  app.get('/pricerange', function(req, res, next) {
    var lowerLimit = req.query.lower;
    var upperLimit = req.query.upper;
    if (!lowerLimit || !upperLimit) {
      res.json({ message: 'Please specify both lower and upper limits in your query.' });
    }

    var range = [];

    for (var i=0; i < fleet.length; i++) {
      if ((fleet[i].price >= lowerLimit) && (fleet[i].price <= upperLimit)) {
        range.push(fleet[i]);
      }
    }

    res.json(range);

  });

};
