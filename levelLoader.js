import { Vector,Event } from "./coretools.js"
import {EventMovingBlock,EventBlock,Block,Player,Entity,Sprite,MovingBlock,Physic, Render, GameLoop} from "./engine.js"

class LevelLoader{
    constructor({settings,pathPrefix,levelList}){
        if (settings){
            this.defaultSettings = settings
        }
        this.pathPrefix = pathPrefix || ""
        this.xmax = 0
        this.ymax = 0
        this.levelList = levelList
        Event.on("NextLevel",this.nextLevel.bind(this))
        Event.on("End",(() => {this.GameLoop.destroy();}).bind(this))
    }

    loadLevel(level){
        this.xmax = 0
        this.ymax = 0
        this.currentLevel = level.name || "unnamedLevel"
        let settings
        if(level.settings == "default" && this.defaultSettings){
            settings = this.defaultSettings
        }else{
            settings = level.settings
        }

        for(let element in settings){
            if(!settings[element].settings || !settings[element].settings.imageSrc){continue}
            settings[element].settings.imageSrc = this.pathPrefix + settings[element].settings.imageSrc
        }

        this.physic = new Physic()
        this.render = new Render(settings.render || {with: 200, height: 200, scale:1})
        this.elementsLoaded = []
        this.numOfElements = 0
        this.grid
        let positions = {}
        let waitList = []
        if (level.grid){
            level.grid.forEach((array,i) => {
                if (array.length > this.xmax){this.xmax = array.length}
                if (i > this.ymax){this.ymax = i}
                array.forEach((e,j) => {
                    if(e){
                        if (settings[e]){
                            let element = {...settings[e]}
                            element.settings.onLoadCallback = this.elementLoaded.bind(this)
                            element.settings.y = i*settings.grid.size
                            element.settings.x = j*settings.grid.size
                            this.addElement(element)
                            this.numOfElements++
                        }else if(Array.isArray(e)){
                            let element = {...settings[e[0]]}
                             waitList.push([element,[e[1],i,j]])
                            

                        }else{
                            positions[e] = [i*settings.grid.size,j*settings.grid.size]
                        }
                    }
                })
            })
            waitList.forEach((element) => {
                element[0].settings.onLoadCallback = this.elementLoaded.bind(this)
                element[0].settings.starty = element[1][1]*settings.grid.size
                element[0].settings.startx = element[1][2]*settings.grid.size
                element[0].settings.endy = positions[element[1][0]] ? positions[element[1][0]][0] : element[1][1]*settings.grid.size
                element[0].settings.endx = positions[element[1][0]] ? positions[element[1][0]][1] : element[1][2]*settings.grid.size
                this.addElement(element[0])
                this.numOfElements++                  
            })
        }
        this.render.setCameraBoundres(this.xmax * settings.grid.size,(this.ymax+1) * settings.grid.size)
        Event.emit("LevelLoading",level)
        this.waitToLoad(settings);
        }

    addElement(element){
        this.addGame(element.settings);
        switch (element.type) {
            case "block":
            new Block(element.settings);
            break;
            case "player":
            let p = new Player(element.settings);
            this.render.cameraFolow(p.position);
            break;
            case "entity":
            new Entity(element.settings);
            break;
            case "sprite":
            new Sprite(element.settings);
            break;
            case "movingBlock":
            new MovingBlock(element.settings);
            break;
            case "eventBlock":
            new EventBlock(element.settings);
            break;
            case "eventMovingBlock":
            new EventMovingBlock(element.settings);
            break;
            default:
                console.warn(`Unknown element type: ${element.type}`);
                break;
        }
    }

    elementLoaded(){
        this.elementsLoaded.push(true)
    }

    parseJSON(json){
        let obj = JSON.parse(json)
        if (obj.settings == "default"){return obj}
        for (let element in obj.settings){
            if(!obj.settings[element].settings){continue}
            for(let parameter in obj.settings[element].settings){
                if(obj.settings[element].settings[parameter].x != undefined && obj.settings[element].settings[parameter].y != undefined){
                    obj.settings[element].settings[parameter] = new Vector(obj.settings[element].settings[parameter].x,obj.settings[element].settings[parameter].y)
                }
            }
        }
        return obj
    }

  
    loadJSON(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.pathPrefix + url, true);
        let callback = ()  => {
        if (xhr.status === 200) {
        let level = this.parseJSON(xhr.response)
        if (!level.name){
            level.name = url.replace(/^.*[\\/]/, "")
            level.name = level.name.split(".")[0]
        }
        this.loadLevel(level);
        Event.emit("LevelJSONLoaded",url)
        } else {
        throw new Error(`Chyba ${xhr.status} při načítání ${url}`);
        }
  }
        xhr.onload = callback.bind(this) ;

  xhr.onerror = function () {
    callback('Síťová chyba', null);
  };

  xhr.send();
}

loadDefaultFromJSON(url){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.pathPrefix + url, true);
        let callback = ()  => {
        if (xhr.status === 200) {
            this.defaultSettings = this.parseJSON(xhr.response).settings
            Event.emit("DefaultSettingsJSONLoaded",url)
        } else {
        throw new Error(`Chyba ${xhr.status} při načítání ${url}`);
        }
  }
        xhr.onload = callback.bind(this) ;

  xhr.onerror = function () {
    callback('Síťová chyba', null);
  };

  xhr.send();
    }

    addGame(settings){
        settings.physic = this.physic
        settings.render = this.render
        return settings
    }

    waitToLoad(settings) {
            if(this.numOfElements != this.elementsLoaded.length) {
                 window.setTimeout(this.waitToLoad.bind(this,settings), 100); /* this checks the flag every 100 milliseconds*/
            } else {
            /* do something*/
            settings.GameLoop = this.addGame(settings.GameLoop || {fps:60,physic:{},render:{}})
            this.GameLoop = new GameLoop(settings.GameLoop)
            this.GameLoop.start()
            }
          }
    nextLevel(){
        if (!this.levelList || !Array.isArray(this.levelList) || this.levelList.length === 0) {
            console.warn("Level list is missing or empty.");
            Event.emit("LevelListMissing");
            return;
        }
        if (!this.currentLevel || this.currentLevel === "unnamedLevel") {
            console.warn("Current level is not set or is unnamed.");
            Event.emit("CurrentLevelNotSet");
            return;
        }
        const currentLevelIndex = this.levelList.indexOf(this.currentLevel);
        if (currentLevelIndex === -1) {
            console.warn(`Current level '${this.currentLevel}' not found in level list.`);
            Event.emit("CurrentLevelNotFound", this.currentLevel);
            return;
        }
        const nextLevelIndex = (currentLevelIndex + 1);
        if (nextLevelIndex >= this.levelList.length) {
            console.warn("No more levels available.");
            Event.emit("NoMoreLevels");
            return;
        }
        this.currentLevel = this.levelList[nextLevelIndex];
        Event.emit("End");
        this.loadJSON(this.pathPrefix + this.currentLevel+".json");
    }
}

export default LevelLoader