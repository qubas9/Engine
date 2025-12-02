# Type3Games Engine Documentation

## Overview

Type3Games Engine is a modular 2D game engine written in JavaScript. It provides a robust foundation for creating 2D games with features like physics, rendering, event handling, and level loading. The engine is designed with a component-based architecture focusing on modularity and extensibility.

## Technical Architecture

### Module Structure
```
engine.js            - Main entry point and module exports
coretools/          - Core utilities and systems
  ├── vector.js     - Vector mathematics
  ├── hitbox.js     - Collision detection
  ├── controls.js   - Input handling
  └── event.js      - Event management
blocks/             - Block type implementations
  ├── block.js      - Base block class
  ├── movingBlock.js - Moving block implementation
  ├── eventBlock.js  - Event-emitting block
  └── eventMovingBlock.js - Combined moving and event block
entities/           - Game entities
  ├── entity.js     - Base entity class
  └── player.js     - Player implementation
```

### Import/Export Structure
The engine uses ES6 modules with named exports from `engine.js`:
```javascript
export {
  LevelLoader, Player, Entity, GameLoop,
  Sprite, Render, Block, Physic,
  MovingBlock, EventBlock, EventMovingBlock
};
```

The engine uses ES6 modules with named exports from `coretools.js` for some helper libraries:
```javascript
export {
  Event, Vector, Hitbox, Control
};
```

## Core Components

### 1. Game Loop (`GameLoop`)
The central component that manages the game's update and render cycle.

#### Constructor Parameters
```javascript
{
  physic: PhysicSystem,    // Physics system instance
  render: RenderSystem,    // Render system instance
  fps: number             // Target frames per second (default: 60)
}
```

#### Properties
- `isRunning: boolean` - Current running state
- `frameDuration: number` - Milliseconds between frames (calculated from fps)
- `deltaTime: number` - Time between frames in seconds
- `ended: boolean` - Whether the game loop has ended

#### Methods
- `start()` - Starts the game loop
- `stop()` - Stops the game loop
- `step()` - Executes a single frame update
- `addFunction(fn: Function)` - Adds a function to be called each frame
- `destroy()` - Cleans up and stops the game loop

#### Update Sequence
1. Execute custom functions
2. Emit `Frame` event with deltaTime
3. Update physics
4. Render frame
5. Calculate FPS metrics (if enabled)

#### Events
- `Frame(deltaTime: number)` - Emitted each frame with time elapsed
- Timing is managed using `performance.now()` for precision
- Uses `setTimeout` for frame timing with half frame duration offset

### 2. Rendering System (`Render`)
Handles all visual aspects of the game using HTML5 Canvas.

#### Constructor Parameters
```javascript
{
  width?: number,         // Canvas width (default: window.innerWidth)
  height?: number,        // Canvas height (default: window.innerHeight)
  scale?: number,         // Rendering scale factor
  background?: number[],  // RGB background color [r,g,b] (default: [250,250,250])
  camera?: Vector,        // Initial camera position
  cameraMinX?: number,    // Minimum X camera bound
  cameraMinY?: number,    // Minimum Y camera bound
  cameraMaxX?: number,    // Maximum X camera bound
  cameraMaxY?: number,    // Maximum Y camera bound
  debug?: boolean         // Enable debug visualization
}
```

#### Core Features
- **Canvas Management**
  - Automatically creates and appends canvas to document
  - Handles canvas scaling and viewport adjustments
  - CSS reset for full-screen display

- **Camera System**
  ```javascript
  setCameraBoundres(maxX: number, maxY: number)
  cameraFolow(vector: Vector)
  ```
  - Smooth camera following
  - Boundary constraints
  - Scale-aware positioning

- **Sprite Management**
  ```javascript
  addSprite(sprite: Sprite)
  makeSprite(x: number, y: number, imageSrc: string, width: number, height: number)
  ```
  - Automatic sprite registration
  - Visibility culling
  - Scale-aware rendering

- **Debug Visualization**
  - Hitbox outlines (red)
  - Line width: 0.1 units
  - Camera bounds indication

#### Rendering Pipeline
1. Clear canvas with background color
2. Apply camera transformation
3. Apply scale transformation
4. Render all loaded sprites
5. Draw debug information (if enabled)
6. Emit HUD render event

