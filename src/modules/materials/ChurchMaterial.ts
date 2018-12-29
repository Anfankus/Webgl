import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class ChurchMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0xc5baa3');
        this.materialDiffuse = Util.Hex2Vec4('0xd6cbb4');
        this.materialSpecular = Util.Hex2Vec4('0x0');
        this.materialShininess = 5.0;
    }
}