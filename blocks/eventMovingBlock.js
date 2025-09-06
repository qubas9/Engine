import {Event} from "../coretools.js";
import {MovingBlock} from "../engine.js";

class EventMovingBlock extends MovingBlock {
    constructor(obj) {
        super(obj);
        this.onCollisionEvent = obj.onCollisionEvent || "defaultOnColisionEvent";
        this.touchingEvent = obj.touchingEvent || "defaultTouchingEvent";
    }
    onCollision(entity,direction) {
        Event.emit(this.onCollisionEvent, {entity:entity,block:this,direction:direction});
    }
    touching(entity) {
        Event.emit(this.touchingEvent, {entity:entity,block:this});
    }
}

export default EventMovingBlock; // Ensure Block is exported as default