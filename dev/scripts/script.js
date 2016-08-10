var mainKnits = {};

mainKnits.apiKey = 'c7jmtzsyy9arcehfyeq3mk58';
mainKnits.apiurl = 'https://openapi.etsy.com/v2/listings/active'

mainKnits.getKnits = function() {
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
				location: 'Toronto',
				limit: 100,
				listing_id: 'images',
				includes: 'Images'
				// creation_tsz: 60
			}
		}
	}).then(function(etsy) {
		console.log(etsy);
		var results = etsy.results;
		// console.log(results.user_id);
		results.forEach(function(item, index) {
			var previewImage = item.Images[0].url_170x135;
			$('body').append(`<img src=${previewImage}>`);
		});

		results.forEach(function(item, index) {
			// console.log(item.user_id);
		});
		// console.log(finalKnits);
	});
};

mainKnits.init = function() {
	mainKnits.getKnits();
};

$(function() {
	mainKnits.init();
});