
const WaveParameter = require("./wave-parameter");

module.exports = class grid {
    constructor(wave) {
        Object.defineProperties(this, {
            parameter: { value: WaveParameter[wave], enumerable: false },
            moleLeft: { value: WaveParameter[wave].nbTaupe, enumerable: false }
        })

        this.cells = {}
        this.createGrid();
    }

    createGrid(){
        for(let i=0;i<this.parameter.lines;i++){
            for(let j=0;j<this.parameter.columns;j++){
                this.cells['cell-'+i+'-'+j]={x:i,y:j,status:0}
            }
        }
        console.log(this.cells);

        //populate grid
    }
}
