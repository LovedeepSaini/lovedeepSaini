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