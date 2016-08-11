// OUR MAINKNITS OBJECT
var mainKnits = {}

mainKnits.apiKey = 'c7jmtzsyy9arcehfyeq3mk58';
mainKnits.apiurl = 'https://openapi.etsy.com/v2/listings/active';
mainKnits.geocodeurl = 'http://nominatim.openstreetmap.org/reverse';


mainKnits.favorersSort = function(a,b) {
	if (a.num_favorers < b.num_favorers) {
		return 1;
	}
	else if (a.num_favorers > b.num_favorers) {
		return -1;
	}
	else {
		return 0;
	}
};

mainKnits.geoLocate = function() {
	if('geolocation' in navigator){
	   // geolocation is supported :)
	   navigator.geolocation.getCurrentPosition(success, options); 
	}else{
	   // no geolocation :(
	}
	var options = {
	// enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?  
	   enableHighAccuracy: false, 
	// timeout = how long does the device have, in milliseconds to return a result?
	   timeout: 5000,  
	// maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
	   maximumAge: 0 
	};
	function success(pos){
	// get longitude and latitude from the position object passed in
	   var lat = pos.coords.latitude;
	   var lon = pos.coords.longitude;
	// and presto, we have the device's location! Let's just alert it for now... 
	   console.log(lat,lon);
	   mainKnits.convertLocation(lat, lon);
	};
	function error(err){
	   alert('Can not find your location. Please manually enter your city.'); // alert the error message
	};
}

mainKnits.convertLocation = function(lat, lon) {
	$.ajax({
		url: mainKnits.geocodeurl,
		method: 'GET',
		dataType: 'json',
		data: {
			lat: lat,
			lon: lon,
			format: 'json'
		}
	}).then(function(city) {
		// console.log(city.address.city);
		// console.log(city.address.state);
		var cityState = city.address.city + "," + city.address.state;
		mainKnits.getKnits(cityState);
	});
};


mainKnits.getKnits = function(location) {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		dataType: 'json',
		data: {
			reqUrl: mainKnits.apiurl,
			params: {
				api_key: mainKnits.apiKey,
				materials: 'knit',
				category: 'knit',
				location: location,
				limit: 100,
				listing_id: 'images',
				includes: 'Images'
			}
		}
	}).then(function(etsy) {
	
		var results = etsy.results;

		// var removePatterns = results.tags.filter(function(){
		// 	/([pattern])\w+/g
		// });

		results.forEach(function(item, index){
			var removePatterns = item.tags.filter(function(){
				return item !== /([pattern])\w+/g
			});
		});

		//We need to be able to sort the results before we print them on the page
		//We need to be able to sort the results by relevance before we print them on the page
		results.sort(mainKnits.favorersSort);

		//Provide empty array for below operations
		var filteredResults = [];
		//loop through each item in the results array
		results.forEach(function(result,index) {
			//assume each item is not a pattern
			var isPattern = false;
			//For each result, loop through each string in the tags array
			result.tags.forEach(function(tag,index) {
				//use regex to match any "pattern" in the string
				var pattern = /(pattern)+/g;
				if (pattern.exec(tag)) {
					//if the word "pattern" appears in the string, mark this result as a pattern
					isPattern = true;
				}
			});
			//for each result, check if it is a pattern. If it is not a pattern, push it onto the empty array we created
			if (isPattern === false) {
				filteredResults.push(result);
			}
		});
		console.log(etsy);

		
		filteredResults.forEach(function(item, index) {
			var previewImage = item.Images[0].url_170x135;
			var productUrl = item.url;
			var price = item.price;
			var currency = item.currency_code;
			var title = item.title;

			$('.grid').append(
				`<a href="${productUrl}" class="grid-item productItem">

					<div class="pricetag">
						<img src="assets/pricetag.svg" alt="price tag">
						<div class="pricebox">
							<p class="dollars" >$${price}</p>
							<p class="currency">${currency}</p>
						</div>
						
					</div>

					<img src=${previewImage} alt="${title}">

				</a>`);
		});
		$('.grid').isotope({
	 		 // options
			itemSelector: '.grid-item',
		 	// resizable: false,
		 	masonry: {
		  	// columnWidth: colW,
		    	isFitWidth: true
			}

		});
	});
};

mainKnits.init = function() {
	$('.user-location-form').on('submit', function(e) {
		e.preventDefault();
		var userLocation = $('.user-location').val();
		
		mainKnits.getKnits(userLocation);
	});
	$('button').on('click', function() {
		mainKnits.geoLocate();
	});
};

//document ready
$(function() {
	mainKnits.init();
});