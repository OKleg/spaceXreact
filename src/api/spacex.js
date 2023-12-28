class SpaceX{

    constructor(baseUrl = "https://api.spacexdata.com/v4/") {
        this.baseUrl = baseUrl;
    }

    launches(){
        return fetch(`${this.baseUrl}launches`)
            .then(response=>response.json());
    }

    #convertToGeoJSON(input_json){
        let geo = {
            "type":"FeatureCollection",
            "features":[] 
        };
        for(let i = 0; i < input_json.length; i++){
            geo.features.push({
                "type":"Feature",
                "properties":{
                    "id":input_json[i].id,
                    "name":input_json[i].name
                },
                "geometry":{
                    "type":"Point",
                    "coordinates":[
                        input_json[i].longitude,
                        input_json[i].latitude
                    ]
                }
            });
        }
        return geo;
    }

    launchpads(geo = false){
        return fetch(`${this.baseUrl}launchpads`)
            .then(response=>response.json())
            .then(json => geo ? this.#convertToGeoJSON(json) : json);
    }
    
    

    launchpad(id){
        return fetch(`${this.baseUrl}launchpads/${id}`)
            .then(response=>response.json());
    }

    starlinks(){
        return fetch(`${this.baseUrl}starlink`)
            .then(response=>response.json());
    }
}

export {SpaceX}


