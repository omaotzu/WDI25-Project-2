/* global google: true */
$(function () {
  console.log('JSTING');


  const place = $('.map').data('place');
  // console.log(place);
  // console.log(place.name + ' ' + place.postCode);

  // $('.find').on('click', addAddress);

//--------------Show page map display ---------------------------------------- //
  //
  // function makeMap() {
  //   var address = place.postCode;
  //   var geocoder = new google.maps.Geocoder();
  //   geocoder.geocode({ 'address': address}, function(results, status) {
  //     if (status === google.maps.GeocoderStatus.OK) {
  //       var myOptions = {
  //         zoom: 10,
  //         center: results[0].geometry.location,
  //         scrollwheel: false
  //       };
  //       var map = new google.maps.Map(document.getElementById('map'), myOptions);
  //       new google.maps.Marker({
  //         map: map,
  //         position: results[0].geometry.location
  //       });
  //       console.log(results[0].geometry.location);
  //     }
  //   });
  // }
  // makeMap();

//----------------------Route planner ---------------------------------------------//

  let directionsDisplay = null;
  var directionsService = new google.maps.DirectionsService();

  function initialize() {
    var address = place.postCode;
    var geocoder = new google.maps.Geocoder();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder.geocode({ 'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var myOptions = {
          zoom: 14,
          center: results[0].geometry.location,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          scrollwheel: false
        };
        var map = new google.maps.Map(document.getElementById('map_canvas'),myOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'));
        new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: 'My location'
        });
      }
    });
  }

  function calcRoute(e) {
    e.preventDefault();
    var address = place.postCode;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          var start = pos;
          var end = results[0].geometry.location;
          var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };
          directionsService.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
            }
          });
        });
      }
    });
  }

    //   , function () {
    //     handleLocationError(true,  map.getCenter());
    //   });
    // } else {
    //   // Browser doesn't support Geolocation
    //   handleLocationError(false, map.getCenter());
    // }
    // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //   currentLocationWindow.setPosition(pos);
    //   currentLocationWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');

  initialize();
  $('#routeForm').on('submit', calcRoute);

});
