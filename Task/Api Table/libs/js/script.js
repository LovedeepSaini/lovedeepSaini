$('#btnRun1').click(function() {
		$.ajax({
			url: "libs/php/getNearbyplaces.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#latitude1').val(),
				lng: $('#longitude1').val(),
				localCountry:$('#localcountry').val(),
				cities:$('#cities').val(),
				
			},
			success: function(result1) {

				console.log(JSON.stringify(result1));

				if (result1.status.name == "ok") {

					$('#txtname').html(result1['data'][0]['name']);
					$('#txtlatitude').html(result1['data'][0]['lat']);
					$('#txtlongitude').html(result1['data'][0]['lng']);
					$('#txtfcode').html(result1['data'][0]['fcode']);
					

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});
	$('#btnRun').click(function() {

		$.ajax({
			url: "libs/php/getWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#latitude').val(),
				lng: $('#longitude').val(),
				radius:$('#radius').val(),
				
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtclouds').html(result['data']['clouds']);
					$('#txttemperature').html(result['data']['temperature']);
					$('#txthumidity').html(result['data']['humidity']);
					$('#txtwindspeed').html(result['data']['windSpeed']);
					

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("Data not available")
			}
		}); 
	
	});
	$('#btnRun2').click(function() {

		$.ajax({
			url: "libs/php/getWikipedia.php",
			type: 'POST',
			dataType: 'json',
			data: {
				q: $('#place1').val(),
				maxRows:$('#maxrows').val(),
				lang:$('#Languages').val(),
				title:$('#settitle').val(),
				
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtlatitude2').html(result['data'][0]['lat']);
					$('#txtlongitude2').html(result['data'][0]['lng']);
					$('#txtwikipediaurl').html(result['data'][0]['wikipediaUrl']);
					$('#txtelevation').html(result['data'][0]['elevation']);
					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("data not available ")
			}
		}); 
	
	});