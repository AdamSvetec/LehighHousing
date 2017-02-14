var validYears = [];
for(var i = 2000; i < (new Date()).getFullYear(); i++){
	validYears.push(i+'-'+(i+1));
}

function validateForm() {
    var form = document.forms["review_form"];
    if (!validator.isEmail(form["email"].value)){
    	alert("Email is not in valid format");
        return false;
    }
     if (validYears.indexOf(form["year"].value) == -1) {
        alert("Year is not in valid format");
        return false;
    }
    if (form["message"].value.length > 500){
		alert("Review is too long, please limit to 500 words");
        return false;
	}
}