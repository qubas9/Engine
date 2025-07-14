import {Sprite} from "../engine.js"; // Ensure this matches the export in sprite.js
import {Hitbox} from "../coretools.js";
import {Vector} from "../coretools.js";

class Entity extends Sprite {
    /**
     * Creates an instance of the Entity class.
     * @param {number} x - The x-coordinate of the entity.
     * @param {number} y - The y-coordinate of the entity.
     * @param {string} imageSrc - The URL of the image for the entity.
     * @param {number} width - The width of the entity.
     * @param {number} height - The height of the entity.
     * @param {Physic} physic - An instance of the Physic class to which this entity will be added.
     * @param {Vector} gravity - The gravity affecting the entity (default is (0,5)).
     * @param {number} scale - The scaling factor for the entity (default is 1).)
     * @param {Render} render - An instance of the Render class to which this entity will be added.
     * @param {Function} onloadCallback - A callback function that is called when the
     */
    constructor(x, y, imageSrc, width, height, scale = 1,render,physic,gravity = new Vector(0,5), onloadCallback) {
        super(x, y, imageSrc, width, height, scale,render,onloadCallback);
        this.hitbox = new Hitbox(new Vector(0, 0), new Vector(width, height), this.position);
        this.groundSensors = [new Hitbox(new Vector(0,this.height+1),new Vector(0,this.height+1),this.position),new Hitbox(new Vector(this.width,this.height+1),new Vector(this.width,this.height+1),this.position)]; // Array to hold ground sensors
        this.onGround = false; // Flag to indicate if the entity is on the ground
        this.velocity = new Vector(0, 0); // Velocity vector for the entity
        this.gravity = gravity; // Default gravity if not provided
        this.touching = []; //
        physic.addEntity(this); // Assuming physic is an instance of a class that manages entities 
    }

    update(deltaTime) {
        // Apply gravity to the entity's velocity
        if (this.onGround) {
            // Update ground sensors positions
            this.groundSensors[0].updatePosition(new Vector(this.position.x, this.position.y + this.height));
            this.groundSensors[1].updatePosition(new Vector(this.position.x + this.width, this.position.y + this.height));

        }else{
            this.velocity.add(Vector.mult(this.gravity, deltaTime));
        }

        // Update the entity's position based on its velocity
        this.position.add(Vector.mult(this.velocity, deltaTime));
        
        // Update the hitbox position
        this.hitbox.updatePosition(this.position);
        
    }

    checkColision(block) {
        // Check if the entity's hitbox collides with the block's hitbox
        if (this.hitbox.isColliding(block.hitbox)) {
            this.onCollision(block);
            return true; // Collision detected
        }
        if(this.onGround){

            // Check if the entity is touching the ground sensors
            this.onGround = this.groundSensors.some(sensor => sensor.isColliding(block.hitbox));
            
        }
        return false; // No collision
    }
}

export default Entity; // Ensure Entity is exported as default