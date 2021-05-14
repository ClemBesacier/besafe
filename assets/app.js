/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';

// start the Stimulus application
import './bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
bsCustomFileInput.init();

// console.log('Hello Webpack Encore! Edit me in assets/app.js');

// window.onload = function () {
//     console.log('page chargée');
//     var mymap = L.map('mapid').setView([44.833363, -0.606922], 16);

//     var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
//     var mapboxAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
//     var mapboxToken = 'pk.eyJ1IjoiY2xzcm0iLCJhIjoiY2sxcWUzZzQyMHo1NDNob2lsY3MybGxpbyJ9.gVODmq18ES7LctAexLSiJA';

//     var tileStreets = L.tileLayer(mapboxUrl, {
//         attribution: mapboxAttr,
//         maxZoom: 18,
//         id: 'mapbox/streets-v11',
//         tileSize: 512,
//         zoomOffset: -1,
//         accessToken: mapboxToken
//     });
//     tileStreets.addTo(mymap);




//     var marker = L.marker([44.833363, -0.606922]).addTo(mymap);
//     marker.bindPopup("<b>Hello world!</b><br>I am a popup.");

//     var popup = L.popup();

//     function onMapClick(e) {
//         popup
//             .setLatLng(e.latlng)
//             .setContent("You clicked the map at " + e.latlng.toString())
//             .openOn(mymap);
//     }

//     mymap.on('click', onMapClick);






// }


mapboxgl.accessToken = 'pk.eyJ1IjoiY2xzcm0iLCJhIjoiY2ttcnVvMjF6MGJpOTJvcG1xcnhwcTl2cyJ9.SS99A4Grt_tcHfIbpDYEiQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-0.6485436, 44.8247036], // starting position [lng, lat]
    zoom: 13 // starting zoom
});

var long;
var lat;

//----- Début pulsing dot -----//

var size = 200;

// implementation of CustomLayerInterface to draw a pulsing dot icon on the map
// see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
var pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // get rendering context for the map canvas when layer is added to the map
    onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    // called once before every frame where the icon will be used
    render: function () {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'rgba(150, 24, 153,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'rgba(150, 24, 153, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
    }
};

//----- Fin pulsing dot -----//

map.on('load', function () {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
});



function maPosition(position) {
    // var infopos = "Position déterminée :\n";
    // infopos += "Latitude : " + position.coords.latitude + "\n";
    // infopos += "Longitude: " + position.coords.longitude + "\n";
    // document.getElementById("infoposition").innerHTML = infopos;
    // console.log(position.coords.longitude)
    // console.log(position.coords.latitude)
    long = position.coords.longitude;
    lat = position.coords.latitude;
    console.log(long, lat);
    map.addSource('mysource', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<div class="name">Clémentine</div><div class="dest">Destination : Mérignac</div><strong>Conducteu.rice</p><a class="numero" href="tel:+33667528803" target="_blank" title="Opens in a new window">Me contacter</a>',
                        'icon': 'car'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [long, lat]
                    }
                }
            ]
        }
    });
    map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'mysource',
        'layout': {
            'icon-image': 'pulsing-dot',
            'icon-allow-overlap': true
        }
    });
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'mysource',
        'layout': {
            'icon-image': '{icon}-15',
            'icon-allow-overlap': true
        }
    });
    map.on('click', 'places', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
    });

}

function positionX(pos) {
    // var infopos = "Position déterminée :\n";
    // infopos += "Latitude : " + position.coords.latitude + "\n";
    // infopos += "Longitude: " + position.coords.longitude + "\n";
    // document.getElementById("infoposition").innerHTML = infopos;
    // console.log(position.coords.longitude)
    // console.log(position.coords.latitude)
    // let i = 0;
    // while (i < 7) {

    long = pos.coords.longitude;
    lat = Math.random() * 0.1 - 0.1 / 2 + pos.coords.latitude;
    console.log(long, lat);
    //     i++;
    // }
    map.addSource('mysourceX', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Clémentine</strong><p><a href="tel:+33667528803" target="_blank" title="Opens in a new window">Numéro de téléphone</a> <strong>Destination:</strong>Mérignac</br><strong>Conducteu.rice</p>',
                        'icon': 'pitch'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [long, lat]
                    }
                }
            ]
        }
    });

    map.addLayer({
        'id': 'po',
        'type': 'symbol',
        'source': 'mysourceX',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });
    // map.addLayer({
    //     'id': 'place',
    //     'type': 'symbol',
    //     'source': 'mysourceX',
    //     'layout': {
    //         'icon-image': '{icon}-15',
    //         'icon-allow-overlap': true
    //     }
    // });
    // map.on('click', 'place', function (e) {
    //     var coordinates = e.features[0].geometry.coordinates.slice();
    //     var description = e.features[0].properties.description;

    //     // Ensure that if the map is zoomed out such that multiple
    //     // copies of the feature are visible, the popup appears
    //     // over the copy being pointed to.
    //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //     }

    //     new mapboxgl.Popup()
    //         .setLngLat(coordinates)
    //         .setHTML(description)
    //         .addTo(map);
    // });
    // map.on('mouseenter', 'place', function () {
    //     map.getCanvas().style.cursor = 'pointer';
    // });

    // // Change it back to a pointer when it leaves.
    // map.on('mouseleave', 'place', function () {
    //     map.getCanvas().style.cursor = '';
    // });
}

