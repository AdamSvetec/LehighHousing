var mapStatus;
var bedroom_cnt = 5;
var bathroom_cnt = 1;
var rent_high = 700;
var rent_low = 0;
var year = "2016-2017";

var map;
var marker_holders = [];
var InfoWindow;

function updateData(){
	for (var i = 0; i < marker_holders.length; i++) {
          marker_holders[i].marker.setMap(null);
    }
    marker_holders = [];
	var filter = {"bedroom_cnt":bedroom_cnt, "bathroom_cnt":bathroom_cnt, "rent_high":rent_high, "rent_low":rent_low, "year":year};
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
	'<h3><a href="house?id='+row._id+'&year='+year+'" target="_blank">'+row.address+'</a></h3>' +
	'<div>Rent: '+'TODO'/*row.rent*/+'</div>' +
	'<div>House: <span id="starsHouse" style="display: inline-block"></span></div>' +
	'<div>Landlord: <span id="starsLandlord" style="display: inline-block"></span></div>' +
	'</div>';
	//marker_holder.house_rating = row.house_rating;
	//marker_holder.landlord_rating = row.landlord_rating;
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
        	$(function () { $("#starsHouse").rateYo({ rating: 1/*marker_holders[index].house_rating*/, starWidth: "15px" }); $("#starsLandlord").rateYo({ rating: 1/*marker_holders[index].landlord_rating*/, starWidth: "15px" }); });
        }
	})(marker_holder.marker, index));	
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