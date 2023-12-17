document.addEventListener('DOMContentLoaded', function () {
    var macarte = null;

    function initMap() {
        macarte = L.map('map').setView([46.603354, 1.888334], 6); // Centrez la carte sur la France

        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
            minZoom: 1,
            maxZoom: 20
        }).addTo(macarte);

        fetch('https://schema.data.gouv.fr/schemas/etalab/schema-lieux-covoiturage/0.2.8/schema.json') // Remplacez l'URL par celle de votre API
            .then(response => response.json())
            .then(data => {
                // Parcours des données de l'API et ajout des marqueurs sur la carte
                data.features.forEach(lieu => {
                    var marker = L.marker([lieu.geometry.coordinates[1], lieu.geometry.coordinates[0]])
                        .addTo(macarte);
                    marker.bindPopup(lieu.properties.nom_station);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des données de l\'API :', error));
    }

    initMap();
});
