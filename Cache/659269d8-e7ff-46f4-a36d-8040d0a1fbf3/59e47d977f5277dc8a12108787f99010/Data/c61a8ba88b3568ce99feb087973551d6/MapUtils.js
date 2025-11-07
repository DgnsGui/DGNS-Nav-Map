"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customGetEuler = exports.easeOutElastic = exports.quaternionToPitch = exports.quaternionToRoll = exports.normalizeAngle = exports.calculateBearing = exports.getPhysicalDistanceBetweenLocations = exports.makeLine2DIndicesVerticesPair = exports.makeLineStrip2DMeshWithJoints = exports.makeCircle2DIndicesVerticesPair = exports.makeCircle2DMesh = exports.addRenderMeshVisual = exports.calculateZoomOffset = exports.clip = exports.makeTween = exports.interpolate = exports.isFunction = exports.lerp = exports.setScreenTransformRect01 = exports.mod = exports.compareScreenTransformsPositionsArray = exports.setVec2 = exports.getOffsetForLocation = exports.getWorldHeightToRelativeToParentHeight = exports.getWorldWidthToRelativeToParentWidth = exports.getScreenTransformWorldHeight = exports.getScreenTransformWorldWidth = exports.wasClicked = exports.getScreenTransformPositionsAsArray = exports.map = exports.getSceneRoot = exports.findScriptComponent = exports.forEachSceneObjectInSubHierarchy = exports.EPSILON = void 0;
const LensConfig_1 = require("SpectaclesInteractionKit.lspkg/Utils/LensConfig");
exports.EPSILON = 0.000001;
// |SceneObject| Have an iterator function called on each SceneObject in a sub tree. Optionally [defaulting to true] including the scene object starting scene object.
function forEachSceneObjectInSubHierarchy(sceneObject, fn, includeSelf = undefined) {
    if (includeSelf === undefined || includeSelf) {
        fn(sceneObject);
    }
    for (var i = 0; i < sceneObject.getChildrenCount(); i++) {
        var childSceneObject = sceneObject.getChild(i);
        fn(childSceneObject);
        forEachSceneObjectInSubHierarchy(childSceneObject, fn, false);
    }
}
exports.forEachSceneObjectInSubHierarchy = forEachSceneObjectInSubHierarchy;
// |SceneObject| Find a script component with an unique property name
function findScriptComponent(sceneObject, propertyName) {
    var components = sceneObject.getComponents("ScriptComponent");
    for (var idx = 0; idx < components.length; idx++) {
        if (components[idx][propertyName]) {
            return components[idx];
        }
    }
    return null;
}
exports.findScriptComponent = findScriptComponent;
function getSceneRoot(sceneObject) {
    let parent = sceneObject.getParent();
    let currentSceneObject = sceneObject;
    while (parent !== null) {
        currentSceneObject = parent;
        parent = parent.getParent();
    }
    return currentSceneObject;
}
exports.getSceneRoot = getSceneRoot;
// |Math| Maps a number to a different interval. With optional clamping and easing.
function map(input, inputMin, inputMax, outputMin, outputMax) {
    input = (input - inputMin) / (inputMax - inputMin);
    var output = input * (outputMax - outputMin) + outputMin;
    return output;
}
exports.map = map;
// |UI| Get screen transform positions as array. Useful for checking is a screen transforms bounds changed with [compare-screen-transforms-positions-array](./compare-screen-transforms-positions-array.js).
function getScreenTransformPositionsAsArray(screenTransform) {
    return [
        screenTransform.localPointToWorldPoint(vec2.zero()),
        screenTransform.localPointToWorldPoint(vec2.one()),
    ];
}
exports.getScreenTransformPositionsAsArray = getScreenTransformPositionsAsArray;
// |UI| Determine is a screen transform is below a screen point and is active. Handy for touch & tap start events.
function wasClicked(screenTransform, screenPoint) {
    return (screenTransform.getSceneObject().isEnabledInHierarchy &&
        screenTransform.containsScreenPoint(screenPoint));
}
exports.wasClicked = wasClicked;
// |UI| Get screen transform width.
function getScreenTransformWorldWidth(screenTransform) {
    return screenTransform
        .localPointToWorldPoint(new vec2(-1, -1))
        .distance(screenTransform.localPointToWorldPoint(new vec2(1, -1)));
}
exports.getScreenTransformWorldWidth = getScreenTransformWorldWidth;
// |UI| Get screen transform height
function getScreenTransformWorldHeight(screenTransform) {
    return screenTransform
        .localPointToWorldPoint(new vec2(-1, 1))
        .distance(screenTransform.localPointToWorldPoint(new vec2(-1, -1)));
}
exports.getScreenTransformWorldHeight = getScreenTransformWorldHeight;
// |UI| Get the relative height of a screen transform to its parent (between 0 and 1) from a world height.
function getWorldWidthToRelativeToParentWidth(parentScreenTransform, worldWidth) {
    return worldWidth / getScreenTransformWorldWidth(parentScreenTransform);
}
exports.getWorldWidthToRelativeToParentWidth = getWorldWidthToRelativeToParentWidth;
// |UI| Get the relative height of a screen transform to its parent (between 0 and 1) from a world height.
function getWorldHeightToRelativeToParentHeight(parentScreenTransform, worldHeight) {
    return worldHeight / getScreenTransformWorldHeight(parentScreenTransform);
}
exports.getWorldHeightToRelativeToParentHeight = getWorldHeightToRelativeToParentHeight;
// |Map| Get the offset of a tile for a given location in terms of the scroll views dimensions
function getOffsetForLocation(mapModule, initialLocation, latitude, longitude) {
    var tileOffsetForLocation = mapModule.longLatToImageRatio(latitude, longitude, initialLocation);
    // Align the user position with the top left of the grid
    return new vec2(-tileOffsetForLocation.x, -tileOffsetForLocation.y);
}
exports.getOffsetForLocation = getOffsetForLocation;
// |Math| Set vec2
function setVec2(v, source) {
    v.x = source.x;
    v.y = source.y;
}
exports.setVec2 = setVec2;
// |UI| Compare screen transform positions array. Useful for checking is a screen transforms bounds changed with [get-screen-transform-positions-as-array](./get-screen-transform-positions-as-array.js).
function compareScreenTransformsPositionsArray(a, b) {
    return a.toString() === b.toString();
}
exports.compareScreenTransformsPositionsArray = compareScreenTransformsPositionsArray;
// |Math| Javascript native mod function only returns the remainder. This function acts like a modulo function.
function mod(n, m) {
    return ((n % m) + m) % m;
}
exports.mod = mod;
// |UI| Set a screen transform (in a similar way to how our brains work) with a relative to parent position and size.
function setScreenTransformRect01(screenTransform, x, y, width, height) {
    screenTransform.anchors.left = lerp(-1, 1, x);
    screenTransform.anchors.right = screenTransform.anchors.left + width * 2;
    screenTransform.anchors.top = lerp(1, -1, y);
    screenTransform.anchors.bottom = screenTransform.anchors.top - height * 2;
}
exports.setScreenTransformRect01 = setScreenTransformRect01;
// |Math| Returns a number between two numbers.
function lerp(start, end, scalar) {
    return start + (end - start) * scalar;
}
exports.lerp = lerp;
// |Comparison| Checks if a value is a valid function
function isFunction(fn) {
    return typeof fn === "function";
}
exports.isFunction = isFunction;
// Interpolating between rotations
function interpolate(startRotation, endRotation, peakVelocity) {
    var step = peakVelocity * getDeltaTime();
    return quat.slerp(startRotation, endRotation, step);
}
exports.interpolate = interpolate;
// |Time| Will call a callback function every frame for a set duration with a number increasing from 0 to 1.
function makeTween(callback, duration) {
    const updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
    const lateUpdateEvent = updateDispatcher.createLateUpdateEvent("Tween");
    const startTime = getTime();
    let hasRemovedEvent = false;
    lateUpdateEvent.bind(() => {
        if (getTime() > startTime + duration) {
            hasRemovedEvent = true;
            updateDispatcher.removeEvent(lateUpdateEvent);
            callback(1);
        }
        else {
            callback((getTime() - startTime) / duration);
        }
    });
    // Create a Cancelation function to stop this animation at any time
    function cancel() {
        if (!hasRemovedEvent) {
            hasRemovedEvent = true;
            updateDispatcher.removeEvent(lateUpdateEvent);
        }
    }
    return cancel;
}
exports.makeTween = makeTween;
function clip(n, minValue, maxValue) {
    return Math.min(Math.max(n, minValue), maxValue);
}
exports.clip = clip;
/**
 * Changes the zoom level input to scale map component receives it
 * https://wiki.openstreetmap.org/wiki/Zoom_levels
 */
