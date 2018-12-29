import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class HouseMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x998d8d');
        this.materialDiffuse = Util.Hex2Vec4('0xffecbf');
        this.materialSpecular = Util.Hex2Vec4('0x2f2f2f');
        this.materialShininess = 100;
    }
}