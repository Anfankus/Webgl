import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class GateMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x843f19');
        this.materialDiffuse = Util.Hex2Vec4('0x95502a');
        this.materialSpecular = Util.Hex2Vec4('0x080808');
        this.materialShininess = 2.0;
    }
}