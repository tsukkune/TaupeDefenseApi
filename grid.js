
const WaveParameter = require("./wave-parameter");

module.exports = class grid {
    constructor(wave) {
        Object.defineProperties(this, {
            moleLeft: { value: WaveParameter[wave].nbTaupe, enumerable: false },
            timer: { value: null, enumerable: false },
            cellByCoords: { value: {}, enumerable: false }
        })
        this.params = WaveParameter[wave]
        this.cells = []
        this.generate();
    }

    generate(){
        for(let i=0;i<this.params.lines;i++){
            for(let j=0;j<this.params.columns;j++){
               const cell = {x:i,y:j,status:0, statusTickCounter:0}
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
        cell.status = 2
        cell.statusTickCounter = 0;
        this.moleHit++
    }

    checkCell(cell){
        switch(cell.status){
            case 0:
                if(this.checkRandomRatio(this.params.cellSpawnRatio)){
                    cell.status = 1
                    cell.statusTickCounter = 0
                }
                break;
            case 1:
                if(this.checkRandomRatio(this.params.cellHideRatio)){
                    cell.status = 0
                    cell.statusTickCounter = 0
                }
                break;
            case 2:
                if(cell.statusTickCounter >= 2) {
                    cell.status = 3
                    cell.statusTickCounter = 0
                }
                break;
            case 3:
                if(cell.statusTickCounter >= this.params.cellLockedTick) {
                    cell.status = 0
                    cell.statusTickCounter = 0
                }
                break;
            default:
                console.log('cas inconnu')
        }
        cell.statusTickCounter++
    }
}
