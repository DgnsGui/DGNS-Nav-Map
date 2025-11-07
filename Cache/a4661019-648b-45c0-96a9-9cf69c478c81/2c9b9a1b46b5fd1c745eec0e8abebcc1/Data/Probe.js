function onReceiveNearbyPlaces(isError, places) {
    // Collecter tous les types et catégories uniques
    const types = new Set();
    const categories = new Set();
    
    places.nearbyPlaces.forEach((place) => {
        types.add(place.placeTypeEnum);
        categories.add(place.categoryName);
        
        console.log(`Place: ${place.name}`);
        console.log(`Type: ${place.placeTypeEnum}`);
        console.log(`Category: ${place.categoryName}`);
        console.log('---');
    });
    
    console.log('Types uniques trouvés:', Array.from(types));
    console.log('Catégories uniques trouvées:', Array.from(categories));
}

ApiModule.get_nearby_places(null, null, null, null, onReceiveNearbyPlaces);