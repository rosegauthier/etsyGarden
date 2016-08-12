// OUR MAINKNITS OBJECT
var mainKnits = {}

mainKnits.apiKey = 'c7jmtzsyy9arcehfyeq3mk58';
mainKnits.apiurl = 'https://openapi.etsy.com/v2/listings/active';
mainKnits.geocodeurl = 'http://nominatim.openstreetmap.org/reverse';

mainKnits.userPrice = 0;

mainKnits.outputUpdate = function(price) {
	mainKnits.userPrice = price;
	$('#max-price').val(`$${price}`);
};

//sorting function for reordering the results based on relevance
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
	   navigator.geolocation.getCurrentPosition(success, error, options);
	   //once the button has been pressed, hide the button and make the loading animation visible
	   $('.geolocation').hide(); 
	   $('.loading').show();
	}else{
	   // no geolocation :(
	   $('.loading-container').append(`<p>Sorry, we couldn't find your location. Please manually enter your location.</p>`);
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
	   //call the function to trigger the ajax call that converts the coordinates into City,State
	   mainKnits.convertLocation(lat, lon);
	};
	function error(err){
	   $('.loading-container').append(`<p>Sorry, we couldn't find your location. Please manually enter your location.</p>`);
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
		//concatonate the converted info into one string and pass it along to the etsy API function
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
	})
	.then(function(etsy) {
		//once the API data is back, hide the loading animation
		$('.loading').hide();
		//make the container for the slider and the images visible
		$('.results').show();

		var results = etsy.results;

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
							<p class="dollars number" >${price}</p>
							<p class="currency">${currency}</p>
						</div>
						
					</div>

					<img src=${previewImage} alt="${title}">

				</a>`);
		});

		var $grid = $('.grid').isotope({
	 		 // options
			itemSelector: '.grid-item',
		 	// resizable: false,
		 	masonry: {
		  	// columnWidth: colW,
		    	isFitWidth: true
			}
		});
		//Use isotope to filter selections based on price
		// hash of functions that match data-filter values
		var filterFns = {
		  // show if number is greater than 50
		  maxPrice: function() {
		    var number = $(this).find('.number').text();
		    return parseInt( number, 10 ) < mainKnits.userPrice;
		  },
		};
		// filter items on button click
		$('.price-sort').on( 'change', function() {
		  var filterValue = $(this).attr('data-filter');
		  // use filter function if value matches
		  filterValue = filterFns[ filterValue ] || filterValue;
		  $grid.isotope({ filter: filterValue });
		});
	});
};

mainKnits.init = function() {
	$('.user-location-form').on('submit', function(e) {
		e.preventDefault();
		var userLocation = $('.user-location').val();
		//show the loading animation on submit of the form
		$('.loading').show();
		//clear the input field
		$('input[name=user-location]').val('');
		//call the function to make the ajax call
		mainKnits.getKnits(userLocation);
	});
	$('.geolocation').on('click', function() {
		mainKnits.geoLocate();
	});
};

//document ready
$(function() {
	mainKnits.init();
});