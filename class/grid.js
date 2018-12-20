
const WaveParameter = require("../config/wave-parameter");
const cellStatus = require("../config/cell-status");

module.exports = class grid {
    constructor(wave) {
        Object.defineProperties(this, {
            timer: { value: null, enumerable: false },
            cellByCoords: { value: {}, enumerable: false }
        })
        this.moleHit = 0
        this.params = WaveParameter[wave]
        this.cells = []
        this.generate();
    }

    generate(){
        for(let i=0;i<this.params.lines;i++){
            for(let j=0;j<this.params.columns;j++){
               const cell = {x:i,y:j,status:cellStatus.VoidHole, statusTickCounter:0}
               this.cellByCoords[i+','+j] = cell
               this.cells.push(cell)
            }
        }
    }

    nextRound(){
        for(const cell of this.cells) {
            this.checkCell(cell)
        }
    }

    checkRandomRatio(ratio) {
        return 0 === Math.floor(Math.random() / ratio)
    }

    get isDone() {
        return this.moleHit >= this.params.nbMole
    }

    hitCell(x, y) {
        const cell = this.cellByCoords[`${x},${y}`]
        if(cell.status !== cellStatus.MoleOut) return false
        
        cell.status = cellStatus.MoleDown
        cell.statusTickCounter = 0;
        this.moleHit++
        return true
    }

    checkCell(cell){
        switch(cell.status){
            case cellStatus.VoidHole:
                if(this.checkRandomRatio(this.params.cellSpawnRatio)){
                    cell.status = cellStatus.MoleOut
                    cell.statusTickCounter = 0
                }
                
                break;
            case cellStatus.MoleOut:
                if(this.checkRandomRatio(this.params.cellHideRatio)){
                    cell.status = cellStatus.VoidHole
                    cell.statusTickCounter = 0
                }
                break;
            case cellStatus.MoleDown:
                if(cell.statusTickCounter >= this.params.cellMoleDownTick) {
                    cell.status = cellStatus.LockedHole
                    cell.statusTickCounter = 0
                }
                break;
            case cellStatus.LockedHole:
                if(cell.statusTickCounter >= this.params.cellLockedTick) {
                    cell.status = cellStatus.VoidHole
                    cell.statusTickCounter = 0
                }
                break;
            default:
                console.log('cas inconnu')
        }
        cell.statusTickCounter++
    }
}
