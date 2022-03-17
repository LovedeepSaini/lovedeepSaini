var border;
var currentLat;
var currentLng;
let lat;
let lng;
var popup;
let currentCountry;
let country;
var airports=[];
var cities=[];


var map = L.map('map').setView([51.505, -0.09], 4);

//street layer
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleStreets.addTo(map);



//hybrid layer
googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//sattelite layer
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//Terrain
googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//ImagreryS
Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

//Earth at night by NASA
NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});


//add controls
var baseLayers = {
  //"OpenStreetMap": osm,
  "Google street": googleStreets,
  "hybrid": googleHybrid,
  "Sattelite":googleSat,
  "Terrain":googleTerrain,
  "World Imagery":Esri_WorldImagery,
  "Earth at Night (NASA)":NASAGIBS_ViirsEarthAtNight2012,
};


L.control.layers(baseLayers).addTo(map);
//getcountry list
$.ajax({

    url:"libs/php/countryBorders.php",
  
    dataType:"json",
  
    success: function(result){
  
      console.log(result);
      
  
      for (const iterator of result.data) {
        
        $("#country-dropdown").append(`<option value="${iterator.iso_a2}">${iterator.name}</option>`)
        function alphabetizeList() {
          var sel = $('#country-dropdown');
          var selected = sel.val(); // cache selected value, before reordering
          var opts_list = sel.find('option');
          opts_list.sort(function (a, b) {
              return $(a).text() > $(b).text() ? 1 : -1;
          });
          sel.html('').append(opts_list);
          sel.val(selected); // set cached selected value
      }
      
      alphabetizeList('#country-dropdown');
  
      }
      
  
    },
  
    error: function(jqXHR){
  
      console.log(jqXHR);
  
    }
  
    })
    //preloader
    var loader = document.querySelector(".preloader");

window.addEventListener("load", vanish);

function vanish() {
  loader.classList.add("disppear");
};
//get current location
const successCallback = (position) => {
    $.ajax({
        url: "libs/php/getCurrentloc.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        },
  
        success: function(result) {
            console.log('openCage PHP',result);
            currentLat = result.data[0].geometry.lat;
            currentLng = result.data[0].geometry.lng;
              
         
            $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-2"]);
            
            let currentCountry = result.data[0].components["ISO_3166-1_alpha-2"];
            $("#country-dropdown").val(currentCountry).change();
          
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    }); 
    
  }
 
    
        
      
    
  
  const errorCallback = (error) => {
            console.error(error);
  }
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  
  //on changing select value
  $('#country-dropdown').on('change', function() {
    let countryCode = $('#country-dropdown').val();
    let countryOptionText= $('#country-dropdown').find('option:selected').text();
   
    
    
     
    
    
    $.ajax({
      url: "libs/php/getGeoJson.php",
      type: 'POST',
      dataType: 'json',
      success: function(result) {
  
          console.log('all borders result', result);
  
          if (map.hasLayer(border)) {
              map.removeLayer(border);
          }
            
          let countryArray = [];
          let countryOptionTextArray = [];
      
          for (let i = 0; i < result.data.border.features.length; i++) {
              if (result.data.border.features[i].properties.iso_a2 === countryCode) {
                  countryArray.push(result.data.border.features[i]);
              }
          };
          for (let i = 0; i < result.data.border.features.length; i++) {
              if (result.data.border.features[i].properties.name === countryOptionText) {
                  countryOptionTextArray.push(result.data.border.features[i]);
              }
          };
       
          border = L.geoJSON(countryOptionTextArray[0], {
                                                          color: 'red',
                                                          weight: 3,
                                                          opacity: 0.75
                                                          }).addTo(map);
          let bounds = border.getBounds();
              map.flyToBounds(bounds, {
              padding: [35, 35], 
              duration: 2,
              }); 
            

              
             
      },
      
      error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus, errorThrown);
      }
    }); 
    $.ajax({
      url: "libs/php/gwtCountryInfo.php",
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#country-dropdown').val(),
        lang:$('#selLanguage').val(),
      
      },
      success: function(result) {
      
       
        console.log(JSON.stringify(result));
         
        
  
        if (result.status.name == "ok") {
          q=result['data'][0]['capital'];
  
          $('#txtContinent').html(result['data'][0]['continent']);
         $('#txtCapital').html(result['data'][0]['capital']);
        $('#txtLanguages').html(result['data'][0]['languages']);
        $('#txtPopulation').html(((result['data'][0]['population'])/ 1000000).toFixed(1));
        $('#txtArea').html(result['data'][0]['areaInSqKm']);
        $('#txtCurrency').html(result['data'][0]['currencyCode']);
       
        $.ajax({
          url: "libs/php/wikipedia.php",
          type: 'POST',
          dataType: 'json',
          data: {
          q: q,
          maxRows: 10,
          
          
          },
          success: function(result) {
          
          console.log(JSON.stringify(result));
          
          if (result.status.name == "ok") {
            lat= result['data'][0]['lat'];
            lng=result['data'][0]['lng'];
          
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
            $.ajax({
              url: "libs/php/weather.php",
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
                  $('#txticao').html(result['data']['ICAO']);
                  $('#txtcloudscode').html(result['data']['cloudsCode']);
                  
            
                }
              
              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log("Data not available")
              }
            }); 
            
              
            
            
            
            
          }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
          console.log("data not available ")
          }
          }); 
          
          
  
    
  }
        
        
},
error: function(jqXHR, textStatus, errorThrown) {
// your error code
}
});
    



