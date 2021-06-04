import './styles/app.scss';

import './bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
bsCustomFileInput.init();


// Init map
mapboxgl.accessToken = 'pk.eyJ1IjoiY2xzcm0iLCJhIjoiY2ttcnVvMjF6MGJpOTJvcG1xcnhwcTl2cyJ9.SS99A4Grt_tcHfIbpDYEiQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-0.6485436, 44.8247036], // starting position [lng, lat]
    zoom: 12 // starting zoom
});

// Global vars
var long;
var lat;

// Handle marker click event
function onMarkerClick(e) {
    // Get coordinates
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Calc coordinates
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Inject popup on map
    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
}



//-----------------------------//
//----- Start pulsing dot -----//
//-----------------------------//

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

map.on('load', function () {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
});

//-----------------------------//
//------ End pulsing dot ------//
//-----------------------------//




// Get my position
function maPosition(position) {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    map.flyTo({
        center: [
            position.coords.longitude,
            position.coords.latitude,
        ],
    });

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

    // Handle marker click
    map.on('click', 'places', onMarkerClick);

    // Handle marker mouse enter
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Handle marker mouse leave
    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
    });

}


// Get random position X
function positionX(pos) {
    long = Math.random() * 0.1 - 0.1 / 2 + pos.coords.longitude;
    lat = Math.random() * 0.1 - 0.1 / 2 + pos.coords.latitude;

    map.addSource('mysourceX', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<div class="name">Juliette</div><div class="dest">Destination : Mérignac Centre</div><strong>Passagère</p><a class="numero" href="tel:+33667528803" target="_blank" title="Opens in a new window">Me contacter</a>',
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
        'id': 'placesX',
        'type': 'symbol',
        'source': 'mysourceX',
        'layout': {
            'icon-image': 'pulsing-dot',
            'icon-allow-overlap': true
        }
    });

    map.on('click', 'placesX', onMarkerClick);

    map.on('mouseenter', 'placesX', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'placesX', function () {
        map.getCanvas().style.cursor = '';
    });
}

// Get random position Y
function positionY(pos) {
    long = Math.random() * 0.1 - 0.1 / 2 + pos.coords.longitude;
    lat = Math.random() * 0.1 - 0.1 / 2 + pos.coords.latitude;

    map.addSource('poi', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<div class="name">Manon</div><div class="dest">Destination : Pessac</div><strong>Passagère</p><a class="numero" href="tel:+33667528803" target="_blank" title="Opens in a new window">Me contacter</a>',
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
        'id': 'placesY',
        'type': 'symbol',
        'source': 'poi',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });


    map.on('click', 'placesY', onMarkerClick);

    map.on('mouseenter', 'placesY', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'placesY', function () {
        map.getCanvas().style.cursor = '';
    });
}


// Get random position Z
function positionZ(pos) {
    long = Math.random() * 0.1 - 0.1 / 2 + pos.coords.longitude;
    lat = pos.coords.latitude;

    map.addSource('poin', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<div class="name">Jeanne</div><div class="dest">Destination : Bordeaux Caudéran</div><strong>Passagère</p><a class="numero" href="tel:+33667528803" target="_blank" title="Opens in a new window">Me contacter</a>',
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
        'id': 'placesZ',
        'type': 'symbol',
        'source': 'poin',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });

    map.on('click', 'placesZ', onMarkerClick);

    map.on('mouseenter', 'placesZ', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'placesZ', function () {
        map.getCanvas().style.cursor = '';
    });
}

// Get random position 
function positionRandom(pos) {
    long = Math.random() * 0.1 - 0.1 / 2 + pos.coords.longitude;
    lat = pos.coords.latitude;

    map.addSource('placesSource', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<div class="name">Géraldine</div><div class="dest">Destination : Bordeaux Centre</div><strong>Passagère</p><a class="numero" href="tel:+33667528803" target="_blank" title="Opens in a new window">Me contacter</a>',
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
        'id': 'placesR',
        'type': 'symbol',
        'source': 'placesSource',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });

    map.on('click', 'placesR', onMarkerClick);

    map.on('mouseenter', 'placesR', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'placesR', function () {
        map.getCanvas().style.cursor = '';
    });
}


// Wait map load events
map.on('load', function () {
    // Can use geolocation navigator
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(maPosition);

        // Defer callback
        function defer(cb) {
            setTimeout(() => {
                cb();
            }, 500);
        }

        defer(() => {
            navigator.geolocation.getCurrentPosition(positionX);
            defer(() => {
                navigator.geolocation.getCurrentPosition(positionY);
            });
            defer(() => {
                navigator.geolocation.getCurrentPosition(positionZ);
            });
            defer(() => {
                navigator.geolocation.getCurrentPosition(positionRandom);
            });
        });
    } else {
        // geolocalisation non supportée
        alert('Désolée votre navigateur ne vous permet pas d\'être géolocalisés');
    }
});
