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
     * @param {Render} render - An instance of the Render class to which this entity will be added.
     * @param {Function} onloadCallback - A callback function that is called when the
     */
    constructor(x, y, imageSrc, width, height,render,physic,gravity = new Vector(0,5), onloadCallback) {
        super(x, y, imageSrc, width, height, render,onloadCallback);
        this.hitbox = new Hitbox(new Vector(0, 0), new Vector(width, height), this.position);
        this.groundSensor = new Hitbox(new Vector(0,this.height+1),new Vector(this.width,this.height+2),this.position); // Array to hold ground sensors
        this.onGround = false; // Flag to indicate if the entity is on the ground
        this.velocity = new Vector(0, 0); // Velocity vector for the entity
        this.gravity = gravity; // Default gravity if not provided
        this.touching = []; //
        this.pasibleOnGround = []; // Flag to indicate if the entity is pasible on ground
        physic.addEntity(this); // Assuming physic is an instance of a class that manages entities 
    }

    update(deltaTime) {
        // Apply gravity to the entity's velocity
        this.touching = []; // Reset touching array if on ground
        if (this.onGround) {
            console.log("Entity is on the ground");
            // Update ground sensors positions
            
        }else{
            this.velocity.add(Vector.mult(this.gravity, deltaTime));
        }
        
        // Update the entity's position based on its velocity
        this.position.add(Vector.mult(this.velocity, deltaTime));
        
        // Update the hitbox position
        this.hitbox.updatePosition(this.position);
        this.groundSensor.updatePosition(this.position); // Update the ground sensor position
        this.onGround = this.pasibleOnGround.some((a) => a);
        
        this.pasibleOnGround = [] // Reset onGround flag at the start of each update
        
    }

    afterUpdate(deltaTime) {
        
    }

    checkColision(block) {
        // Check if the entity's hitbox collides with the block's hitbox
        if (this.hitbox.isColliding(block.hitbox)) {
            this.onCollision(block);
            return true; // Collision detected
        }
        if(this.onGround){
            // Check if the entity is touching the ground sensors
            this.pasibleOnGround.push(this.checkSensor(block));
            
        }
        return false; // No collision
    }

    onCollision(block) {
        if (this.velocity.y > this.velocity.x){
            if (this.velocity.y > 0) {
                // Collision from above
                this.position.y = block.hitbox.position.y - this.height-1;
                block.onCollision(this, new Vector(0,1)); // Notify the block of the collision
                this.onGround = true; // Set onGround to true
                this.pasibleOnGround.push(true); // Add to pasibleOnGround array
            }else {
                // Collision from below
                this.position.y = block.hitbox.position.y + block.hitbox.offset2.y+1;
                block.onCollision(this,new Vector(0,-1)); // Notify the block of the collision
            }
        }else {
            if (this.velocity.x > 0) {
                // Collision from the left
                this.position.x = block.hitbox.position.x - this.width-1;
                block.onCollision(this, new Vector(1,0)); // Notify the block of the collision
            } else {
                // Collision from the right
                this.position.x = block.hitbox.position.x + block.hitbox.offset2.x+1;
                block.onCollision(this, new Vector(-1,0)); // Notify the block of the collision
            }
        }
    }

    checkSensor(block){
                
                if (this.groundSensor.isColliding(block.hitbox)){
                    this.touching.push(block);
                    block.touching(this);
                    return true; // At least one sensor is colliding
                }else{
                    return false; // No collision with this sensor
                }
        }
}

export default Entity; // Ensure Entity is exported as default