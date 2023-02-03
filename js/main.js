let monToken = 'pk.eyJ1IjoiZmxvcmlhbi1mbG9jb24iLCJhIjoiY2tldjJ1a3A5NDB1ZTJzcGNpOGJ1OTRxcSJ9.kFHGE_fRa8nxG2UN7DAaNA';

// valeur par defaut a l'affichage.
let mymap = {
    lat : 48.952,
    lng : 2.501,
}

let markers;
let div = document.querySelector('#mapid')

let submit = document.querySelector("#submit");
let search = document.querySelector('#search');

//si mon navigateur supporte la géoloc?
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)
            let coords = { lat : position.coords.latitude , lng : position.coords.longitude};  
           
            createMap(coords.lat, coords.lng)
           
           /* setTimeout(() => {
                
                let input = document.querySelector('#search')
                input.classList.remove('hide')
                input.style.transition = '.5s ease-in-out'
            },1000)*/
            search.classList.remove("hide")
            submit.addEventListener("click", (e)=>{
                e.preventDefault()
                getBusinessNearMyPosition(coords.lat, coords.lng)
                
            })
        });
        
    }else {
        div.innerHTML = "<p>la localisation n'est pas supporté sur votre navigateur</p>";
    }

function createMap(lat, lng) {
    
    //on définit le centre géographique et le zoom de la map.
    mymap = L.map("mapid").setView([lat, lng], 13)
    //regroupe les markers (calque) et en fait qu'un seul puis on ajoute à la map (LayerGroup)
    markers = L.layerGroup().addTo(mymap)
    //on charge la map et ses propriétés (ne pas oublier la clé d'accés) via l'api mapbox puis on ajoute à la map(voir tileLayer dans leaflet)
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: monToken,
    }).addTo(mymap);
    
    // =============================================================
    var circle = L.circle([lat, lng],{
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
    }).addTo(mymap);
    
    let myIcon = L.icon({
        iconUrl: 'img/bluecircle.png',
        iconSize: [15, 15]
    })
    
    let popup = L.popup()
    .setLatLng([lat, lng])
    .setContent('<p>Domicile</p>')
    .openOn(mymap);
    
     //on crée notre marker de position avec son icon et on ajoute à la map. (L.marker)
     let marker = L.marker([lat, lng], {icon : myIcon}).addTo(mymap)

    // =============================================================
}

//fonction de récupération des boutiques
function getBusinessNearMyPosition(lat, lng) {

    //on récupère la valeur entrée dans le formulaire
    let form = document.querySelector("#business").value
    //on efface les anciens markers (voir leaflet)
    markers.clearLayers()
    //requète API vers openstreetmap en lui passant la valeur rentrée ainsi que la position (voir API openstreetmap)
    fetch(`https://nominatim.openstreetmap.org/search?q=${form} ${lat},${lng}&format=geocodejson`)
    .then(response => response.json()) 
    .then((response)=> {
        
        
        console.log(response.features)
        
        for(let i = 0; i < response.features.length; i++){//on fait une boucle pour afficher toutes les places renvoyé en réponse (boucle for ou .map ES6 ou forEach)
    
           
            //création du marker en fonction des coordonnées de la boutique (voi)
            let marker = L.marker([response.features[i].geometry.coordinates[1],response.features[i].geometry.coordinates[0]]).addTo(mymap)
            //on stock dans une variable ce qu'on va afficher dans la popup (contenu html)
            let popup = L.popup()
            .setLatLng([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]])
            .setContent(`${form}`)
            .openOn(mymap);
            
           markers.addLayer(marker)
            
        }         
            

            //création de la popup sur le marker (en envoyant le html)
            
             //ajout du marker à la map (addLayer)
    }) 
    .catch(err=>console.log(err))   
}