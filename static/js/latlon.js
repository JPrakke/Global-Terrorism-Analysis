console.log("Scripit Initializing..");

const makeMap = latLon=>{
    
    const satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });
    
    const baseMap = {
        "Satelite Map": satMap
    };

    const overlay = {
        "latLons":latLon
    };

    const map = L.map("map",{
        center:[0,0],
        zoom: 2,
        layers: [satMap,latLon]
    });
    
    L.control.layers(baseMap,overlay,{
        collapsed: false
    }).addTo(map);
  
    const legend = L.control({position: "bottomright"});
    legend.onAdd = map => {
        let div = L.DomUtil.create("div", "legend"),
        mag = [0, 1, 2, 3, 4, 5];
        div.innerHTML +="<p>Magnitude</p>"
        
        for (i=0;i<mag.length;i++){
            div.innerHTML += '<i style="background:' + magColor(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }

    return div;
    };
    legend.addTo(map);
};

const makeAssets = gtData=>{
    const makeMarker = (feature, loc)=>{
        let radius = feature.properties.mag;
        const circleAttributes = {
            fillOpacity: 0.5,
            weight: 0.5,
            stroke: true,
            radius: radius*2.5,
            color: magColor(radius),
            fillColor: magColor(radius)
        };
        return L.circleMarker(loc,circleAttributes); 
    };
    const toolTip = (feature, layer)=>{
        let mag = feature.properties.mag;
        let loc = feature.properties.place;
        layer.bindPopup(`<h2>${loc}</h2><hr><h3>Magnitude: ${mag}</h3>`)
    }
    const llTool = L.geoJSON(gtData,{
        pointToLayer: makeMarker,
        onEachFeature: toolTip
    });

    makeMap(latLons)
};

const makeAssets2= (year, weaponType) => {
    d3.json(`/api/v1.0/global_terror/${year}/${weaponType}`, function (data) {
        makeAssets(data)
    });
};

console.log("Script Complete");