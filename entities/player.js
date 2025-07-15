import {Entity} from "../engine.js";
import {Control} from "../coretools.js"; // Ensure this matches the export in controls.js
import {Vector} from "../coretools.js"; // Ensure this matches the export in vector.js

class Player extends Entity {
    constructor(x, y, imageSrc, width, height,render,physic,gravity = new Vector(0,5),onClickAcceleration = 50,jumpAcceleration = 50,callBacjMap = null, onloadCallback) {
        super(x, y, imageSrc, width, height,render,physic,gravity = new Vector(0,50), onloadCallback);
        this.controls = new Control(this, callBacjMap); // Initialize controls for the player
        this.onClickAcceleration = onClickAcceleration;
        this.jumpAcceleration = jumpAcceleration; // Set the jump acceleration
        this.controls.bind("left","a" ,this.left);
        this.controls.bind("right","d" ,this.right);
        this.controls.bind("jump","w" ,this.jump);
        // this.controls.bind("down","ArrowDown" ,this.down);
        this.controls.bindOnce("start","s" ,this.controls.startRecording.bind(this.controls));
        this.controls.bindOnce("stop","q" ,() => {console.log(JSON.stringify(this.controls.stopRecording()));});
       // let recording = prompt("Enter recorded events JSON:")
        // if (recording != "") {
        //     this.controls.startPlayback(JSON.parse(recording));
        // }
    }

    left(This) {
        This.addAcceleration(new Vector(-This.onClickAcceleration, 0)); // Move left
    }
    right(This) {
        This.addAcceleration(new Vector(This.onClickAcceleration, 0)); // Move right
    }
    jump(This) {
        if (This.onGround) {
            This.addVelocity(new Vector(0, -This.jumpAcceleration)); // Jump with a velocity upwards
            This.onGround = false; // Set onGround to false after jumping
        }
    }
    // down(This) {
    //     This.addAcceleration(new Vector(0, This.onClickAcceleration)); // Move down
    // }

    update(deltaTime) {
       super.update(deltaTime); // Call the parent class's update method
        this.controls.update(deltaTime); // Update controls
    }
}

export default Player;