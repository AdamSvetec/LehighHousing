var rent_max = 1000;
var rent_min = 0;

var map;
var marker_holders = [];
var InfoWindow;

// on load function
$( function() {
	$( "#bedroom-spinner" ).spinner({
      spin: function( event, spinner ) {
        $( this ).spinner( "value", spinner.value );
        updateData();
      },
      min: 1
    });
	$( "#year_selection" ).selectmenu({
		change: function( event, ui ) { 
			updateData();
		}
	});
  $( "#slider-range" ).slider({
    range: true,
    min: rent_min,
    max: rent_max,
    values: [ rent_min, rent_max ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    },
    stop: function(event, ui) {
      updateData();
    }
  });
  $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) + " - $" + $( "#slider-range" ).slider( "values", 1 ) );
  add_google_maps_script(); //trigger the load of google maps api scripts 
});

// whenever values in filter are changes, this is triggered to update map
function updateData(){
	for (var i = 0; i < marker_holders.length; i++) {
    marker_holders[i].marker.setMap(null);
  }
  marker_holders = [];
	var filter = {"bedroom_cnt":$("#bedroom-spinner").spinner("value"), "rent_high":$("#slider-range").slider("values", 1), "rent_low":$("#slider-range").slider("values", 0), "year":$( "#year_selection" ).val()};
	$.get( '/filter', filter, function(houses) { 
		for(i=0; i < houses.length; i++){
			addMarker(houses[i]);
		}
	});
}

// adds house to map
function addMarker(house) {
	var marker_holder = {};
	// Building marker
	var location = {lat:house.lat, lng:house.lng};
	marker_holder.marker = new google.maps.Marker({
		position: location,
		map: map
	});

	// Info Window Content
	marker_holder.infoWindowContent = '<div class="info_content">' +
	'<h3><a href="house/'+house._id+'?year='+$( "#year_selection" ).val()+'" target="_blank">'+house.address+'</a></h3>' +
	'<div class="info_pane_info"><div class="info_pane_price">$'+house.availability.find( availability => availability.year == $( "#year_selection" ).val()).rent+'</div>' +
	'<div><span class="info_pane_stars" style="display: inline-block"></span></div></div>' +
	'</div>';
	marker_holder.house_rating = house.avg_overall_rating;
	marker_holders.push(marker_holder);
	var index = marker_holders.length - 1;
	infoWindow = new google.maps.InfoWindow();
    //Add info window to each marker have an info window    
    google.maps.event.addListener(marker_holder.marker, 'click', (function(marker, index) {
        return function() {
        	if(infoWindow){
        		infoWindow.close();
        	}
        	infoWindow.setContent(marker_holders[index].infoWindowContent);
        	infoWindow.open(map, marker);
        	$(function () { $(".info_pane_stars").rateYo({ rating: marker_holders[index].house_rating, starWidth: "15px", readOnly: true });});
        }
	})(marker_holder.marker, index));	
}

// callback function for load of google maps scripts
function gmaps_callback() {
  var lehigh_loc = {lat: 40.6069, lng: -75.3783};
  map = new google.maps.Map($("#map")[0], {
    zoom: 15,
    center: lehigh_loc
  });
  updateData();
}

// adds script to dom to trigger google maps scripts load
function add_google_maps_script() {
	var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAvh74ExLCdpPPcfsvN3YfxEfz4NlosASs&callback=gmaps_callback";
    document.body.appendChild(script);
}