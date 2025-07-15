import Render from './render.js';
import Sprite from './sprite.js';
import Physic from './physic.js';
import GameLoop from './gameloop.js';
import Block from './blocks/block.js';
import MovingBlock from './blocks/movingBlock.js';
import Entity from './entities/entity.js'; 

/**
 * @typedef {import('./render.js').default} Render
 * @typedef {import('./sprite.js').default} Sprite
 * @typedef {import('./physic.js').default} Physic
 * @typedef {import('./gameloop.js').default} GameLoop
 * @typedef {import('./blocks/block.js').default} Block
 * @typedef {import('./blocks/movingBlock.js').default} MovingBlock
 * @typedef {import('./entities/entity.js').default} Entity
 */


export {
  Entity,
  GameLoop,
  Sprite,
  Render,
  Block,
  Physic,
  MovingBlock
};