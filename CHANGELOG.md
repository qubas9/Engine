# Changelog

NOT All notable changes to this project will be documented in this file.

## [Unreleased]

## [2.6.0] - 2025-09-23

### ADD

-LevelLoading event

## [2.5.0] - 2025-09-23

### ADD

- RenderHUD event

## [2.4.1] - 2025-09-17

### FIX

-physic and GameLoop should now properly end it self when destroyed

## [2.4.0] - 2025-09-17

### ADD

-destroy methods for physic and gameloop

### FIX

-physic now properly stops after End event is called do to the LevelLoader using the new destroy method

## [2.3.2] - 2025-09-14

### FIX
-fixed dependencies

## [2.3.1] - 2025-09-14

### FIX
-fixed dependencies

## [2.3.0] - 2025-09-14

### ADD

-Event MaxSpeedReached
-Event Frame

## [2.2.2] - 2025-09-14

### FIX
-level size is now corectly calculated

## [2.2.1] - 2025-09-07

### FIX
-proper detecting of maxXspeed in both directions

## [2.2.0] - 2025-09-07

### ADD
-inAirAccelerationDrag

### FIX
-left maxXspeed now works properly

## [2.1.0] - 2025-09-07

### ADD

-new coretool Event It alow inner comunication based on events 
-new EventBlock and EventMovingBlock that emit custom events insted of normal onCollision and touching functions
-levelLoader can now load nex level from a list of levels gived to it and emit NoMoreLevels when it tryes to load beond last level

### FIX

-better entity colisions

## [2.0.0] - 2025-08-11

### ADD

-automatic camera boundres
-moving block suport in level

### REMOVED

-suport for manual boundres

### FIX

-x camera is now working in every scale properly
-y camera is now working in every scale properly

## [1.7.2-0] - 2025-08-04
## [1.7.1-1] - 2025-08-04

-Nothing changed just test of discord relese notifications

## [1.7.0] - 2025-08-04

### ADD
-MovingBlock
-Player
-Sprite
-Block
-Entity
-LevelLoader
-Render
-GameLoop
