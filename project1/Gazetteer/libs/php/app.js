
 $('#btnRun').click(function() {
 
  $.ajax({
    url: "libs/php/getCountryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      country: $('#country-dropdown').val(),
      lang: $('#selLanguage').val(),
    },
    success: function(result) {
     

      console.log(JSON.stringify(result));
     
       
      

      if (result.status.name == "ok") {

        $('#txtContinent').html(result['data'][0]['continent']);
        $('#txtCapital').html(result['data'][0]['capital']);
        $('#txtLanguages').html(result['data'][0]['languages']);
        $('#txtPopulation').html(result['data'][0]['population']);
        $('#txtArea').html(result['data'][0]['areaInSqKm']);
        $('#txtSouth').html(result['data'][0]['south']);
       $('#txtNorth').html(result['data'][0]['north']);
        $('#txtEast').html(result['data'][0]['east']);
        $('#txtWest').html(result['data'][0]['west']);


      }
      
      
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
    }
  });
 
})


//weather info
$('#btnRun1').click(function() {

  
  $.ajax({
    url: "libs/php/getWeather.php",
    type: 'POST',
    dataType: 'json',
    data:{
      lat: lat,
lng:lng,
      
    },
    success: function(result) {
    

      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        

       $('#txtclouds').html(result['data']['clouds']);
      $('#txttemperature').html(result['data']['temperature']);
        $('#txthumidity').html(result['data']['humidity']);
        $('#txtwindspeed').html(result['data']['windSpeed']);
        $('#txtdewpoint').html(result['data']['dewPoint']);
        $('#txtstationname').html(result['data']['stationName']);
        $('#txtwinddirection').html(result['data']['windDirection']);
        $('#txtdatetime').html(result['data']['datetime']);
        $('#txtweathercondition').html(result['data']['weatherCondition']);
        $('#txtcountrycode').html(result['data']['countryCode']);
        

      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Data not available")
    }
  }); 
});

//news
$('#btnRun4').click(function() {
  
  $.ajax({
    url: "libs/php/getNews.php",
    type: 'GET',
    dataType: 'json',
    data: {
        newsCountry: $('#country-dropdown').val(),
    },
    success: function(result) {
        console.log('News Data', result);
        if (result.status == "No matches for your search.") {
            $('#Headlines').hide();
            $('#newsList').hide();
            $('#noNews').html('Sorry, the Newscatcher API does not have articles for this country.');
        }
        else if (result.status == "ok") {
            $('#newsList').html("");
            for (var i=0; i<result.articles.length; i++) {
                $("#newsList").append('<li><a href='+ result.articles[i].link + '>' + result.articles[i].title + '</a></li>');
        }                
    }},
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
  }); 
  });
  

 

    //Wikipedia search info
    $('#btnRun2').click(function() {

      $.ajax({
        url: "libs/php/wikipedia.php",
        type: 'POST',
        dataType: 'json',
        data: {
          q: $('#country-dropdown').val(),
          maxRows: 10,
         
          
        },
        success: function(result) {
  
          console.log(JSON.stringify(result));
  
          if (result.status.name == "ok") {
  
            $('#txtlatitude2').html(result['data'][0]['lat']);
            $('#txtlongitude2').html(result['data'][0]['lng']);
            $('#txtwikipediaurl').html(result['data'][0]['wikipediaUrl']);
            $('#txtelevation').html(result['data'][0]['elevation']);
            $('#txtlang').html(result['data'][0]['lang']);
            $('#txttitle').html(result['data'][0]['title']);
            $('#txtfeature').html(result['data'][0]['feature']);
            $('#txtrank').html(result['data'][0]['rank']);
            $('#txtsummary').html(result['data'][0]['summary']);
            $('#txtcountrycode').html(result['data'][0]['countryCode']);
            
            
          }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("data not available ")
        }
      }); 
    
    });
   
    