function positionY(pos) {
    // var infopos = "Position déterminée :\n";
    // infopos += "Latitude : " + position.coords.latitude + "\n";
    // infopos += "Longitude: " + position.coords.longitude + "\n";
    // document.getElementById("infoposition").innerHTML = infopos;
    // console.log(position.coords.longitude)
    // console.log(position.coords.latitude)
    // let i = 0;
    // while (i < 7) {

    long = Math.random() * 0.1 - 0.1 / 2 + pos.coords.longitude;
    lat = pos.coords.latitude;
    console.log(long, lat);
    //     i++;
    // }
    map.addSource('poi', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Manon</strong><p><a href="tel:+33667528803" target="_blank" title="Opens in a new window">Numéro de téléphone</a> <strong>Destination:</strong>Mérignac</br><strong>Conducteu.rice</p>',
                        'icon': 'theatre'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [long, lat]
                    }
                }
            ]
        }
    });

    map.addLayer({
        'id': 'poi',
        'type': 'symbol',
        'source': 'poi',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });
}

function positionZ(pos) {
    // var infopos = "Position déterminée :\n";
    // infopos += "Latitude : " + position.coords.latitude + "\n";
    // infopos += "Longitude: " + position.coords.longitude + "\n";
    // document.getElementById("infoposition").innerHTML = infopos;
    // console.log(position.coords.longitude)
    // console.log(position.coords.latitude)
    // let i = 0;
    // while (i < 7) {

    long = Math.random() * 0.1 - 0.1 / 2 + pos.coords.longitude;
    lat = pos.coords.latitude;
    console.log(long, lat);
    //     i++;
    // }
    map.addSource('poin', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Juliette</strong><p><a href="tel:+33667528803" target="_blank" title="Opens in a new window">Numéro de téléphone</a> <strong>Destination:</strong>Mérignac</br><strong>Conducteu.rice</p>',
                        'icon': 'theatre'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [long, lat]
                    }
                }
            ]
        }
    });

    map.addLayer({
        'id': 'poin',
        'type': 'symbol',
        'source': 'poin',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });
}

function positionRandom(pos) {
    // var infopos = "Position déterminée :\n";
    // infopos += "Latitude : " + position.coords.latitude + "\n";
    // infopos += "Longitude: " + position.coords.longitude + "\n";
    // document.getElementById("infoposition").innerHTML = infopos;
    // console.log(position.coords.longitude)
    // console.log(position.coords.latitude)
    // let i = 0;
    // while (i < 7) {

    long = Math.random() * 0.1 - 0.1 / 2 + pos.coords.longitude;
    lat = pos.coords.latitude;
    console.log(long, lat);
    //     i++;
    // }
    map.addSource('mypoint', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Jeanne</strong><p><a href="tel:+33667528803" target="_blank" title="Opens in a new window">Numéro de téléphone</a> <strong>Destination:</strong>Mérignac</br><strong>Conducteu.rice</p>',
                        'icon': 'theatre'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [long, lat]
                    }
                }
            ]
        }
    });

    map.addLayer({
        'id': 'mypoint',
        'type': 'symbol',
        'source': 'mypoint',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });
}


if (navigator.geolocation) {
    // geolocalisation supportée
    // navigator.geolocation.getCurrentPosition(longitudeGeoloc, console.error);
    navigator.geolocation.getCurrentPosition(maPosition);
    navigator.geolocation.getCurrentPosition(positionX);
    navigator.geolocation.getCurrentPosition(positionY);
    navigator.geolocation.getCurrentPosition(positionZ);
    navigator.geolocation.getCurrentPosition(positionRandom);

    console.log("maPosition");
} else {
    // geolocalisation non supportée
    alert('Désolée votre navigateur ne vous permet pas d\'être géolocalisés');
}
