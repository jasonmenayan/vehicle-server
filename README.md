# vehicle-server

To populate local memory with fleet, please first hit:

127.0.0.1:8080/api/populatefleet

Message will show up in console and response when population is complete.

API:

127.0.0.1:8080/api/sortedmatches?sort1=FIRSTPARAMETER&sort2=SECONDPARAMETER&sort3=THIRDPARAMETER

* Only sort1 is required. sort2 and sort3 will resolve any ties.

127.0.0.1:8080/api/pricerange?lower=LOWERLIMIT&upper=UPPERLIMIT

* Both ends of the range must be passed in as parameters.


