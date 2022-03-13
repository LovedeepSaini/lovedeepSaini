//variables
var lat;
var lng;
var border;
let popup;
let country;
let earthQuake = false;


//getting map
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
var markCircles = new L.featureGroup().addTo(map);






//preloader

var loader = document.querySelector(".preloader");

window.addEventListener("load", vanish);

function vanish() {
  loader.classList.add("disppear");
};
//getcurrent location


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  alert('geolocation not supported');
}


  function success(position) {
    setTimeout(function(){
      Swal.fire({
        title: 'Welcome to Gazetteer!',
        html: 'Default location is UK. You can search more locations on map by selecting a country.',
        color:'green',
          background: 'beige',
    
        
        confirmButtonText: 'Ok'
      })
  } , 2000);
  lat=position.coords.latitude;
  lng=position.coords.longitude;
  var currentCountry = new L.LatLng(lat, lng);
  
  var marker = L.marker([lat, lng]).addTo(map);
  
  
  
  
}
function error(msg) {
    alert('error: ' + msg);
  };
  L.control.scale().addTo(map);
  

//easy button
 
  

  

  //adding borders to our map

$('#country-dropdown').on('change', function() {
  let countryCode = $('#country-dropdown').val();
  let countryOptionText= $('#country-dropdown').find('option:selected').text();
   
  
  
  $.ajax({
    url: "libs/php/getGeoJSON.php",
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
            if (result.data.border.features[i].properties.iso_a3 === countryCode) {
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
});

// on map click
map.on('click', function(e) {        
  var popLoc = e.latlng;
  
  $.ajax({
    url: "libs/php/opencage.php",
    type: 'GET',
    dataType: 'json',
    data: {
        lat: popLoc.lat,
        lng: popLoc.lng,
    },

    success: function(result) {

        if (result.data[0].components["ISO_3166-1_alpha-3"]) {
            console.log('openCage PHP',result);
            //console.log(typeof result);
            currentLat = result.data[0].geometry.lat;
            currentLng = result.data[0].geometry.lng;

            
          
            $("country-dropdown select").val(result.data[0].components["ISO_3166-1_alpha-3"]);
            
            let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
            $("#country-dropdown").val(currentCountry).change();
        }
        else {
            
            console.log(result);

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


//weather info popup on click 

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



          
 
//easy button for earthquake data

L.easyButton('<img src="img/map.svg" title="Earthquake">', function(btn, map){
    
  if (!earthQuake) {

      map.setZoom(3);

      $.ajax({
        url: "libs/php/getEarthquakesdata.php",
        type: 'POST',
        dataType: "json",
        

      
        success: function(result) {
       
              console.log( result.earthquakeData.features[0]);
              for (var i = 0; i < result.earthquakeData.features.length; i++) {

                  var quakePosition = result.earthquakeData.features[i].geometry.coordinates;
                  var mag = result.earthquakeData.features[i].properties.mag * 32 * 50;
                  var locDate = new Date(result.earthquakeData.features[i].properties.time).toISOString().slice(0, 19).replace("T", " / ")

                  L.circle([quakePosition[1], quakePosition[0]], {
                      color: 'red',
                      fillColor: 'yellow',
                      fillOpacity: 0.8,
                      radius: mag,
                      stroke: true,
                      weight: 5, 
                  }).addTo(markCircles).bindPopup('<strong>Magnitude: </strong>' + result.earthquakeData.features[i].properties.mag + ' <strong>points.</strong><br>' +
                                          '<strong>Place: </strong>' + result.earthquakeData.features[i].properties.place + '<br>' +
                                          '<strong>Type: </strong>' + result.earthquakeData.features[i].properties.type + '<br>' +
                                          '<strong>Unix Time: </strong>' + result.earthquakeData.features[i].properties.time + '<br>' +
                                          '<strong>Local Date / Time: </strong>' + locDate);        
              }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
          }
      
      });
      earthQuake = true
  } else {
      markCircles.eachLayer(function (layer) {

          markCircles.removeLayer(layer);
      
      });
      earthQuake = false
  }
  
 
}).addTo(map);

