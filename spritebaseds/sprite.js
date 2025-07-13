import Vector from "../coretools/vector.js";

/**
* The Sprite class represents a visual element that can be drawn onto the canvas.
* Each sprite has its own position, image, and scale.
*/
class Sprite {
    /**
     * Creates an instance of the Sprite class.
     * @param {number} x - The x-coordinate of the sprite.
     * @param {number} y - The y-coordinate of the sprite.
     * @param {string} imageSrc - The URL of the image for the sprite.
     * @param {number} width - The width of the sprite.
     * @param {number} height - The height of the sprite.
     * @param {number} scale - The scaling factor for the sprite (default is 1).
     * @param {Render} Render - An instance of the Render class to which this sprite will be added.
     * @param {Function} onLoadCallback - A callback function that is called when the image is loaded (optional).
     * @throws {Error} If any of the parameters are of incorrect types.
     */
    constructor(x, y, imageSrc, width, height, scale = 1, render, onLoadCallback) {
        if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("x and y must be numbers");
        }
        if (typeof width !== "number" || typeof height !== "number") {
            throw new Error("width and height must be numbers");
        }
        if (typeof imageSrc !== "string") {
            throw new Error("imageSrc must be a valid URL string");
        }
  
        this.position = new Vector(x, y); // The position of the sprite as a Vector
        this.scale = scale; // The scaling factor
        this.width = width * this.scale; // The width of the sprite, adjusted by scale
        this.height = height * this.scale; // The height of the sprite, adjusted by scale
        this.image = new Image(); // Create a new image element
        this.loaded = false; // Flag to indicate if the image is loaded
  
        // Handle image loading
        this.image.onload = () => {
            this.loaded = true;
            if (typeof onLoadCallback === "function") {
                onLoadCallback(); // Call the provided callback when the image is ready
            }
        };
  
        // Handle image loading errors
        this.image.onerror = () => console.error(`Error loading image: ${imageSrc}`);
  
        this.image.src = imageSrc; // Set the image source
      
        if (render && typeof render.addSprite === "function") {
            render.addSprite(this);
        } else {
            console.log("Render was not provided or does not have an addSprite method. Skipping sprite addition.");
        }
    }
  }

export default Sprite;