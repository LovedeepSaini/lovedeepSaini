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