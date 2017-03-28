var max_bedroom_count = 7;
var rent_max = 1000;
var rent_min = 0;
var year = "2017-2018";

var map;
var marker_holders = [];
var InfoWindow;
var gmaps_callback = function(){};

$( function() {
	$( "#bedroom-spinner" ).spinner({
      spin: function( event, spinner ) {
        if ( spinner.value <= 1 ) {
          $( this ).spinner( "value", 1 );
          return false;
        } else if ( spinner.value >= max_bedroom_count ) {
          $( this ).spinner( "value", max_bedroom_count );
          return false;
        }
        $( this ).spinner( "value", spinner.value );
        updateData();
      }
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
      values: [ 200, 700 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      },
      stop: function(event, ui) {
        updateData();
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) + " - $" + $( "#slider-range" ).slider( "values", 1 ) );
    gmaps_callback = function() {   // redefine callback function
        var lehigh_loc = {lat: 40.6069, lng: -75.3783};
		map = new google.maps.Map($("#map")[0], {
			zoom: 14,
			center: lehigh_loc
		});
		updateData();
	}   
    add_google_maps_script(); //trigger the load scripts 
  } );

function updateData(){
	for (var i = 0; i < marker_holders.length; i++) {
          marker_holders[i].marker.setMap(null);
    }
    marker_holders = [];
	var filter = {"bedroom_cnt":$("#bedroom-spinner").spinner("value"), "rent_high":$("#slider-range").slider("values", 1), "rent_low":$("#slider-range").slider("values", 0), "year":$( "#year_selection" ).val()};
	$.get( '/filter', filter, function(rows) { 
		for(i=0; i < rows.length; i++){
			addMarker(rows[i]);
		}
	});
}

function addMarker(row) {
	var marker_holder = {};
	// Building marker
	var location = {lat:row.lat,lng:row.lng};
	marker_holder.marker = new google.maps.Marker({
		position: location,
		map: map
	});

	// Info Window Content
	marker_holder.infoWindowContent = '<div class="info_content">' +
	'<h3><a href="house/'+row._id+'?year='+year+'" target="_blank">'+row.address+'</a></h3>' +
	'<div>Rent: '+row.availability.find( availability => availability.year == "2017-2018").rent+'</div>' +
	'<div><span id="starsHouse" style="display: inline-block"></span></div>' +
	'</div>';
	marker_holder.house_rating = row.avg_overall_rating;
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
        	$(function () { $("#starsHouse").rateYo({ rating: marker_holders[index].house_rating, starWidth: "15px" });});
        }
	})(marker_holder.marker, index));	
}

function add_google_maps_script() {
	var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAvh74ExLCdpPPcfsvN3YfxEfz4NlosASs&callback=gmaps_callback";
    document.body.appendChild(script);
}