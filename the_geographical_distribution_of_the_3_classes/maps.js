
var geocoder;
var map;
//var infowindow = new google.maps.InfoWindow();
//var location_string;
var cities_dictionary = {};
var cities_levels = {};
var closest_city;

function initialize() {
    geocoder = new google.maps.Geocoder();

    var myStyle = [
        {
            featureType: "administrative",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        },{
            featureType: "administrative.provinces",
            elementType: "labels",
            stylers: [
                { visibility: "on" }
            ]
        },{
            featureType: "administrative.province",
            elementType: "geometry",
            stylers: [
                { color: "#ff0000" }
            ]
        },{
            featureType: "administrative.country",
            elementType: "labels",
            stylers: [
                { visibility: "on" }
            ]
        },{
            featureType: "road.highway",
            elementType: "geometry.province",
            stylers: [
                { visibility: "off" }
            ]
        },{
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        },{
            featureType: "water",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        },{
            featureType: "road",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];


    var latlng = new google.maps.LatLng(26.82641, 30.22986);
    var mapOptions = {
        mapTypeControlOptions: {
            mapTypeIds: ['mystyle', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN]
        },

        mapTypeId: 'mystyle',
        center: latlng,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        zoom: 7
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    map.mapTypes.set('mystyle', new google.maps.StyledMapType(myStyle, { name: 'My Style' }));

    google.maps.event.addListener(map, 'mousemove', function (event) {
        var mouse_lat = event.latLng.lat();
        var mouse_lng = event.latLng.lng();
        var min = 999.0;
        var min_city_name = "";
        for (city in cities_dictionary) {
            var lat = cities_dictionary[city].lat;
            var lng = cities_dictionary[city].lng;

            var distance = Math.sqrt(Math.pow(lat - mouse_lat, 2) + Math.pow(lng - mouse_lng, 2));
            if (distance < min) {
                min = distance;
                min_city_name = city;
            }
        }
        $('#text').text(min_city_name);
        if (min_city_name != "") {
            closest_city = min_city_name;
        }
    });

}

$.getJSON("cities_locations.json", function(json) {
    cities_dictionary = json; // this will show the info it in firebug console
});

$.getJSON("cities_levels.json", function(json) {
    cities_levels = json;
});

/*
function codeLatLng(input) {
    var latlngStr = input.split(',');
    var lat = parseFloat(latlngStr[0]);
    var lng = parseFloat(latlngStr[1]);
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                var hirearchy = results[1].formatted_address.split(',');
                var city = "";
                for (var i =0; i < hirearchy.length; i++) {
                    var level = hirearchy[i];
                    if (level.search("Governorate") != -1){
                        city = level;
                    }
                }
                if (city != "") {
                    if (cities_dictionary[city] == undefined) {
                        cities_dictionary[city] = {'lat' : lat, 'lng' : lng, 'N' : 1}
                    } else {
                        var N = cities_dictionary[city].N;
                        var old_lat = cities_dictionary[city].lat;
                        var old_lng = cities_dictionary[city].lng;

                        var new_lat = new_mean(old_lat, lat, N + 1);
                        var new_lng = new_mean(old_lng, lng, N + 1);

                        cities_dictionary[city].lat = new_lat;
                        cities_dictionary[city].lng = new_lng;
                        cities_dictionary[city].N = N + 1;
                    }
                }
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}
*/

function moveBox(e) {
    if (!e) {
        var e = window.event;
    }
    if (e.pageX || e.pageY){
        cordx = e.pageX;
        cordy = e.pageY;
    }
    else if (e.clientX || e.clientY){
        cordx = e.clientX + 50;
        cordy = e.clientY;
    }
    $('#panel').css('top',  cordy +'px');
    $('#panel').css('left',  cordx +'px');
}

function draw_piechart() {
    if (closest_city[0] == 0) {
        closest_city = closest_city.substr(1, closest_city.length);
    }
    var low, medium, high;
    for (city in cities_levels) {
        if (city == closest_city) {
            low = cities_levels[city].low * 100;
            medium = cities_levels[city].medium * 100;
            high = cities_levels[city].high * 100;
            break;
        }
    }
    var pieData = [
        {
            value: low,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Low"
        },
        {
            value: medium,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Middle"
        },
        {
            value: high,
            color: "#BBBBBB",
            highlight: "#CCCCCC",
            label: "High"
        }
    ];
    $('#canvas-holder #title').text(closest_city);
    $('#chart-area').remove();
    $('#canvas-holder').append('<canvas id="chart-area" width="250" height="250"/>');
    $('#canvas-holder').css('visibility', 'visible');
    var ctx = document.getElementById("chart-area").getContext("2d");
    window.myPie = new Chart(ctx).Pie(pieData);
}

function new_mean(old_mean, new_data, i) {
    return (new_data / i) + (old_mean * (i-1)) / i;
}

function show_dictionary() {
    console.log(JSON.stringify(cities_dictionary));
}

google.maps.event.addDomListener(window, 'load', initialize);