#### Events
- `RenderHUD(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)` 
  - Emitted after main rendering
  - Provides context for HUD drawing
  - Uses reset transformation matrix

### 3. Physics System (`Physic`)
Manages physical interactions and simulation between game objects.

#### System Components
```javascript
class Physic {
    blocks: Block[]        // Static collision objects
    entities: Entity[]     // Dynamic physics objects
    updatable: Object[]    // Objects requiring updates
    ended: boolean         // System state flag
}
```

#### Entity Physics Properties
- Position (Vector)
- Velocity (Vector)
- Acceleration (Vector)
- Gravity (Vector, default: 0, 500)
- Ground state detection
- Collision response

#### Collision Detection
- Hierarchical checking:
  1. Entity-Block collisions
  2. Ground sensor checks
  3. Precise hitbox intersection

- Collision Response Types:
  ```javascript
  // Direction vectors for collision
  LEFT:   Vector(-1, 0)
  RIGHT:  Vector(1, 0)
  TOP:    Vector(0, -1)
  BOTTOM: Vector(0, 1)
  ```

#### Update Cycle
1. Update all updatable objects
2. Update entity physics
   - Apply gravity
   - Update velocities
   - Apply friction
3. Check and resolve collisions
4. Update ground states
5. Reset acceleration

#### Registration Methods
```javascript
addBlock(block: Block)       // Add static collision object
addEntity(entity: Entity)    // Add dynamic physics object
addUpdatable(obj: Object)    // Add updateable object
```

#### Physics Parameters
- Default gravity: `new Vector(0, 500)`
- Collision offset: 1 unit
- Ground sensor height: 1 unit
- Friction range: 0-1 (default: 0.99)

### 4. Level System (`LevelLoader`)
Manages level loading, object instantiation, and level progression.

#### Constructor Parameters
```javascript
{
  settings?: Object,      // Default level settings
  pathPrefix?: string,    // Path prefix for assets
  levelList?: string[]    // Array of level names
}
```

#### Level JSON Structure
```javascript
{
  name?: string,          // Level name (default: filename)
  settings: {
    grid: {
      size: number        // Grid cell size
    },
    render: {
      scale: number,      // Render scale
      background: number[] // RGB background color
    },
    // Object type definitions
    [key: string]: {
      type: string,       // Object type identifier
      settings: {         // Type-specific settings
        imageSrc: string,
        width: number,
        height: number,
        [key: string]: any
      }
    }
  },
  grid: (string|string[])[][] // Level layout matrix
}
```

#### Object Type Mappings
```javascript
const TYPE_MAP = {
  'block': Block,
  'player': Player,
  'entity': Entity,
  'sprite': Sprite,
  'movingBlock': MovingBlock,
  'eventBlock': EventBlock,
  'eventMovingBlock': EventMovingBlock
}
```

#### Level Loading Process
1. Parse JSON configuration
2. Convert Vector properties
3. Process grid layout
4. Create game objects
5. Set camera bounds
6. Initialize game loop

#### Asset Management
- Automatic path resolution
- Image preloading
- Resource loading tracking
- Load completion detection

#### Events
```javascript
LevelLoading(level: Object)              // Level start loading
LevelJSONLoaded(url: string)            // JSON loaded
DefaultSettingsJSONLoaded(url: string)   // Default settings loaded
LevelListMissing()                      // No level list
CurrentLevelNotSet()                    // No current level
CurrentLevelNotFound(levelName: string) // Level not in list
NoMoreLevels()                          // End of levels
End()                                   // Level ending
```

#### Level Progression
- Sequential level loading
- Automatic level transitions
- Level list management
- End-game detection

### 5. Core Tools

#### Event System (`Event`)
Global event management system for game-wide communication.

```javascript
const Event = {
  // Internal storage
  listeners: { [event: string]: Map<number, Function> },
  id: number,
  index: Map<number, string>,

  // Methods
  on(event: string, callback: Function): number
  off(id: number): void
  emit(event: string, ...args: any[]): void
}
```

**Usage Example:**
```javascript
// Register listener
const id = Event.on("collision", (data) => {
  console.log(`Collision: ${data.entity} with ${data.block}`);
});

// Emit event
Event.emit("collision", { entity: player, block: wall });

// Remove listener
Event.off(id);
```

