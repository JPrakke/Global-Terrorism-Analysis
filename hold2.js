const makeAssets = year => {
    d3.json(`/api/v1.0/global_terror/${year}`).then((data=>{
        var location = Object.entries(data).forEach(([key, value]) =>{
            let lat = value["latitude"]
            let long = value["longitude"]
            return location[lat, long]
        });

    console.log(location);

        for (var i = 0; i < makeAssets.length; i++){
            var asset = makeAssets[i];
            L.marker(makeAssets)
            .addTo(map)}
    }))
};