import { Vector } from "../coretools.js";
import { Block } from "../engine.js";

class MovingBlock extends Block {
    /**
     * Creates an instance of the MovingBlock class.
     * @param {number} startx - The start x-coordinate of the block`s path.
     * @param {number} starty - The start y-coordinate of the block`s path.
     * @param {number} endx - The end x-coordinate of the block`s path.
     * @param {number} endy - The end y-coordinate of the block`s path
     * @param {number} routeTime - The time it takes to move from start to end (in frames).
     * @param {string} imageSrc - The URL of the image for the block.
     * @param {number} width - The width of the block.
     * @param {number} height - The height of the block.
     * @param {number} scale - The scaling factor for the block (default is 1).
     * @param {Render} render - An instance of the Render class to which this block will be added.
     * @param {Function} onLoadCallback - A callback function that is called when the image is loaded (optional).
     */
    constructor(startx, starty,endx,endy,routeTime, imageSrc, width, height, scale = 1, render, physic, onLoadCallback) {
        super(startx, starty, imageSrc, width, height, scale, render, physic, onLoadCallback);
        physic.addUpdatable(this); // Assuming physic is an instance of a class that manages updatable objects
        this.speed = new Vector((endx - startx) / routeTime, (endy - starty) / routeTime);  
        this.start = this.position.copy(); // Store the starting position 
        this.end = new Vector(endx, endy); // Store the end position
    }

    update() {
        this.position.add(this.speed);
        this.hitbox.updatePosition(this.position);
        
        // Check if the block has reached the end of its path
        if (Vector.sub(this.position, this.end).mag < this.speed.mag || Vector.sub(this.position, this.start).mag < this.speed.mag) {
            // Reverse the speed to move back to the start
            
            this.speed.mult(-1);
        }
    }
}

export default MovingBlock; // Ensure MovingBlock is exported as default