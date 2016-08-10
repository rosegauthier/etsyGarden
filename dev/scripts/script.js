// OUR MAINKNITS OBJECT
var mainKnits = {}

mainKnits.apiKey = 'c7jmtzsyy9arcehfyeq3mk58';
mainKnits.apiurl = 'https://openapi.etsy.com/v2/listings/active'


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
			}
		}
	}).then(function(etsy) {
		console.log(etsy);
	
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
		results.sort(mainKnits.favorersSort);
		console.log(results);

		//Based on the 100 results we get back
		//We want to sort by relevance so that the top images in the results section will be most favourited
		//The results at the bottom will have the least amount of favourers
		results.forEach(function(item, index) {
			var previewImage = item.Images[0].url_170x135;
			$('body').append(`<img src=${previewImage}><p>${item.num_favorers}</p>`);
		});

	});
};

mainKnits.init = function() {
	mainKnits.getKnits();
};

$(function() {
	mainKnits.init();
});