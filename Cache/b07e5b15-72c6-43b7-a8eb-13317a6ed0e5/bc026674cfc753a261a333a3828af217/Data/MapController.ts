// ----- MapController.ts -----
// Compatible avec Lens Studio 5.10
// Gère l'affichage d'une mini-carte AR avec position et orientation utilisateur

//@input Component.ObjectTrackingComponent trackingComponent
//@input SceneObject mapPlane
//@input SceneObject userMarker
//@input Asset.Material mapMaterial
//@input float mapScale = 1.0
//@input bool debug = false

// -----------------------------------------------------------
// Sécurité : Vérification des entrées
// -----------------------------------------------------------
if (!script.trackingComponent || !script.mapPlane || !script.userMarker) {
    print("❌ MapController: Entrée(s) manquante(s)");
    return;
}

var tracking = script.trackingComponent;
var mapPlane = script.mapPlane;
var userMarker = script.userMarker;
var mapMat = script.mapMaterial;
var mapScale = script.mapScale;

// Position de base pour le centrage de la map
var baseWorldPos = new vec3(0, 0, 0);

// -----------------------------------------------------------
// Initialisation
// -----------------------------------------------------------
function initialize() {
    if (tracking && tracking.getTransform()) {
        baseWorldPos = tracking.getTransform().getWorldPosition();
        if (script.debug) print("📍 Base position initialisée :", baseWorldPos);
    }

    // On scale la map
    mapPlane.getTransform().setLocalScale(new vec3(mapScale, mapScale, mapScale));

    // Mise à jour à chaque frame
    script.createEvent("UpdateEvent").bind(onUpdate);
}

// -----------------------------------------------------------
// Fonction de mise à jour
// -----------------------------------------------------------
function onUpdate() {
    var transform = tracking.getTransform();
    if (!transform) return;

    // Récupération de la position et rotation utilisateur
    var worldPos = transform.getWorldPosition();
    var worldRot = transform.getWorldRotation();

    // Calcul du déplacement relatif
    var relative = worldPos.sub(baseWorldPos);

    // Application sur la map (translation + rotation)
    var mapTransform = mapPlane.getTransform();
    mapTransform.setWorldPosition(baseWorldPos);

    // Mise à jour du marqueur utilisateur
    var markerTransform = userMarker.getTransform();
    markerTransform.setLocalPosition(new vec3(relative.x, 0, relative.z));
    markerTransform.setWorldRotation(worldRot);

    // Optionnel : debug visuel
    if (script.debug) {
        var pos = worldPos.toString().replace("vec3", "").replace("(", "").replace(")", "");
        print("👣 Position utilisateur :", pos);
    }

    // Animation douce du matériau si présent
    if (mapMat) {
        var time = getTime();
        mapMat.mainPass.uvOffset = new vec2(Math.sin(time * 0.1) * 0.02, Math.cos(time * 0.1) * 0.02);
    }
}

// -----------------------------------------------------------
// Démarrage du contrôleur
// -----------------------------------------------------------
initialize();
