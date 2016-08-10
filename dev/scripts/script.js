var mainKnits = {}

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
				includes: 'Images',
				creation_tsz: 60
			}
		}
	}).then(function(etsy) {
		console.log(etsy);
		// finalKnits = etsy.results[0].images[0].url_75x75
		var results = etsy.results;
		results.forEach(function(item, index) {
			var previewImage = item.Images[0].url_170x135;

			var price = item.price;

			var currency = item.currency_code;

			var productUrl = item.url;

			console.log(price);

			$('.grid').append(`
				<a href="${productUrl}" class="grid-item grid-item--width2 productItem">

					<div class="pricetag"><p>${price} ${currency}</p></div>

					<img src=${previewImage}>

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