#### Vector System (`Vector`)
Comprehensive 2D vector mathematics implementation.

```javascript
class Vector {
  x: number
  y: number

  // Instance Methods
  get mag(): number                    // Vector magnitude
  add(vector: Vector): Vector          // Add vector
  sub(vector: Vector): Vector          // Subtract vector
  mult(scalar: number): Vector         // Multiply by scalar
  multTogether(vector: Vector): Vector // Component-wise multiply
  div(scalar: number): Vector          // Divide by scalar
  normalize(): Vector                  // Normalize to unit vector
  setMag(newMag: number): Vector      // Set magnitude
  copy(): Vector                       // Create copy

  // Static Methods
  static add(vecA: Vector, vecB: Vector): Vector
  static sub(vecA: Vector, vecB: Vector): Vector
  static mult(vecA: Vector, scalar: number): Vector
  static multTogether(vecA: Vector, vecB: Vector): Vector
  static div(vecA: Vector, scalar: number): Vector
  static dot(vecA: Vector, vecB: Vector): number
  static equal(vecA: Vector, vecB: Vector): boolean
}
```

#### Controls System (`Control`)
Sophisticated input handling system with recording capabilities.

```javascript
class Control {
  // Binding Types
  bind(name: string, key: string, callback: Function)        // Continuous
  bindOnce(name: string, key: string, callback: Function)    // Single press
  bindRelease(name: string, key: string, callback: Function) // On release
  bindReleaseOnce(name: string, key: string, callback: Function)
  bindWithReleaseTick(name: string, key: string, callback: Function)

  // Recording System
  startRecording(): void
  stopRecording(): RecordedEvent[]
  startPlayback(events: RecordedEvent[]): void
  stopPlayback(): void

  // State Management
  update(): void
  pause(): void
  unpause(): void

  // Configuration
  setBinding(name: string, type: string, key: string, callback: Function)
  updateBinding(name: string, newCallback: Function)
  updateBindingKey(name: string, newKey: string)
  exportBindings(): BindingConfig
}

interface RecordedEvent {
  type: "keydown" | "keyup"
  key: string
  frame: number
}
```

#### Hitbox System (`Hitbox`)
Efficient collision detection system.

```javascript
class Hitbox {
  offset1: Vector            // Top-left offset
  offset2: Vector            // Width and height
  position: Vector           // World position

  constructor(
    corner1: Vector,         // Top-left corner
    corner2: Vector,         // Dimensions
    position?: Vector        // World position (default: 0,0)
  )

  // Methods
  updatePosition(position: Vector): void
  isColliding(hitbox: Hitbox): boolean

  // Collision Algorithm
  // Returns true if rectangles overlap:
  // !(right1 < left2 || right2 < left1 || bottom1 < top2 || bottom2 < top1)
}
```

## Game Objects

### 1. Sprites (`Sprite`)
Base class for all visual objects.

```javascript
class Sprite {
  constructor(options: {
    x: number,              // X position
    y: number,              // Y position
    imageSrc: string,       // Image URL
    width: number,          // Sprite width
    height: number,         // Sprite height
    render?: Render,        // Render system
    onLoadCallback?: Function // Load completion callback
  })

  // Properties
  position: Vector          // World position
  width: number            // Sprite width
  height: number           // Sprite height
  image: HTMLImageElement  // Sprite image
  loaded: boolean         // Image load state
}
```

### 2. Entities (`Entity`)
Physics-enabled game objects.

```javascript
class Entity extends Sprite {
  constructor(config: {
    x: number,
    y: number,
    imageSrc: string,
    width: number,
    height: number,
    render: Render,
    physic: Physic,
    gravity?: Vector,
    collisionOffset?: number,
    onLoadCallback?: Function
  })

  // Physics Properties
  velocity: Vector
  acceleration: Vector
  gravity: Vector
  onGround: boolean
  touching: Block[]
  passableOnGround: boolean[]

  // Collision
  hitbox: Hitbox
  groundSensor: Hitbox

  // Methods
  update(deltaTime: number): void
  afterUpdate(deltaTime: number): void
  addVelocity(velocity: Vector): void
  addAcceleration(acceleration: Vector): void
  checkCollision(block: Block): boolean
  onCollision(block: Block): void
  checkSensor(block: Block): boolean
}
```

