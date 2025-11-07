// @input bool enableXRotation = false {"label":"Activer rotation X"}
// @input float xRotationSpeed = 30.0 {"label":"Vitesse rotation X", "showIf":"enableXRotation"}
// @input bool enableYRotation = true {"label":"Activer rotation Y"}  
// @input float yRotationSpeed = 30.0 {"label":"Vitesse rotation Y", "showIf":"enableYRotation"}
// @input bool enableZRotation = false {"label":"Activer rotation Z"}
// @input float zRotationSpeed = 30.0 {"label":"Vitesse rotation Z", "showIf":"enableZRotation"}

var obj = script.getSceneObject();

function updateRotation(eventData) {
    var deltaTime = eventData.getDeltaTime();
    var currentRotation = obj.getTransform().getLocalRotation();
    
    // Calcul des rotations pour chaque axe activé
    var xRotation = script.enableXRotation ? script.xRotationSpeed * deltaTime : 0;
    var yRotation = script.enableYRotation ? script.yRotationSpeed * deltaTime : 0;
    var zRotation = script.enableZRotation ? script.zRotationSpeed * deltaTime : 0;
    
    // Création du quaternion de rotation combiné
    var newRotation = quat.fromEulerAngles(xRotation, yRotation, zRotation);
    
    // Application de la rotation
    obj.getTransform().setLocalRotation(currentRotation.multiply(newRotation));
}

script.createEvent("UpdateEvent").bind(updateRotation);