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
        this.entyties.forEach(entity => {
            entity.update(deltaTime);
            this.blocks.forEach(block => {
                if (entity.hitbox.collidesWith(block.hitbox)) {
                    entity.onCollision(block);
                }
            });
        });

        this.updatable.forEach(updatable => {
            updatable.update(deltaTime);
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
}

export default Physic;