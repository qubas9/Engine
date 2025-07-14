class GameLoop {
    /**
     * Creates an instance of GameLoop.
     * @param {Physic} physic - An instance of the Physic class that manages
     * @param {Render} render - An instance of the Render class that manages rendering.
     * @param {number} kinitialDeltaTime - The initial delta time for the first frame (default is 0.05 seconds).
     */
    constructor(physic, render, initialDeltaTime = 0.05) {
        this.functions = []; // Array to store additional functions
        this.lastTime = 0;
        this.deltaTime = 0;
        this.isRunning = false;
        this.pysics = physic; // Assuming physic is an instance of a class that manages physics
        this.render = render; // Assuming render is an instance of a class that manages rendering
        this.initialDeltaTime = initialDeltaTime; // Initial delta time for the first frame
    }

    /**
     * Starts the game loop.
     * This method initializes the loop and starts the rendering and physics updates.
     */

    start() {
        if (this.isRunning) {
            console.warn("Game loop is already running.");
            return; // Prevent starting the loop if it's already running
        }
        this.isRunning = true;

        let callback = ()=>{
            requestAnimationFrame(this.#loop.bind(this))
        }
        
        
        this.render.render(callback.bind(this));
    }

    /**
     * The main loop of the game.
     * This method is called every frame to update the physics and render the scene.
     * @param {number} currentTime - The current time in milliseconds.
     */
    #loop(currentTime) {
        if (this.lastTime === 0) {
            this.lastTime = currentTime; // Initialize lastTime on the first call
            this.deltaTime = this.initialDeltaTime; // Set deltaTime to 0 on the first call
        }else{
            this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
            this.lastTime = currentTime;
        }

        for (let fn of this.functions) {
            fn(this.deltaTime); // Call each function with the delta time
        }
        this.pysics.update(this.deltaTime); // Update physics            
        this.render.render(); // Render the scene
    
        if (this.isRunning) {
             // Exit the loop if stopped
            requestAnimationFrame(this.#loop.bind(this));
        }
    }

    /**
     * Stops the game loop.
     */
    stop() {
        this.isRunning = false;
        // Perform any cleanup if necessary
        console.log("Game loop stopped.");
    }

    /**
     * Steps the game loop, useful for testing or manual control.
     * if game loop is running, it will stop the loop and call it once.
     * @param {number} byTime - The time in milliseconds to step the game loop (default is 50 ms).
     */
    step(byTime = 50) {
        if (this.isRunning){
            this.isRunning = false; // Stop the loop
            this.#loop(this.lastTime+byTime); // Call the loop once with the current time
        }
    }

    /**
     * Adds a function to be called in the game loop.
     * @param {Function} fn - The function to be added to the game loop. It will be provided with the delta time as an argument.
     * @throws {Error} If the provided argument is not a function.
     */
    addFunction(fn) {
        if (typeof fn === 'function') {
            this.functions.push(fn); // Assuming functions is an array to store additional functions
        } else {
            console.error("Provided argument is not a function.");
        }
    }
}

export default GameLoop; // Ensure GameLoop is exported as default