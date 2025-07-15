import {Sprite} from "../engine.js"; // Ensure this matches the export in sprite.js
import {Hitbox} from "../coretools.js";
import {Vector} from "../coretools.js";

class Block extends Sprite {
    /**
     * Creates an instance of the Block class.
     * @param {number} x - The x-coordinate of the block.
     * @param {number} y - The y-coordinate of the block.
     * @param {string} imageSrc - The URL of the image for the block.
     * @param {number} width - The width of the block.
     * @param {number} height - The height of the block.
     * @param {Render} Render - An instance of the Render class to which this block will be added.
     * @param {Function} onLoadCallback - A callback function that is called when the image is loaded (optional).
     */
    constructor(x, y, imageSrc, width, height, render,physic, onLoadCallback) {
        super(x, y, imageSrc, width, height, render, onLoadCallback);
        this.hitbox = new Hitbox(new Vector(0, 0), new Vector(width, height), this.position);
        if (physic && typeof physic.addBlock === 'function') {
            physic.addBlock(this); // Assuming physic is an instance of a class that manages physics
        }else {
            console.log("physic is not defined or does not have an addBlock method.");
        }
    }
    /**
     * @description Aplly block specific behavior to entity.
     * @param {Entity} entity - The entity the behavior is apllyed.
     * @param {Vector} direction - The direction of the collision (optional).
     */ 
    onCollision(entity,direction) {
        entity.velocity = new Vector(0,0); // Reset entity's velocity on collision
    }
    /**
     * Updates the block's position and hitbox.
     * @param {number} deltaTime - The time elapsed since the last update (in seconds).
     */
    touching(entity) {}
}

export default Block; // Ensure Block is exported as default