// Wikipedia





//news data
$.ajax({
url: "libs/php/news.php",
type: 'POST',
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

//map markers-------------------------------------------------------------------------------------------------------------
//Capital
$.ajax({
  url: "libs/php/markerCapital.php",
  type: 'GET',
  dataType: 'json',
  data: {
      country:$('#country-dropdown').val(), 
  },
  success: function(result) {
    
      if (result.status.name == "ok") {                
        capital = [result['data']['geonames']['0']['name'],result['data']['geonames']['0']['population'],result['data']['geonames']['0']['lat'],result['data']['geonames']['0']['lng']];
      }
  },
  error: function(jqXHR, textStatus, errorThrown) {
      console.log(JSON.stringify(jqXHR));
      console.log(JSON.stringify(textStatus));
      console.log(JSON.stringify(errorThrown));
  }
}); 
//City Markers
$.ajax({
  url: "libs/php/cityMarkers.php",
  type: 'GET',
  dataType: 'json',

  data: {
      country:$('#country-dropdown').val() ,
  },
  success: function(result) {
    
      if (result.status.name == "ok") {  
      
              
          for(let i=0; i < result['data']['geonames'].length; i++){
          
           cities.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['population'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
          }
      }
  },

  error: function(jqXHR, textStatus, errorThrown) {
      console.log(JSON.stringify(jqXHR));
      console.log(JSON.stringify(textStatus));
      console.log(JSON.stringify(errorThrown));
  }
}); 
//airports
$.ajax({
  url: "libs/php/airports.php",
  type: 'GET',
  dataType: 'json',
  data: {
      country: $('#country-dropdown').val(),
  },
  success: function(result) {
    
      if (result.status.name == "ok") {                
        
          for(let i=0; i < result['data']['geonames'].length; i++){
          
              airports.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
          }
      }
  },

  error: function(jqXHR, textStatus, errorThrown) {
      console.log(JSON.stringify(jqXHR));
      console.log(JSON.stringify(textStatus));
      console.log(JSON.stringify(errorThrown));
  }
}); 







  
  });
  
  // New event for map click
  map.on('click', function(e) {        
    var popLocation = e.latlng;
    //console.log('<<---popLocation--->>', popLocation.lat)
    $.ajax({
      url: "libs/php/getCurrentloc.php",
      type: 'GET',
      dataType: 'json',
      data: {
          lat: popLocation.lat,
          lng: popLocation.lng,
      },
  
      success: function(result) {
  
          if (result.data[0].components["ISO_3166-1_alpha-2"]) {
              console.log('openCage PHP',result);
              //console.log(typeof result);
              currentLat = result.data[0].geometry.lat;
              currentLng = result.data[0].geometry.lng;
  
              
              // L.marker([currentLat, currentLng], {icon: customIconOrange}).addTo(map).bindPopup("You clicked in: " + result.data[0].components.country);
  
              $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-2"]);
              
              let currentCountry = result.data[0].components["ISO_3166-1_alpha-2"];
              $("#country-dropdown").val(currentCountry).change();
          }
          else {
              console.log("clicked on water")
              console.log('openCage PHP',result);
  
              currentLat = result.data[0].geometry.lat;
              currentLng = result.data[0].geometry.lng;
  
              
  
              L.popup()
                  .setLatLng([currentLat, currentLng])
                  .setContent("<div><strong>" + result.data[0].formatted + "</strong></div>")
                  .openOn(map);
          }
          
       
      },
      
      error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
          console.log(jqXHR, errorThrown)
         
      }
    }); 
  });
    
    
 
 
 
  
