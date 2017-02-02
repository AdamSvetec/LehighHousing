var mapStatus;
var bedroom_cnt = 5;
var bathroom_cnt = 1;
var rent_high = 700;
var rent_low = 0;
var year = "2016-2017";

var map;
var markers = [];
var info_contents = [];

function updateData(){
	for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
    markers = [];
    info_contents = [];
	var filter = {"bedroom_cnt":bedroom_cnt, "bathroom_cnt":bathroom_cnt, "rent_high":rent_high, "rent_low":rent_low, "year":year};
	$.get( '/filter', filter, function(rows) { 
		for(i=0; i < rows.length; i++){
			addMarker(rows[i]);
		}
	});
}

function addMarker(row) {
	// Building marker
	var location = {lat:row.lat,lng:row.lng};
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});
	markers.push(marker);

	// Info Window Content
	var infoWindowContent = '<div class="info_content">' +
	'<h3><a href="house?id='+row.id+'" target="_blank">'+row.address+'</a></h3>' +
	'</div>';
	var infoWindow = new google.maps.InfoWindow();
	var marker_index = markers.length - 1;
    //Add info window to each marker have an info window    
    google.maps.event.addListener(marker, 'click', (function(marker, marker_index) {
        return function() {
        	infoWindow.setContent(info_contents[marker_index]);
        	infoWindow.open(map, marker);
        }
	})(marker, marker_index));
	info_contents.push(infoWindowContent);
}

function initMap() {
	var lehigh_loc = {lat: 40.6069, lng: -75.3783};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: lehigh_loc
	});
	updateData();
}

function clearFilter(){
	alert("Someone needs to code this...")
}

function myFunction() {
	document.getElementById("myDropdown").classList.toggle("show");
}

function dropDown2() {
	document.getElementById("myDropdown2").classList.toggle("show");
}

function myFunctionBaths() {
	document.getElementById("myDropdown3").classList.toggle("show");
}

function myFunctionYear() {
	document.getElementById("myDropdown4").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {

		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

function alertFunc1(){
	if($(map).is(":visible")){
		$(map).hide();
		$(list).show();
		mapStatus = 'list';
	} else {
		$(list).hide();
		$(map).show();
		mapStatus = 'map';

	}
}