function calculateZoomOffset(zoomLevel) {
    return map(zoomLevel, 8, 21, -11, 2);
}
exports.calculateZoomOffset = calculateZoomOffset;
/**
 * Adding render mesh visual
 */
function addRenderMeshVisual(sceneObject, mesh, material, renderOrder) {
    let renderMeshVisual = sceneObject.createComponent("Component.RenderMeshVisual");
    renderMeshVisual.addMaterial(material);
    renderMeshVisual.mesh = mesh;
    renderMeshVisual.setRenderOrder(renderOrder);
    return renderMeshVisual;
}
exports.addRenderMeshVisual = addRenderMeshVisual;
/**
 * Making circle 2D mesh
 */
function makeCircle2DMesh(position, radius) {
    const builder = new MeshBuilder([{ name: "position", components: 3 }]);
    builder.topology = MeshTopology.Triangles;
    builder.indexType = MeshIndexType.UInt16;
    const [indices, vertices] = this.makeCircle2DIndicesVerticesPair(position, radius, 16, 0);
    builder.appendIndices(indices);
    builder.appendVerticesInterleaved(vertices);
    builder.updateMesh();
    return builder.getMesh();
}
exports.makeCircle2DMesh = makeCircle2DMesh;
/**
 * Making circle indices vertices pair
 */
