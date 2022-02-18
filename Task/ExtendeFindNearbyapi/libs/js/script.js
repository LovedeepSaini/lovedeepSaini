$('#btnRun').click(function() {

		$.ajax({
			url: "libs/php/getextendedFindNearby.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#setLatitude').val(),
				lng: $('#setLongitude').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtToponymName').html(result['data'][0]['toponymName']);
					
					$('#txtGeonameId').html(result['data'][0]['geonameId']);
					$('#txtfcode').html(result['data'][0]['fcode']);
					$('#txtfcl').html(result['data'][0]['fcl']);

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				
			}
		}); 
	
	});