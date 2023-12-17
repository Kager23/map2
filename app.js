document.addEventListener('DOMContentLoaded', function () {
    var macarte = null;
    var markers = [];

    function initMap() {
        macarte = L.map('map').setView([46.603354, 1.888334], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
            minZoom: 1,
            maxZoom: 20
        }).addTo(macarte);
    }

    window.onload = function () {
        initMap();
        document.getElementById('searchButton').addEventListener('click', searchCity);
        loadChargingStations(); // Chargez les bornes de recharge lors du chargement de la page
    };

    function loadChargingStations() {
        // Endpoint de l'API IRVE
        var endpoint = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=fichier-consolide-des-bornes-de-recharge-pour-vehicules-electriques';
        
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (data.records && Array.isArray(data.records) && data.records.length > 0) {
                    data.records.forEach(record => {
                        var station = record.fields;
                        var stationCoords = [station.y_latitude, station.x_longitude];
                        var marker = L.marker(stationCoords).addTo(macarte);
                        marker.bindPopup(`<b>${station.nom}</b><br/>${station.adresse}`);
                        markers.push(marker);
                    });
                } else {
                    console.error('Aucune borne de recharge trouvée.');
                }
            })
            .catch(error => console.error('Erreur lors du chargement des bornes de recharge :', error));
    }

    function searchCity() {
        var city = document.getElementById('searchInput').value;

        markers.forEach(marker => macarte.removeLayer(marker));
        markers = [];

        fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}&type=municipality&limit=1&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data.features && Array.isArray(data.features) && data.features.length > 0) {
                    var result = data.features[0];
                    var cityCoords = result.geometry.coordinates.reverse();
                    macarte.setView(cityCoords, 14);
                    var marker = L.marker(cityCoords).addTo(macarte);
                    marker.bindPopup(result.properties.label);
                    markers.push(marker);
                } else {
                    alert('Aucune ville trouvée.');
                }
            })
            .catch(error => console.error('Erreur lors de la recherche de la ville :', error));
    }
});