function makeCircle2DIndicesVerticesPair(position, radius, segments, indicesOffset) {
    const indices = [];
    const vertices = [];
    vertices.push(position.x, position.y, position.z);
    // Add the vertices around the circle
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = position.x + Math.cos(angle) * radius;
        const y = position.y + Math.sin(angle) * radius;
        const z = position.z;
        vertices.push(x, y, z);
    }
    // Add the indices for the triangles
    for (let i = 1; i <= segments; i++) {
        indices.push(indicesOffset, i + indicesOffset, i + indicesOffset + 1);
    }
    return [indices, vertices];
}
exports.makeCircle2DIndicesVerticesPair = makeCircle2DIndicesVerticesPair;
/**
 * Making line mesh with joints
 */
function makeLineStrip2DMeshWithJoints(positions, thickness) {
    const builder = new MeshBuilder([{ name: "position", components: 3 }]);
    builder.topology = MeshTopology.Triangles;
    builder.indexType = MeshIndexType.UInt16;
    for (let i = 0; i < positions.length - 1; ++i) {
        const [indices, vertices] = this.makeLine2DIndicesVerticesPair(positions[i], positions[i + 1], thickness, i * 4);
        builder.appendIndices(indices);
        builder.appendVerticesInterleaved(vertices);
    }
    const segments = 16;
    const radius = thickness / 2;
    const linesIndicesOffset = (positions.length - 1) * 4;
    for (let i = 0; i < positions.length; ++i) {
        const [indices, vertices] = this.makeCircle2DIndicesVerticesPair(positions[i], radius, segments, linesIndicesOffset + i * segments);
        builder.appendIndices(indices);
        builder.appendVerticesInterleaved(vertices);
    }
    builder.updateMesh();
    return builder.getMesh();
}
exports.makeLineStrip2DMeshWithJoints = makeLineStrip2DMeshWithJoints;
/**
 * Making line indices vertices pair
 */
function makeLine2DIndicesVerticesPair(start, end, thickness, indicesOffset) {
    const halfThickness = thickness / 2;
    const up = vec3.forward();
    const direction = end.sub(start).normalize();
    const right = up.cross(direction).normalize().uniformScale(halfThickness);
    return [
        // indices
        [
            0 + indicesOffset,
            1 + indicesOffset,
            2 + indicesOffset,
            2 + indicesOffset,
            1 + indicesOffset,
            3 + indicesOffset,
        ],
        // vertices
        [
            start.x + right.x,
            start.y + right.y,
            start.z + right.z,
            start.x - right.x,
            start.y - right.y,
            start.z - right.z,
            end.x + right.x,
            end.y + right.y,
            end.z + right.z,
            end.x - right.x,
            end.y - right.y,
            end.z - right.z,
        ],
    ];
}
exports.makeLine2DIndicesVerticesPair = makeLine2DIndicesVerticesPair;
function getPhysicalDistanceBetweenLocations(location1, location2) {
    const long1 = location1.longitude * MathUtils.DegToRad;
    const lat1 = location1.latitude * MathUtils.DegToRad;
    const long2 = location2.longitude * MathUtils.DegToRad;
    const lat2 = location2.latitude * MathUtils.DegToRad;
    const r = 6371 * 1000;
    const a = Math.sin((lat2 - lat1) / 2);
    const b = Math.cos(lat1);
    const c = Math.cos(lat2);
    const d = Math.sin((long2 - long1) / 2);
    const e = a * a + b * c * d * d;
    const sqrt_e = Math.sqrt(e);
    const distance = 2 * r * Math.asin(sqrt_e);
    return distance;
}
exports.getPhysicalDistanceBetweenLocations = getPhysicalDistanceBetweenLocations;
/**
 * Calculates the bearing between two geographical points.
 * @param {GeoPosition} start - The starting point with latitude and longitude.
 * @param {GeoPosition} end - The ending point with latitude and longitude.
 * @returns {number} The bearing in radians from the start point to the end point.
 */
