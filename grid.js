
const WaveParameter = require("./wave-parameter");

module.exports = class grid {
    constructor(wave) {
        Object.defineProperties(this, {
            moleLeft: { value: WaveParameter[wave].nbTaupe, enumerable: false }
        })
        this.parameter=WaveParameter[wave]
        this.cells = {}
        this.createGrid();
    }

    createGrid(){
        for(let i=0;i<this.parameter.lines;i++){
            for(let j=0;j<this.parameter.columns;j++){
                this.cells['cell-'+i+'-'+j]={x:i,y:j,status:0}
            }
        }

        //populate grid
    }

    checkcell(cell){
        let selectedCell = this.cells['cell-'+cell.x+'-'+cell.y];
        console.log('selectedCell',selectedCell)
        switch(selectedCell.status){
            case 0:
                console.log('trou vide');
                break;
            case 1:
                console.log('taupe out');
                selectedCell.status = 2;
                break;
            case 3:
                console.log('trou deja fermer (comme laurent)');
                break;
            default:
                console.log('cas inconnu')
        }
    }
}
