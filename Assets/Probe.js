//@input Component.ScriptComponent mapComponent

function onStart() {
    // Attendre que le map component soit initialisé
    script.mapComponent.subscribeOnInitialLocationSet(() => {
        print("Map initialisée, recherche de tous les types de places...");
        exploreAllPlaceTypes();
    });
}

function exploreAllPlaceTypes() {
    const typesFound = new Set();
    const categoriesFound = new Set();
    
    // Fonction callback pour traiter les nouveaux pins ajoutés
    script.mapComponent.subscribeOnMapAddPin((pin) => {
        if (pin.placeInfo) {
            // Collecter les informations sur le type de place
            if (pin.placeInfo.categoryName) {
                categoriesFound.add(pin.placeInfo.categoryName);
            }
            if (pin.placeInfo.placeType) {
                typesFound.add(pin.placeInfo.placeType);
            }
            
            print(`Place ajoutée: ${pin.placeInfo.name}`);
            print(`  - Catégorie: ${pin.placeInfo.categoryName}`);
            print(`  - Type: ${pin.placeInfo.placeType || "Non défini"}`);
            print("---");
        }
    });
    
    // Rechercher différents types de places
    // Essayer avec un tableau vide pour obtenir tous les types
    script.mapComponent.showNeaybyPlaces([]);
    
    // Attendre un peu puis afficher le résumé
    script.createEvent("DelayedCallbackEvent").bind(() => {
        print("\n=== RÉSUMÉ COMPLET ===");
        print("Catégories trouvées:");
        Array.from(categoriesFound).forEach(category => {
            print(`- ${category}`);
        });
        
        print("\nTypes trouvés:");
        Array.from(typesFound).forEach(type => {
            print(`- ${type}`);
        });
    }).delay = 3.0; // Attendre 3 secondes
}

// Fonction pour tester des catégories spécifiques
function testSpecificCategories() {
    const categoriesToTest = [
        "restaurant",
        "cafe", 
        "store",
        "gas_station",
        "bank",
        "hospital",
        "park",
        "school",
        "hotel",
        "shopping_mall"
    ];
    
    categoriesToTest.forEach((category, index) => {
        script.createEvent("DelayedCallbackEvent").bind(() => {
            print(`\nTest de la catégorie: ${category}`);
            script.mapComponent.removeMapPins(); // Nettoyer les pins précédents
            script.mapComponent.showNeaybyPlaces([category]);
        }).delay = index * 4.0; // Espacer les tests de 4 secondes
    });
}

// Démarrer l'exploration
onStart();

// Optionnel : tester des catégories spécifiques après 10 secondes
script.createEvent("DelayedCallbackEvent").bind(testSpecificCategories).delay = 10.0;