//easybuttons
L.easyButton('<i class="fas fa-info-circle fa-lg"style="color:blue"></i>',function(){
  
    $('#mymodal2').modal("show");
 },'Country Information').addTo(map );

 L.easyButton('<i class="fab fa-wikipedia-w" style="color:red"></i>',function(){
    
  $('#mymodal4').modal("show");
},'Wikipedia Information').addTo(map );

L.easyButton('<i class=" fa-solid fa-newspaper" style="color:green"></i>',function(){
  $('#mymodal3').modal("show");
},'News').addTo(map);

L.easyButton('<i class="fa-solid fa-sun" style="color:orange"></i>',function(){
  $('#weatherModal').modal("show");
},'Weather').addTo(map);

var markerClusters = L.markerClusterGroup();

var MapIcon = L.Icon.extend({
  options: {
      iconSize:     [30, 30],
      popupAnchor:  [0, -20]
  }
});


//Capital City  Easy Button----------------------------------------------------



function capitalDisable(){
  capitalBtn.disable();
}

var capitalBtn = L.easyButton({
  position: 'topright',
  id: 'capital',
  states: [{
      icon: '<i class="fa-solid fa-earth-europe" style="color:darkblue"></i>',
      stateName: 'unchecked',
      title: 'Show Capital City',
      onClick: function(btn,map) {            

          var countryCapitalIcon = L.Icon.extend({
              options: {
                  iconSize:     [45, 45],
                  popupAnchor:  [0, -20]
              }
          });
      
          var capitalIcon = new countryCapitalIcon({iconUrl: 'img/capital1.png'});

          var m = L.marker(new L.LatLng(capital[2], capital[3]), {icon: capitalIcon}).bindPopup(`
          <b>Capital City: </b> ${capital[0]} <br>
          <b>Population: </b> ${(capital[1] / 1000000).toFixed(1)} M
          `);
          markerClusters.addLayer( m );
      
          map.addLayer(markerClusters);

          capitalDisable();

      }
  }, {
      icon: "none",
      stateName: 'checked',
      onClick: function(btn,map) {
          btn.state('unchecked');
      }
  }]
}).addTo(map);
//cities easy button------------------------------------------------
function cityDisable(){
  cityBtn.disable();
}

