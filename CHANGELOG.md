# Changelog

NOT All notable changes to this project will be documented in this file.

## [Unreleased]

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
