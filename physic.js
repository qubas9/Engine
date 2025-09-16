import {Vector} from "./coretools.js";
import {Hitbox} from "./coretools.js";
import {Block} from "./engine.js";
class Physic {
    constructor(){
        this.blocks = [];
        this.entyties = [];
        this.updatable = [];
    }

    update(deltaTime) {
        this.updatable.forEach(updatable => {
            updatable.update(deltaTime);
        });

        this.entyties.forEach(entity => {
            entity.update(deltaTime);
            this.blocks.forEach(block => {
                if (this.ended) return; // Exit if the game has ended
                entity.checkColision(block);
            });
            entity.afterUpdate(deltaTime); // Call afterUpdate if it exists
        });

    }

    addBlock(block) {
        if (block instanceof Block) {
            this.blocks.push(block);
        } else {
            console.error("Invalid block type. Expected an instance of Block.");
        }
    }

    addUpdatable(updatable) {
        if (updatable && typeof updatable.update === "function") {
            this.updatable.push(updatable);
        } else {
            console.error("Invalid updatable object. It must have an update method.");
        }
    }

    addEntity(entity) {
        if (entity && typeof entity.update === "function") {
            this.entyties.push(entity);
        } else {
            console.error("Invalid entity object. It must have an update method.");
        }
    }
    destroy() {
        this.ended = true; // Set the ended flag to true
        this.blocks = [];
        this.entyties = [];
        this.updatable = [];
    }
}

export default Physic;