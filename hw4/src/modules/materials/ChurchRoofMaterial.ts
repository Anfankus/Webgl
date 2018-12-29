import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class ChurchRoofMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x415e71');
        this.materialDiffuse = Util.Hex2Vec4('0x233d55');
        this.materialSpecular = Util.Hex2Vec4('0xeeeeee');
        this.materialShininess = 5.0;
    }
}