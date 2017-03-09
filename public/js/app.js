'use strict';

/* global google: true */

$(function () {
  console.log('JSTING');

  var tripPlan = $('.tripPlan').data('place');

  var $input = $('.autocomplete');
  var autocomplete = new google.maps.places.Autocomplete($input[0]);
  var $lat = $('input[name=lat]');
  var $lng = $('input[name=lng]');

  autocomplete.addListener('place_changed', function () {
    var place = autocomplete.getPlace();
    var location = place.geometry.location.toJSON();
    $lat.val(location.lat);
    $lng.val(location.lng);
  });

  // console.log('Small Map');
  // console.log(minimap);
  // console.log(minimap.name + ' ' + minimap.postCode);
  // console.log('Journey planner');
  // console.log(tripPlan);
  // console.log(tripPlan.name + ' ' + tripPlan.postCode);

  //--------------Show page map display ---------------------------------------- //

  // function makeMap() {
  //   var address = minimap.postCode;
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


  var directionsDisplay = null;
  var directionsService = new google.maps.DirectionsService();

  function initialize() {
    var address = tripPlan.postCode;
    var geocoder = new google.maps.Geocoder();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var myOptions = {
          zoom: 14,
          center: results[0].geometry.location,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          scrollwheel: false
        };
        var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
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
    var address = tripPlan.postCode;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
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
          directionsService.route(request, function (response, status) {
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

  function getWeather() {
    $('ul#info').empty();
    $.get('http://api.wunderground.com/api/e32e9863eea8648e/conditions/geolookup/q/' + tripPlan.lat + ',' + tripPlan.lng + '.json').done(function (data) {
      $('ul#info').prepend('\n        <li> Current temperature - <em>' + data.current_observation.temp_c + '&deg;C</em></li>\n        <li> Real feel           - <em>' + data.current_observation.feelslike_c + '&deg;C</em></li>\n        <li> Current weather     - <em>' + data.current_observation.weather + '</em></li>\n        <li> Visibility          - <em>' + data.current_observation.visibility_mi + ' Miles</em></li>\n        <li> Windspeed           - <em>' + data.current_observation.wind_mph + ' Mph</em></li>\n        <li> For more weather info - <a href ="' + data.current_observation.forecast_url + '">Click Here!!</a></li>\n      ');
    });
  }

  $(document).ready(function () {
    if (window.location.href.indexOf('tripPlanner') > -1) {
      initialize();
      getWeather();
    }
  });

  // $.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${tripPlan.lat},${tripPlan.lng}&radius=2000&type=hotel&key=AIzaSyAqunPN56wSjv3kna8IT0805pIX3f4fB3c.json`)
  //   .done((data) => console.log(data));

  // $.get(`http://api.wunderground.com/api/e32e9863eea8648e/conditions/geolookup/q/${tripPlan.lat},${tripPlan.lng}.json`)
  //   // .done((data) => console.log(data));
  //   // .done((data) => console.log(data.current_observation));
  //   // .done((data) => console.log(data.current_observation.temp_c))
  //   .done((data) => console.log(data.current_observation.forecast_url));

  $('#routeForm').on('submit', calcRoute);
});