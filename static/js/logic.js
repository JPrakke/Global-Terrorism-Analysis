const makeMap = attacks=>{

    const lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        minZoom: 1.25,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    const satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    const outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
    const baseMap = {
        "Gray Map": lightMap,
        "Satelite Map": satMap,
        "Street Map": outdoorMap
    };

    const overlay ={
        "Firearms":weapon
    }

    const map = L.map("map", {
        center: [0,0],
        zoom: 1.3,
        layers: [lightMap, attacks]
    });



    var url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";

    d3.json(url, function(response) {

    console.log(response);

    var heatArray = [];

    for (var i = 0; i < response.length; i++) {
        var location = response[i].location;

        if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
         }
    }

    var heat = L.heatLayer(heatArray, {
        adius: 20,
        blur: 35
        }).addTo(map);

    });

};

const makeAssets = atkData=>{
    
};