"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UICollisionSolver = void 0;
var EventType;
(function (EventType) {
    EventType[EventType["Start"] = 0] = "Start";
    EventType[EventType["End"] = 1] = "End";
})(EventType || (EventType = {}));
class UICollisionSolver {
    /**
     * Resolves collisions on a 1-D axis between elements.
     * @param elements The elements to resolve collisions for. x is the beginning of the element, y is the end.
     * @returns The resolved elements.
     */
    resolve1DCollisions(elements) {
        const events = [];
        let i = 0;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            events.push({ n: element.x, type: EventType.Start, index: i });
            events.push({
                n: element.y,
                type: EventType.End,
                index: i,
            });
        }
        events.sort((a, b) => a.n - b.n || (a.type === EventType.End ? -1 : 1));
        const activeElements = new Set();
        events.forEach((event) => {
            if (event.type === EventType.Start) {
                this.resolve1DOverlap(elements, event.index, activeElements);
                activeElements.add(event.index);
            }
            else {
                activeElements.delete(event.index);
            }
        });
        return elements;
    }
    /**
     * Resolves collisions on a 2-D axis between elements. Assumes the elements are arranged in a horizontal line and the collision is resolved on the Y-axis.
     * @param elements The elements to resolve collisions for. x and y are the beginning and end of the element on X-axis, while z and w are the same for Y-axis. Assuming (0,0) is the center of the space.
     * @returns The resolved elements.
     */
    resolve2DCollisions(elements) {
        const events = [];
        let i = 0;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            events.push({ n: element.x, type: EventType.Start, index: i });
            events.push({
                n: element.y,
                type: EventType.End,
                index: i,
            });
        }
        events.sort((a, b) => a.n - b.n || (a.type === EventType.End ? -1 : 1));
        const activeElements = new Set();
        events.forEach((event) => {
            if (event.type === EventType.Start) {
                this.resolve2DOverlap(elements, event.index, activeElements);
                activeElements.add(event.index);
            }
            else {
                activeElements.delete(event.index);
            }
        });
        return elements;
    }
    resolve1DOverlap(elements, currentIndex, elementSet) {
        const currentElement = elements[currentIndex];
        elementSet.forEach((index) => {
            if (index !== currentIndex) {
                const otherElement = elements[index];
                if (check1DOverlap(currentElement, otherElement)) {
                    // Reposition currentRect after rect
                    elements[currentIndex] = new vec2(otherElement.y, otherElement.y + currentElement.y - currentElement.x);
                }
            }
        });
    }
    resolve2DOverlap(elements, currentIndex, elementSet) {
        const currentElement = elements[currentIndex];
        elementSet.forEach((index) => {
            if (index !== currentIndex) {
                const otherElement = elements[index];
                if (check1DOverlap(new vec2(currentElement.x, currentElement.y), new vec2(otherElement.x, otherElement.y)) &&
                    check1DOverlap(new vec2(currentElement.z, currentElement.w), new vec2(otherElement.z, otherElement.w))) {
                    // Reposition currentRect after rect
                    elements[currentIndex] = new vec4(elements[currentIndex].x, elements[currentIndex].y, otherElement.w, otherElement.w + currentElement.w - currentElement.z);
                }
            }
        });
    }
}
exports.UICollisionSolver = UICollisionSolver;
function check1DOverlap(currentElement, otherElement) {
    return !((currentElement.y > otherElement.y && currentElement.x > otherElement.y) ||
        (otherElement.y > currentElement.y && otherElement.x > currentElement.y));
}
//# sourceMappingURL=UICollisionDetector.js.map