'use strict';

/* global google: true */
$(function () {
  console.log('JSTING');

  var place = $('#map').data('place');
  console.log(place);

  console.log(place.name + ' ' + place.postCode);

  // $('.find').on('click', addAddress);

  //--------------Show page map display ---------------------------------------- //

  function makeMap() {
    var address = place.postCode;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var myOptions = {
          zoom: 10,
          center: results[0].geometry.location,
          scrollwheel: false
        };
        var map = new google.maps.Map(document.getElementById('map'), myOptions);
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        console.log(results[0].geometry.location);
      }
    });
  }
  makeMap();

  //----------------------Route planner ---------------------------------------------//

  // let directionsDisplay = null;
  // var directionsService = new google.maps.DirectionsService();
  //
  // function initialize() {
  //   var latlng = new google.maps.LatLng(51.764696,5.526042);
  //   directionsDisplay = new google.maps.DirectionsRenderer();
  //   var myOptions = {
  //     zoom: 14,
  //     center: latlng,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     mapTypeControl: false,
  //     scrollwheel: false
  //   };
  //   var map = new google.maps.Map(document.getElementById('map_canvas'),myOptions);
  //   directionsDisplay.setMap(map);
  //   directionsDisplay.setPanel(document.getElementById('directionsPanel'));
  //   new google.maps.Marker({
  //     position: latlng,
  //     map: map,
  //     title: 'My location'
  //   });
  // }
  //
  //
  // function calcRoute(e) {
  //   e.preventDefault();
  //   var start = document.getElementById('routeStart').value;
  //   var end = '51.764696,5.526042';
  //   var request = {
  //     origin: start,
  //     destination: end,
  //     travelMode: google.maps.DirectionsTravelMode.DRIVING
  //   };
  //   directionsService.route(request, function(response, status) {
  //     if (status === google.maps.DirectionsStatus.OK) {
  //       directionsDisplay.setDirections(response);
  //     }
  //   });
  // }

  initialize();
  $('#routeForm').on('submit', calcRoute);
});