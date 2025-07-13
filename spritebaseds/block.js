import Sprite from "./sprite.js"; // Ensure this matches the export in sprite.js
import Hitbox from "../coretools/hitbox.js";
import Vector from "../coretools/vector.js";

class Block extends Sprite {
    /**
     * Creates an instance of the Block class.
     * @param {number} x - The x-coordinate of the block.
     * @param {number} y - The y-coordinate of the block.
     * @param {string} imageSrc - The URL of the image for the block.
     * @param {number} width - The width of the block.
     * @param {number} height - The height of the block.
     * @param {number} scale - The scaling factor for the block (default is 1).
     * @param {Render} Render - An instance of the Render class to which this block will be added.
     * @param {Function} onLoadCallback - A callback function that is called when the image is loaded (optional).
     */
    constructor(x, y, imageSrc, width, height, scale = 1, render,physic, onLoadCallback) {
        super(x, y, imageSrc, width, height, scale, render, onLoadCallback);
        this.hitbox = new Hitbox(new Vector(0, 0), new Vector(width, height), this.position);
        if (physic && typeof physic.addBlock === 'function') {
            physic.addBlock(this); // Assuming physic is an instance of a class that manages physics
        }else {
            console.log("physic is not defined or does not have an addBlock method.");
        }
    }
}

export default Block; // Ensure Block is exported as default