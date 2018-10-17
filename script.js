/* global L, Mustache */

var mapOptions = {
  minZoom: 2.45, 
  maxZoom: 18,
  zoomControl: false, 
  attributeControl: false,
}

var map = L.map('map', mapOptions).setView([8.9806, 75.00], 0);
var lastOrigin;
var consumption = L.geoJson() 

// Add base layer

// Add Mustache template
var popupTemplate = document.querySelector('.popup-template').innerHTML;

function getColor(c) {
  return c < -65 ? '#d73027' :
         c < -28 ? '#fc8d59' :
         c < -13 ? '#fee08b' : 
         c < 15 ? '#ffffbf' : 
         c < 36 ? '#d9ef8b' :
         c < 178 ? '#91cf60' :
                   '#1a9850';
}

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  minZoom: 2,
  maxZoom: 18, 
  zoomControl: false, 
  attributionControl: false,
}).addTo(map);


// Adding Per Capita Consumption Data

fetch('https://cdn.glitch.com/74f074b0-aac6-45cd-8ad6-7be45ed1840e%2Fper_capita_consumption.geojson?1539549707761')
  .then(function (response) {
    // Read data as JSON
    return response.json();
  })
  .then(function (data) {
    console.log(data)
  
    function style(feature) {   
      return {
        fillColor: getColor(feature.properties.change),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }
  
    // Create the Leaflet layer for the data 
    var consumption = L.geoJson(data, {
      // Un-comment these styles to hide this layer but leave it clickable
      /*
      style: {
        stroke: true,
        fillOpacity: 1
      },
      */
      style: style,
    
      onEachFeature: function (feature, layer) {
        layer.on('click', function () {
          lastOrigin = layer.feature.properties['country']
          
      /* want to add my drop down here      
    else {
      var originPicker = document.querySelector('.origin-picker');
      
      originPicker.addEventListener('change', function () {
        loadData(originPicker.value);
});
*/
      
      //mustache sidebar
      var sidebarContentArea = document.querySelector('.origin-content');
            console.log(sidebarContentArea);
            sidebarContentArea.innerHTML = Mustache.render(popupTemplate, layer.feature.properties);
          

        });
      }
  

    }).addTo(map);

    console.log(consumption);
  
  });

//here I want to add my legend 
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-100, -65, -28, -13, 15, 36, 178, 454],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


/*
var yearPicker = document.querySelector('.year-picker');
  yearPicker.addEventListener('change', function () {
  loadData(yearPicker.value);
});



//add time slider
/*
var coffeeOrigins=L.geoJson();
var sliderControl = L.control.sliderControl({position: "bottomleft", layer: coffeeOrigins});

//add the slider to the map 
map.addControl(sliderControl);

//And initialize the slider
sliderControl.startSlider();
*/      
      