import {Sprite} from "../engine.js"; // Ensure this matches the export in sprite.js

class Entity extends Sprite {
    /**
     * Creates an instance of the Entity class.
     * @param {number} x - The x-coordinate of the entity.
     * @param {number} y - The y-coordinate of the entity.
     * @param {string} imageSrc - The URL of the image for the entity.
     * @param {number} width - The width of the entity.
     * @param {number} height - The height of the entity.
     * @param {number} scale - The scaling factor for the entity (default is 1).
     */
    constructor(x, y, imageSrc, width, height, scale = 1) {
        super(x, y, imageSrc, width, height, scale);
    }
}