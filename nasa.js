var selectedRoverId="";
var currentRoverData=[];

var cameras = {
	curiosity:['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
	opportunity:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM'],
	spirit:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM']
};

var key = "0MBgxNs4QpgozbvtFsYv3gdhR5ezpO1bOKiZJ1dS";
var nasa_url = "https://api.nasa.gov/mars-photos/api/v1/";

function setSliderRange(value){
	$( "#slider")[0].max = value;
}
function setCurrentSOL(value){
	$("#currentSliderValue")[0].innerHTML = value;
}

function selectRover(currentRoverId){
	this.selectedRoverId = currentRoverId;
	setRoverActive(currentRoverId);
	getRoverData(currentRoverId);
}

function setRoverActive(currentRoverId){
	// !!!
	$(".rover-active").removeClass('rover-active').addClass('rover');
	var selector = "#" + currentRoverId;
	$(selector).addClass('rover-active');
}

function getRoverData(currentRoverId){
	$.ajax({
		url:nasa_url + "/manifests/" + currentRoverId + "?api_key=" + key,
		type:'GET',
		error:function(data){
			alert("An error has occured.");
		},
		success:function(data){
			currentRoverData = data;
			$(".text").html("Name:" + data.photo_manifest.name + "<br>Launch date: " + data.photo_manifest.launch_date + "<br>Landing date: " + data.photo_manifest.landing_date + "<br>Newest sol: " + data.photo_manifest.max_sol + "<br>Total photos: " + data.photo_manifest.max_sol)
			var numberOfSols=currentRoverData.photo_manifest.max_sol;
			setSliderRange(numberOfSols);
			setCameras(currentRoverId);
		}
	});
}

function setCameras(currentRoverId){

	var camerasToSet = [];

	switch (currentRoverId)
	{
		case "curiosity" : 
			camerasToSet = cameras.curiosity;
			break;

		case "opportunity" :
			camerasToSet = cameras.opportunity;
			break;

		case "spirit" :
			camerasToSet = cameras.spirit;
			break;

		default: 
			alert("Error message");
	}

	$("#sel_cam").empty();
	
	for (var i=0 ; i < camerasToSet.length; i++){
		appendRadioButton(camerasToSet[i]);
	}
}
function appendRadioButton(name){
	$("#sel_cam").append('<input type="radio" name="camera" value="' + name + '"> '+ name + '<br>');
}

function getImages () {
	var activeCamera = $('#sel_cam input:checked').val();
	var currentSliderValue = $("#currentSliderValue")[0].innerHTML;

	$.ajax({
		url: nasa_url + "/rovers/" + selectedRoverId + "/photos?sol=" + currentSliderValue + "&camera=" + activeCamera + "&api_key=" + "0MBgxNs4QpgozbvtFsYv3gdhR5ezpO1bOKiZJ1dS",
		type: 'GET',
		error:function(data){
			alert("An error has occured. See error message : " + data.responseText);
		},
		success:function(images) {
			currentRoverImages = images.photos;
			for (var i = 0; i < currentRoverImages.length; i++) {
			$("#right").append(
				' <div class="col-xs-6 col-md-3"> <div class="thumbnail"> <img class="rov_img" src="' + currentRoverImages[i].img_src + '"> </div></div>');
			}
		}
	});

	$("#right").empty();
}