var cityBtn = L.easyButton({
  position: 'topright',
  id: 'cities',
  states: [{
      icon: '<i class="fa-solid fa-city" style="color:purple"></i>',
      stateName: 'unchecked',
      title: 'Show Top 25 Cities',
      onClick: function(btn,map) {
        var citiesIcon = L.Icon.extend({
          options: {
              iconSize:     [45, 45],
              popupAnchor:  [0, -20]
          }
      });
  

          var cityIcon = new citiesIcon({iconUrl: 'img/cities2.png'});

              for(i=0;i<cities.length;i++){
                  
                  var m = L.marker(new L.LatLng(cities[i][2], cities[i][3]), {icon: cityIcon}).bindPopup(`
                      <b>City:</b> ${cities[i][0]} <br> 
                      <b>Population: </b> ${cities[i][1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                  `);
                  markerClusters.addLayer( m );
                  
              }

          map.addLayer(markerClusters);

          cityDisable();
      }
  }, {
      icon: "none",
      stateName: 'checked',
      onClick: function(btn,map) {
          btn.state('unchecked');
      }
  }]
}).addTo(map);

//airport markers-----------------------------------------------------------------
function airportsDisable(){
  airportsBtn.disable();
}

var airportsBtn = L.easyButton({
  position: 'topright',
  id: 'airports',
  states: [{
      icon: '<i class="fa-solid fa-plane-departure" style="color:red"></i>',
      stateName: 'unchecked',
      title: 'Show Airports',
      onClick: function(btn,map) {

          var airportIcon = new MapIcon({iconUrl: 'img/airplane.png'});

          for(i=0;i<airports.length;i++){
              
              var m = L.marker(new L.LatLng(airports[i][1], airports[i][2]), {icon: airportIcon}).bindPopup(`${airports[i][0]}`);
              markerClusters.addLayer( m );
              
          }
      
          map.addLayer(markerClusters);
          
          airportsDisable();

      }
  }, {
      icon: "none",
      stateName: 'checked',
      onClick: function(btn,map) {
          btn.state('unchecked');
      }
  }]
}).addTo(map);
//reset button
L.easyButton({
  position: 'topright',
  id: 'reset',
  states: [{
      icon: '<i class="fa-solid fa-rotate-right"></i>',
      stateName: 'unchecked',
      title: 'Reset Icons',
      onClick: function(btn,map) {
       
        location.reload();
      }
  }, {
      icon: 'none',
      stateName: 'checked',
      onClick: function(btn,map) {
        
          btn.state('unchecked');
      }
  }]


}).addTo(map);



//getting weather card on map click-------------------------------------------------------------
popup = L.popup();

//popup function
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString()) // immediately replaced by weatherpopup...
        .openOn(map);


//getting json function

