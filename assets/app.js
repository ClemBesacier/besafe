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

window.onload = function () {
    console.log('page chargée');
    var mymap = L.map('mapid').setView([44.833363, -0.606922], 16);

    var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
    var mapboxAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    var mapboxToken = 'pk.eyJ1IjoiY2xzcm0iLCJhIjoiY2sxcWUzZzQyMHo1NDNob2lsY3MybGxpbyJ9.gVODmq18ES7LctAexLSiJA';

    var tileStreets = L.tileLayer(mapboxUrl, {
        attribution: mapboxAttr,
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxToken
    });
    tileStreets.addTo(mymap);




    var marker = L.marker([44.833363, -0.606922]).addTo(mymap);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.");

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }

    mymap.on('click', onMapClick);






}