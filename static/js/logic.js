var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup(
        "<h3>" + feature.properties.place + "<br>" + "Magnitude: " 
        + feature.properties.mag + "</h3>" 
        + "<hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function calcRadius(attributeValue) {
		var scaleFactor = 16;
		var area = attributeValue * scaleFactor;
		return Math.sqrt(area/Math.PI)*2;			
    }
  
    function chooseColor(attributeValue){
        if (attributeValue >= 4.5){
            return "#006400";
        } else if (attributeValue >= 2.5 && attributeValue < 4.5) {
            return "#00c800";
        } else if (attributeValue >= 1.0 && attributeValue < 2.5) {
            return "#ffa500";
        } else {
            return "#ffff00";
        }
    }

    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        var mag = feature.properties.mag;
        return L.circleMarker(latlng, {
            radius: calcRadius(mag),
            fillColor: chooseColor(mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
            });
        }
    });
  
    createMap(earthquakes);

}

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: "pk.eyJ1IjoiamFuY2FzdGlsbG8iLCJhIjoiY2swcmIxZ2IwMDJobDNnbDZ0ZG9qMG9pZyJ9.-RNCvu2cvDLmH5gmMghURg"
    });
  
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: "pk.eyJ1IjoiamFuY2FzdGlsbG8iLCJhIjoiY2swcmIxZ2IwMDJobDNnbDZ0ZG9qMG9pZyJ9.-RNCvu2cvDLmH5gmMghURg"
    });
  
    var baseMaps = {
      "Street Map": streetmap,
      "Satellite Map": satellitemap
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [30.482414, 18.550560],
      zoom: 2,
      layers: [streetmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var magnitudes = ["+4.5", "+2.5", "+1.0", "<1.0"];
      var colors = ["#006400", "#00c800", "#ffa500", "#ffff00"];
      var labels = [];

      magnitudes.forEach(function(mag, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">" + magnitudes[index] + "</li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    legend.addTo(myMap);  

}
