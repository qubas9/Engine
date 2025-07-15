import { Vector } from "../coretools.js";
import { Block } from "../engine.js";

class MovingBlock extends Block {
    /**
     * Creates an instance of the MovingBlock class.
     * @param {number} startx - The start x-coordinate of the block`s path.
     * @param {number} starty - The start y-coordinate of the block`s path.
     * @param {number} endx - The end x-coordinate of the block`s path.
     * @param {number} endy - The end y-coordinate of the block`s path
     * @param {number} routeTime - The time it takes to move from start to end (in seconds).
     * @param {string} imageSrc - The URL of the image for the block.
     * @param {number} width - The width of the block.
     * @param {number} height - The height of the block.
     * @param {Render} render - An instance of the Render class to which this block will be added.
     * @param {Function} onLoadCallback - A callback function that is called when the image is loaded (optional).
     */
    constructor(startx, starty,endx,endy,routeTime, imageSrc, width, height, render, physic, friction, onLoadCallback) {
        super(startx, starty, imageSrc, width, height, render, physic,friction, onLoadCallback);
        physic.addUpdatable(this); // Assuming physic is an instance of a class that manages updatable objects
        this.velocity = new Vector((endx - startx) / routeTime, (endy - starty) / routeTime);  
        this.start = this.position.copy(); // Store the starting position 
        this.end = new Vector(endx, endy); // Store the end position
        this.exeptedError = 0.00000000000000000000001; // Allowable error for reaching the end
        this.deltaTime = 0;
    }

    update(deltaTime) {
        this.justTurned = false; // Reset the justTurned flag at the start of each update
        this.deltaTime = deltaTime; // Store the delta time for use in other methods
        this.exeptedError = this.deltaTime / 1000;
        this.position.add(Vector.mult(this.velocity,deltaTime));
        this.hitbox.updatePosition(this.position);
        
        // Check if the block has reached the end of its path
        if (Vector.sub(this.position, this.end).mag + this.exeptedError< Vector.mult(this.velocity,deltaTime).mag || Vector.sub(this.position, this.start).mag + this.exeptedError < Vector.mult(this.velocity,deltaTime).mag) {
            // Reverse the velocity to move back to the start
            this.justTurned = true; // Set a flag to indicate the block has just turned
            this.velocity.mult(-1);
        }
    }

    touching(entity) {
        let velocity = Vector.sub(entity.velocity,this.velocity);
        velocity.mult(-this.friction); // Call the parent class's touching method
        // entity.position.add(Vector.mult(this.velocity,this.deltaTime));
        if (this.justTurned) {
            // Add the block's velocity to the entity's velocity
        }
        entity.velocity=Vector.add(this.velocity,velocity); // Update the entity's velocity with the modified velocity
    }

    onCollision(entity, direction) {
        super.onCollision(entity, direction.copy()); // Call the parent class's onCollision method
       // super.onCollision(entity, direction); // Call the parent class's onCollision method
       // Add the block's velocity to the entity's velocityentity.position.add(Vector.mult(this.velocity,this.deltaTime));
       entity.velocity.add(this.velocity); // Add the block's velocity to the entity's velocity
        // Call the touching method to apply the block's specific behavior
        // this.touching(entity);
        // console.log("touching");
        // console.log(entity);
        // console.log(this);
       this.touching(entity);
        
        // this.touching(entity); // Call the touching method to apply the block's specific behavior
    }
}

export default MovingBlock; // Ensure MovingBlock is exported as default