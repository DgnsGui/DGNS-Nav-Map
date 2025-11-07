// Fonction pour collecter tous les types de places
function onReceiveNearbyPlaces(isError, places) {
    if (isError) {
        print("Erreur lors de la récupération des places: " + isError);
        return;
    }
    
    if (!places || !places.nearbyPlaces) {
        print("Aucune place trouvée");
        return;
    }
    
    // Collecter tous les types et catégories uniques
    const types = new Set();
    const categories = new Set();
    
    print("=== PLACES TROUVÉES ===");
    
    places.nearbyPlaces.forEach((place, index) => {
        types.add(place.placeTypeEnum);
        categories.add(place.categoryName);
        
        print(`${index + 1}. ${place.name}`);
        print(`   Type: ${place.placeTypeEnum}`);
        print(`   Catégorie: ${place.categoryName}`);
        print(`   Sous-titre: ${place.subtitle}`);
        print(`   ID: ${place.placeId}`);
        print("   ---");
    });
    
    print("\n=== RÉSUMÉ ===");
    print("Types uniques trouvés:");
    Array.from(types).forEach(type => print(`- ${type}`));
    
    print("\nCatégories uniques trouvées:");
    Array.from(categories).forEach(category => print(`- ${category}`));
}

// Lancer la recherche avec une limite élevée pour plus de diversité
ApiModule.get_nearby_places(
    null,  // lat (automatique)
    null,  // lng (automatique)
    null,  // gps_accuracy_m (défaut: 65)
    50,    // places_limit (augmenté pour plus de résultats)
    onReceiveNearbyPlaces
);