function calculateBearing(start, end) {
    const startLat = start.latitude * MathUtils.DegToRad;
    const startLng = start.longitude * MathUtils.DegToRad;
    const endLat = end.latitude * MathUtils.DegToRad;
    const endLng = end.longitude * MathUtils.DegToRad;
    const dLng = endLng - startLng;
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
        Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    const bearing = Math.atan2(y, x);
    return bearing;
}
exports.calculateBearing = calculateBearing;
function normalizeAngle(angle) {
    angle = angle % (Math.PI * 2);
    if (angle > Math.PI) {
        angle -= Math.PI * 2;
    }
    else if (angle < -Math.PI) {
        angle += Math.PI * 2;
    }
    return angle;
}
exports.normalizeAngle = normalizeAngle;
/**
 * Converts a quaternion to a roll angle in radians.
 * @param quaternion - The quaternion to convert.
 * @returns The roll angle in radians.
 */
function quaternionToRoll(quaternion) {
    // Calculate the roll angle from the quaternion
    const sinRoll = 2.0 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
    const cosRoll = 1.0 - 2.0 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
    return Math.atan2(sinRoll, cosRoll);
}
exports.quaternionToRoll = quaternionToRoll;
/**
 * Converts a quaternion to a pitch angle in radians.
 * @param quaternion - The quaternion to convert.
 * @returns The pitch angle in radians.
 */
function quaternionToPitch(quaternion) {
    const roll = quaternionToRoll(quaternion);
    const inverseRollQuaternion = quat.fromEulerVec(new vec3(0, 0, -roll));
    quaternion = quaternion.multiply(inverseRollQuaternion);
    let sinPitch = 2.0 * (quaternion.w * quaternion.x - quaternion.y * quaternion.z);
    // Clamp sinPitch between -1 and 1 to prevent NaN results from asin
    sinPitch = Math.max(-1.0, Math.min(1.0, sinPitch));
    return Math.asin(sinPitch);
}
exports.quaternionToPitch = quaternionToPitch;
const easeOutElasticConstant = (2 * Math.PI) / 3;
/**
 * A elastic ease out function
 * @param x Should be between 0 and 1
 */
function easeOutElastic(x) {
    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) *
                Math.sin((x * 10 - 0.75) * easeOutElasticConstant) +
                1;
}
exports.easeOutElastic = easeOutElastic;
function customGetEuler(quaternion) {
    const singularityTestValue = 0.4999;
    const sqw = quaternion.w * quaternion.w;
    const sqx = quaternion.x * quaternion.x;
    const sqy = quaternion.y * quaternion.y;
    const sqz = quaternion.z * quaternion.z;
    const unit = sqx + sqy + sqz + sqw;
    const test = quaternion.x * quaternion.y + quaternion.z * quaternion.w;
    let yaw, pitch, roll;
    // singularity at north pole
    if (test > singularityTestValue * unit) {
        yaw = 2 * Math.atan2(quaternion.x, quaternion.w);
        pitch = Math.PI / 2;
        roll = 0;
    }
    // singularity at south pole
    else if (test < -singularityTestValue * unit) {
        yaw = -2 * Math.atan2(quaternion.x, quaternion.w);
        pitch = -Math.PI / 2;
        roll = 0;
    }
    else {
        yaw = Math.atan2(2 * quaternion.y * quaternion.w - 2 * quaternion.x * quaternion.z, sqx - sqy - sqz + sqw);
        pitch = Math.asin((2 * test) / unit);
        roll = Math.atan2(2 * quaternion.x * quaternion.w - 2 * quaternion.y * quaternion.z, -sqx + sqy - sqz + sqw);
    }
    const r = new vec3(pitch < 0 ? pitch + Math.PI * 2 : pitch, yaw < 0 ? yaw + Math.PI * 2 : yaw, roll < 0 ? roll + Math.PI * 2 : roll);
    return r;
}
exports.customGetEuler = customGetEuler;
//# sourceMappingURL=MapUtils.js.map