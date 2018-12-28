import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class HouseMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x0');
        this.materialDiffuse = Util.Hex2Vec4('0xFFF8D7');
        this.materialSpecular = Util.Hex2Vec4('0x2f2f2f');
        this.materialShininess = 100;
    }
}