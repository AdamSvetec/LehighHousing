var mapStatus;
var bedroom_cnt = 5;
var bathroom_cnt = 1;
var rent_high = 700;
var rent_low = 0;
var year = "2016-2017";
var sendData;
function updateData(){
    sendData = {"bedroom_cnt":bedroom_cnt, "bathroom_cnt":bathroom_cnt, "rent_high":rent_high, "rent_low":rent_low, "year":year};

    $.get( '/filter', sendData, function(data) { alert("Success!") });
    
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