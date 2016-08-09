var mainKnitsObject = {}

var apikey = 'https://openapi.etsy.com/v2/listings/active?limit=100&offset=100&api_key=c7jmtzsyy9arcehfyeq3mk58&category=knit&materials=knit&location=Toronto&listing_id=&includes=Images&listing_id=images'

var ajaxcall = function() {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		dataType: 'json',
		data: {
			reqUrl: apikey
			// limit: 100,
			// offset: 100
		}
	}).then(function(etsy) {
		// finalKnits = etsy.results[0].images[0].url_75x75
		console.log(etsy);
		// console.log(finalKnits);
	});
};

ajaxcall();