### 3. Blocks

#### Basic Block (`Block`)
Foundation for solid game objects.

```javascript
class Block extends Sprite {
  constructor({
    x: number,
    y: number,
    imageSrc: string,
    width: number,
    height: number,
    render: Render,
    physic: Physic,
    friction?: number,     // Default: 0.99
    onLoadCallback?: Function
  })

  // Properties
  hitbox: Hitbox
  friction: number

  // Methods
  onCollision(entity: Entity, direction: Vector): void
  touching(entity: Entity): void
}
```

#### Moving Block (`MovingBlock`)
Blocks that move along a defined path.

```javascript
class MovingBlock extends Block {
  constructor(config: {
    startx: number,
    starty: number,
    endx: number,
    endy: number,
    routeTime: number,     // Time to complete path
    imageSrc: string,
    width: number,
    height: number,
    render: Render,
    physic: Physic,
    friction?: number,
    onLoadCallback?: Function
  })

  // Movement
  velocity: Vector
  start: Vector
  end: Vector
  routeTime: number
  exeptedError: number    // Position tolerance

  // Methods
  update(deltaTime: number): void
  touching(entity: Entity): void
  onCollision(entity: Entity, direction: Vector): void
}
```

#### Event Block (`EventBlock`)
Event-emitting blocks.

```javascript
class EventBlock extends Block {
  constructor(obj: {
    onCollisionEvent?: string,  // Default: "defaultOnColisionEvent"
    touchingEvent?: string,     // Default: "defaultTouchingEvent"
    // ... Block parameters
  })

  onCollision(entity: Entity, direction: Vector): void
  touching(entity: Entity): void
}
```

#### Event Moving Block (`EventMovingBlock`)
Combined moving and event-emitting blocks.

```javascript
class EventMovingBlock extends MovingBlock {
  constructor(obj: {
    onCollisionEvent?: string,
    touchingEvent?: string,
    // ... MovingBlock parameters
  })
}
```

### 4. Player (`Player`)
Player-controlled game entity.

```javascript
class Player extends Entity {
  constructor(input: {
    onClickAcceleration: number,
    inAirAccelerationDrag: number,
    maxXSpeed: number,
    maxBoost: number,
    jumpAcceleration: number,
    callBackMap?: Object,
    // ... Entity parameters
  })

  // Controls
  controls: Control

  // Movement Parameters
  onClickAcceleration: number
  inAirAccelerationDrag: number
  maxXSpeed: number
  maxBoost: number
  jumpAcceleration: number
  dragCorectionAplied: boolean

  // Methods
  left(This: Player): void    // Left movement
  right(This: Player): void   // Right movement
  jump(This: Player): void    // Jump action
  down(This: Player): void    // Downward movement

  // Events Emitted
  "MaxSpeedReached" - When reaching max speed
}
```

Key Features:
- Air/ground movement differentiation
- Friction-aware velocity adjustments
- Speed limiting and boost mechanics
- Ground state detection
- Recording/playback support

## Level Creation Guide

### Level JSON Schema
```typescript
interface LevelJSON {
  name?: string;           // Optional level name
  settings: {             // Corrected spelling
    grid: {
      size: number;       // Grid cell size in pixels
    };
    render: {
      scale: number;      // Render scaling factor
      background: [number, number, number]; // RGB values
      debug?: boolean;    // Enable debug visualization
    };
    // Object type definitions
    [key: string]: {
      type: "player" | "block" | "sprite" | "movingBlock" | "eventBlock" | "eventMovingBlock";
      settings: ObjectSettings;
    };
  };
  grid: (string | string[])[][]; // Level layout matrix
}

interface ObjectSettings {
  // Common properties
  imageSrc: string;      // Path to sprite image
  width: number;         // Object width
  height: number;        // Object height

  // Physics properties
  friction?: number;     // Block friction (0-1)
  routeTime?: number;    // Moving block path time

  // Player-specific
  onClickAcceleration?: number;
  jumpAcceleration?: number;
  inAirDrag?: number;
  inAirAccelerationDrag?: number;
  gravity?: {
    x: number;
    y: number;
  };
  maxXSpeed?: number;
  maxBoost?: number;
  collisionOffset?: number;

  // Event properties
  onCollisionEvent?: string;
  touchingEvent?: string;
}
```