$(document).ready(function(){
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?lat=" + e.latlng.lat + '&lon=' + e.latlng.lng + "&appid=605009afa2f3c9d399252cf80559babe",
    dataType: 'json',

    success: function(data) {
      // storing json data in variables
      weather_country=data.sys.country;
      weatherlocation_lon = data.coord.lon; // lon WGS84
      weatherlocation_lat = data.coord.lat; // lat WGS84
      weatherstationname = data.name // Name of Weatherstation
      weatherstationid = data.id // ID of Weatherstation
      weathertime = data.dt // Time of weatherdata (UTC)
      temperature = data.main.temp; // Kelvin
      airpressure = data.main.pressure; // hPa
      airhumidity = data.main.humidity; // %
      temperature_min = data.main.temp_min; // Kelvin
      temperature_max = data.main.temp_max; // Kelvin
      windspeed = data.wind.speed; // Meter per second
      winddirection = data.wind.deg; // Wind from direction x degree from north
      cloudcoverage = data.clouds.all; // Cloudcoverage in %
      weatherconditionid = data.weather[0].id // ID
      weatherconditionstring = data.weather[0].main // Weatheartype
      weatherconditiondescription = data.weather[0].description // Weatherdescription
      weatherconditionicon = data.weather[0].icon // ID of weathericon

    // Converting Unix UTC Time
    var utctimecalc = new Date(weathertime * 1000);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = utctimecalc.getFullYear();
    var month = months[utctimecalc.getMonth()];
    var date = utctimecalc.getDate();
    var hour = utctimecalc.getHours();
    var min = utctimecalc.getMinutes();
    var sec = utctimecalc.getSeconds();
    var time = date + '.' + month + '.' + year + ' ' + hour + ':' + min + ' Uhr';

    // recalculating
    var weathercondtioniconhtml = "http://openweathermap.org/img/w/" + weatherconditionicon + ".png";
    var weathertimenormal = time; // reallocate time var....
    var temperaturecelsius = Math.round((temperature - 273) * 100) / 100;  // Converting Kelvin to Celsius
    var windspeedknots = Math.round((windspeed * 1.94) * 100) / 100; // Windspeed from m/s in Knots; Round to 2 decimals
    var windspeedkmh = Math.round((windspeed * 3.6) * 100) / 100; // Windspeed from m/s in km/h; Round to 2 decimals
    var winddirectionstring = "Im the wind from direction"; // Wind from direction x as text
    if (winddirection > 348.75 &&  winddirection <= 11.25) {
        winddirectionstring =  "North";
    } else if (winddirection > 11.25 &&  winddirection <= 33.75) {
        winddirectionstring =  "Northnortheast";
    } else if (winddirection > 33.75 &&  winddirection <= 56.25) {
        winddirectionstring =  "Northeast";
    } else if (winddirection > 56.25 &&  winddirection <= 78.75) {
        winddirectionstring =  "Eastnortheast";
    } else if (winddirection > 78.75 &&  winddirection <= 101.25) {
        winddirectionstring =  "East";
    } else if (winddirection > 101.25 &&  winddirection <= 123.75) {
        winddirectionstring =  "Eastsoutheast";
    } else if (winddirection > 123.75 &&  winddirection <= 146.25) {
        winddirectionstring =  "Southeast";
    } else if (winddirection > 146.25 &&  winddirection <= 168.75) {
        winddirectionstring =  "Southsoutheast";
    } else if (winddirection > 168.75 &&  winddirection <= 191.25) {
        winddirectionstring =  "South";
    } else if (winddirection > 191.25 &&  winddirection <= 213.75) {
        winddirectionstring =  "Southsouthwest";
    } else if (winddirection > 213.75 &&  winddirection <= 236.25) {
        winddirectionstring =  "Southwest";
    } else if (winddirection > 236.25 &&  winddirection <= 258.75) {
        winddirectionstring =  "Westsouthwest";
    } else if (winddirection > 258.75 &&  winddirection <= 281.25) {
        winddirectionstring =  "West";
    } else if (winddirection > 281.25 &&  winddirection <= 303.75) {
        winddirectionstring =  "Westnorthwest";
    } else if (winddirection > 303.75 &&  winddirection <= 326.25) {
        winddirectionstring =  "Northwest";
    } else if (winddirection > 326.25 &&  winddirection <= 348.75) {
        winddirectionstring =  "Northnorthwest";
    } else {
        winddirectionstring =  " - currently no winddata available - ";
    };

//Popup with content
    var fontsizesmall = 1;
    popup.setContent("<b>Weatherdata</b>:<br>" + "<img src=" + weathercondtioniconhtml + "><br>" + weatherconditionstring + " (<b>Weather-ID: </b>" + weatherconditionid + "): " + weatherconditiondescription + "<br><br><b>Temperature:</b> " + temperaturecelsius + "°C<br><b>Country:</b>" +weather_country+"<br><br><b>Airpressure: </b>" + airpressure + " hPa<br><b>Humidityt: </b>" + airhumidity + "%" + "<br><b>Cloudcoverage:</b> " + cloudcoverage + "%<br><br><b>Windspeed:</b> " + windspeedkmh + " km/h<br><b>Wind from direction:</b> " + winddirectionstring + " (" + winddirection + "°)" + "<br><br><font size=" + fontsizesmall );           


    },
    error: function() {
      alert("error receiving wind data from openweathermap");
    }
  });        
});
}

//popup
map.on('click',onMapClick);
