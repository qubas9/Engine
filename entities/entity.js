import {Sprite} from "../engine.js"; // Ensure this matches the export in sprite.js
import {Hitbox} from "../coretools.js";
import {Vector} from "../coretools.js";

class Entity extends Sprite {
    /**
     * Creates an instance of the Entity class.
     * @param {Object} config - Configuration object containing necessary properties.
     * @param {number} config.x - The x-coordinate of the entity.
     * @param {number} config.y - The y-coordinate of the entity.
     * @param {string} config.imageSrc - The URL of the image for the entity.
     * @param {number} config.width - The width of the entity.
     * @param {number} config.height - The height of the entity.
     * @param {Render} config.render - An instance of the Render class to which this entity will be added.
     * @param {Physic} config.physic - An instance of the Physic class to which this entity will be added.
     * @param {Vector} [config.gravity=new Vector(0, 500)] - The gravity affecting the entity (default is (0,5)).
     * @param {Function} config.onLoadCallback - A callback function that is called when the
     */

    constructor(config) {
        const options = {
            x: config.x,
            y: config.y,
            imageSrc: config.imageSrc,
            width: config.width,
            height: config.height,
            render: config.render,
            onLoadCallback: config.onLoadCallback
        };
        super(options);
        this.collisionOffset = config.collisionOffset || 1
        this.hitbox = new Hitbox(new Vector(0, 0), new Vector(this.width, this.height), this.position);

        this.groundSensor = new Hitbox(new Vector(0, this.height ), new Vector(this.width, this.height+this.collisionOffset+0.01), this.position); // Array to hold ground sensors
        this.onGround = false; // Flag to indicate if the entity is on the ground
        this.velocity = new Vector(0, 0); // Velocity vector for the entity

        this.acceleration = new Vector(0, 0); // Acceleration vector for the entity
        this.gravity = config.gravity || new Vector(0, 500); // Default gravity if not provided
        this.inAirDrag = config.inAirDrag 
        this.touching = [];
        this.passableOnGround = []; // Flag to indicate if the entity is passable on ground
        config.physic.addEntity(this); // Assuming physic is an instance of a class that manages entities
    }

    update(deltaTime) {
        // Apply gravity to the entity's velocity
        this.touching = []; // Reset touching array if on ground
        if (this.onGround) {
            //console.log("Entity is on the ground");
            // Update ground sensors positions
            
            this.onGround = this.passableOnGround.some((a) => a);
        }else{
            this.velocity.add(Vector.mult(this.gravity, deltaTime));
            this.velocity.x *= this.inAirDrag
        }
        
        // Update the entity's position based on its velocity
        this.velocity.add(Vector.mult(this.acceleration, deltaTime));
        // if (Math.abs(this.velocity.x) < this.collisionOffset){
        //     this.velocity.x = 0; // Prevents the entity from moving too slowly
        // }
        // if (Math.abs(this.velocity.y) < this.collisionOffset){
        //     this.velocity.y = 0; // Prevents the entity from moving too slowly vertically
        // }
        this.position.add(Vector.mult(this.velocity, deltaTime));
        
        // Update the hitbox position
        this.hitbox.updatePosition(this.position);
        this.groundSensor.updatePosition(this.position); // Update the ground sensor position
        
        this.passableOnGround = []; // Reset onGround flag at the start of each update
       this.acceleration = new Vector(0, 0); // Reset acceleration after applying it
    }

    afterUpdate(deltaTime) {
        
    }

    addVelocity(velocity) {
        this.velocity.add(velocity); // Add the given velocity to the entity's velocity
    }

    addAcceleration(acceleration) {
        this.acceleration.add(acceleration); // Add the given acceleration to the entity's acceleration
    }

    checkCollision(block) {
        // Check if the entity's hitbox collides with the block's hitbox
        if (this.hitbox.isColliding(block.hitbox)) {
            this.onCollision(block);
            return true; // Collision detected
        }
        if(this.onGround){
            // Check if the entity is touching the ground sensors
            this.passableOnGround.push(this.checkSensor(block));
            
        }
        return false; // No collision
    }

    onCollision(block) {
        let positionDifference = Vector.sub(Vector.add(block.position,Vector.div(block.hitbox.offset2,2)), Vector.add(this.position,Vector.div(this.hitbox.offset2,2)));
        //console.log("v"+positionDifference.x+" "+positionDifference.y);
        if (Math.floor(Math.abs(positionDifference.x)) > Math.floor(Math.abs(positionDifference.y))){
            if (positionDifference.x > 0) {
                // Collision from the left
                //console.log("Collision from the left");
                this.position.x = block.hitbox.position.x - this.width-this.collisionOffset;
                block.onCollision(this, new Vector(1,0)); // Notify the block of the collision
            } else  if (positionDifference.x < 0) {
                //console.log("Collision from the right");
                // Collision from the right
                this.position.x = block.hitbox.position.x + block.hitbox.offset2.x+this.collisionOffset;
                block.onCollision(this, new Vector(-1,0)); // Notify the block of the collision
            }
        }else {
            
            if (positionDifference.y > 0) {
                // Collision from above
                //console.log("Collision from above");
                this.position.y = block.hitbox.position.y - this.height-this.collisionOffset;
                block.onCollision(this, new Vector(0,1)); // Notify the block of the collision
                this.onGround = true; // Set onGround to true
                this.passableOnGround.push(true); // Add to passableOnGround array
            }else  if (positionDifference.mag < Math.sqrt(block.height*block.height + block.width*block.width) && positionDifference.y < 0) {
                // Collision from below
                //console.log("Collision from below");
                this.position.y = block.hitbox.position.y + block.hitbox.offset2.y+this.collisionOffset;
                let velocityY = this.velocity.y
                block.onCollision(this,new Vector(0,-1)); // Notify the block of the collision
                 // Prevents the entity from sticking to the bottom of blocks when gravity is negative
                if (velocityY < 0) {
                    velocityY = this.gravity.y * 0.1; // Small positive value to push the entity downwards
                }
                this.velocity.y = velocityY;
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