/* global google: true */
$(function () {
  console.log('JSTING');


  const place = $('#map').data('place');
  console.log(place);

  console.log(place.name + ' ' + place.postCode);

  // $('.find').on('click', addAddress);



  function makeMap() {
    var address = place.postCode;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address}, function(results, status) {
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
      }
    });
  }
  makeMap();
});
