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