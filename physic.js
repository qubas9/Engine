import Vector from "./coretools/vector.js";
import Hitbox from "./coretools/hitbox.js";
import Block from "./spritebaseds/block.js";
class Physic {
    constructor(){
        this.blocks = [];
        this.entyties = [];
    }

    update() {
        this.entyties.forEach(entity => {
            entity.update();
            this.blocks.forEach(block => {
                if (entity.hitbox.collidesWith(block.hitbox)) {
                    entity.onCollision(block);
                }
            });
        });
    }

    addBlock(block) {
        if (block instanceof Block) {
            this.blocks.push(block);
        } else {
            console.error("Invalid block type. Expected an instance of Block.");
        }
    }
}

export default Physic;