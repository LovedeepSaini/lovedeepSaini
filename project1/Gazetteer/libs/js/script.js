var border;
var currentLat;
var currentLng;
let lat;
let lng;
var popup;
function Country(name, iso_a2, iso_a3, iso_n3, geoType, coordinates){
    this.name = name;
    this.iso_a2 = iso_a2;
    this.iso_a3 = iso_a3;
    this.iso_n3 = iso_n3;
    this.coordinates = coordinates;
    this.geoType = geoType;
    this.lat;
    this.lng;
    
    // Modal 1 - Country Info
    this.flag;
    this.capitalCity;
    this.timezone;
    this.timeOffset;
    this.population;
    this.area;
    this.languages;
    this.currencyCode;
    this.currencyName;
    this.currencySymbol;
    this.exchangeRate;
    this.topLevelDomain;
    this.callingCode;
    this.currentCountry;
    this.weather_current = [];
}

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
        
        $("#country-dropdown").append(`<option value="${iterator.iso_a3}">${iterator.name}</option>`)
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
              
         
            $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-3"]);
            
            let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
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
  
          if (result.data[0].components["ISO_3166-1_alpha-3"]) {
              console.log('openCage PHP',result);
              //console.log(typeof result);
              currentLat = result.data[0].geometry.lat;
              currentLng = result.data[0].geometry.lng;
  
              
              // L.marker([currentLat, currentLng], {icon: customIconOrange}).addTo(map).bindPopup("You clicked in: " + result.data[0].components.country);
  
              $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-3"]);
              
              let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
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
   
   //country api data    
  
              $.ajax({
                url: "libs/php/gwtCountryInfo.php",
                type: 'POST',
                dataType: 'json',
                data: {
                  country: $('#country-dropdown').val(),
                
                },
                success: function(result) {
                 
                 
                  console.log(JSON.stringify(result));
                   
                  
            
                  if (result.status.name == "ok") {
            
                   
                    $('#txtCapital').html(result.data[0].capital);
                    $('#txtLanguages').html(result.data[0].languages);
                    $('#txtPopulation').html(result.data[0].population);
                    $('#txtArea').html(result.data[0].areaInSqKm);
                 
                    $('#txtcurrencycode').html(result.data[0].currencyCode);
            
            
              
            }
                  
                  
        },
        error: function(jqXHR, textStatus, errorThrown) {
          // your error code
        }
      });
    
      $.ajax({
        url: "libs/php/restCountries.php",
        type: 'POST',
        
        data: {
            country: $('#country-dropdown').val()   
        },
        success: function(result) {
          
          console.log(JSON.stringify(result));
          
            if (result.status.name == "ok") {
                currencyCode = result.currency.code;
                capitalCityWeather= result.data.capital.toLowerCase();
                iso3CountryCode = result.data.alpha3Code;
                var countryName2 = result.data.name;
                countryName = countryName2.replace(/\s+/g, '_');
                
                $('#txtName').html(result['data'][0]['name']+ '<br>');
                $('#txtCurrency').html('<strong> ' + result.data.currency.name + '</strong><br>');
                $('#txtCurrencyCode').html('Code: <strong>' + result.data.currency.code + '</strong><br>');
    }
        
        
  },
  error: function(jqXHR, textStatus, errorThrown) {
    // your error code
  }
});
  
    
// Wikipedia
 

  
 
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


//news data
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
//get weather

  $.ajax({
      url: "libs/php/getWeather.php",
      type: 'GET',
      dataType: 'json',
      data: {
          lat:lat,
          lng:lng,
      },
      success: function(result) {
                      
          if (result.status.name == "ok") {

              country.weather_current.push(result['data']['current']['temp'] - 273.15,
              result['data']['current']['feels_like'] - 273.15,
              result['data']['current']['weather']['0']['main'],
              result['data']['current']['weather']['0']['icon']);

              
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log(JSON.stringify(jqXHR));
          console.log(JSON.stringify(textStatus));
          console.log(JSON.stringify(errorThrown));
      }
  }); 




          
         