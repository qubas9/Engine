import {Block,Player,Entity,Sprite,MovingBlock,Physic, Render, GameLoop} from "./engine.js"

class LevelLoader{
    constructor(setings){
        if (setings){
            this.defaulSetings = setings
        }
    }

    loadLevel(level){
        let setings
        if(level.setings == "default" && this.defaulSetings){
            setings = this.defaulSetings
        }else{
            setings = level.setings
        }
        this.physic = new Physic()
        this.render = new Render(setings.render || {with: 200, height: 200, scale:1})
        this.elemetsLoaded = []
        this.numOfElements = 0
        this.grid

        if (level.grid){
            level.grid.forEach((array,i) => {
                array.forEach((e,j) => {
                    if(e){
                        let element = {...setings[e]}
                        element.setings.onLoadCallback = this.elementLoaded.bind(this)
                        element.setings.y = i*setings.grid.size
                        element.setings.x = j*setings.grid.size
                        this.addElement(element)
                        this.numOfElements++
                    }
                })
            });
        }
        this.waitToLoad(setings);
        }

    addElement(element){
        if (element.type == "block"){
            this.addGame(element.setings)
            new Block(element.setings)
        }else if (element.type == "player"){
            this.addGame(element.setings)
            let p = new Player(element.setings)
            this.render.cameraFolow(p.position)
        }else if (element.type == "entity"){
            this.addGame(element.setings)
            new Entity(element.setings)
        }else if (element.type == "sprite"){
            this.addGame(element.setings)
            new Sprite(element.setings)
        }else if (element.type == "movingBlock"){
            this.addGame(element.setings)
            new MovingBlock(element.setings)
        }
    }

    elementLoaded(){
        this.elemetsLoaded.push(true)
    }

    addGame(setings){
        setings.physic = this.physic
        setings.render = this.render
        return setings
    }

    waitToLoad(setings) {
            if(this.numOfElements != this.elemetsLoaded.length) {
                 window.setTimeout(this.waitToLoad.bind(this,setings), 100); /* this checks the flag every 100 milliseconds*/
            } else {
            /* do something*/
            setings.GameLoop = this.addGame(setings.GameLoop || {fps:60,physic:{},render:{}})
            this.GameLoop = new GameLoop(setings.GameLoop)
            this.GameLoop.start()
            }
          }
}

export default LevelLoader