### Grid Layout Specification

#### Basic Syntax
```javascript
"grid": [
  ["b","p", "", "m", "e"],  // Row 0
  ["b", "b", "", "", ""],   // Row 1
  ["b", "", "","", ""]      // Row 2
]
```

#### Object Type Keys
- `p` - Player spawn point
- `b` - Static block
- `s` - Static sprite
- `m` - Moving block
- `e` - Event block
- `E` - Event moving block
- `""` - Empty space

#### Moving Block Format
```javascript
["m", "2"]  // Moving block with target point "2"
```
First element is the block type, second is the target point identifier.

#### Complete Example
```javascript
{
  "settings": {
    "grid": { "size": 32 },
    "p": {
      "type": "player",
      "settings": {
        "imageSrc": "./player.png",
        "width": 30,
        "height": 30,
        "onClickAcceleration": 200,
        "jumpAcceleration": 110,
        "inAirDrag": 1,
        "gravity": { "x": 0, "y": 300 },
        "maxXSpeed": 640,
        "maxBoost": 1200,
        "collisionOffset": 1
      }
    },
    "b": {
      "type": "block",
      "settings": {
        "width": 32,
        "height": 32,
        "imageSrc": "./block.png",
        "friction": 0.9
      }
    }
  },
  "grid": [
    ["b","p", "", ["m","2"], ""],
    ["b", "b", "", "2", "e"],
    ["b", "b", "b", "b", "b"]
  ]
}
```



## Implementation Guide

### Basic Setup
```javascript
import { LevelLoader, Event } from "./engine.js";

// Initialize with level sequence
const loader = new LevelLoader({
    levelList: ["level1", "level2"],
    pathPrefix: "./levels/",  // Optional asset path prefix
    settings: {               // Optional default settings
        grid: { size: 32 },
        render: {
            scale: 2,
            background: [240, 240, 240]
        }
    }
});

// Load first level
loader.loadJSON("level1.json");
```

### Event Handling System
```javascript
// Core game events
Event.on("LevelLoading", (level) => {
    console.log("Loading level:", level.name);
});

Event.on("Frame", (deltaTime) => {
    // Update game logic
});

Event.on("RenderHUD", (ctx, canvas) => {
    // Draw HUD elements
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 20);
});

// Physics events
Event.on("EntityCollision", ({entity, block, position}) => {
    // Handle collision logic
});

// Level progression
Event.on("NoMoreLevels", () => {
    // Handle game completion
});

// Custom events
Event.on("PowerupCollected", (data) => {
    // Handle powerup effects
});
```

### Custom Block Creation
```javascript
class CustomBlock extends Block {
    constructor(config) {
        super(config);
        this.customProperty = config.customProperty;
    }

    onCollision(entity, direction) {
        super.onCollision(entity, direction);
        // Custom collision behavior
        Event.emit("CustomBlockHit", {
            entity: entity,
            block: this
        });
    }
}
```

## Technical Limitations

### 1. Threading Model
- Single-threaded JavaScript execution
- Main thread handles all calculations
- No Web Worker support currently
```javascript
// Current synchronous update model
update(deltaTime) {
    this.physics.update(deltaTime);
    this.entities.forEach(e => e.update(deltaTime));
    this.render.render();
}
```

### 2. Rendering System
- HTML5 Canvas API only
- No WebGL acceleration
- Limited to 2D contexts
```javascript
// Current rendering initialization
this.ctx = this.canvas.getContext("2d");
// No support for:
// this.ctx = this.canvas.getContext("webgl");
```

### 3. Collision System
- Axis-Aligned Bounding Box (AABB) only
- No support for rotated rectangles
- No polygon collision support
```javascript
// Current collision check
isColliding(hitbox) {
    return !(
        (this.position.x + this.offset2.x < hitbox.position.x + hitbox.offset1.x) ||
        (hitbox.position.x + hitbox.offset2.x < this.position.x + this.offset1.x) ||
        (this.position.y + this.offset2.y < hitbox.position.y + hitbox.offset1.y) ||
        (hitbox.position.y + hitbox.offset2.y < this.position.y + this.offset1.y)
    );
}
```
