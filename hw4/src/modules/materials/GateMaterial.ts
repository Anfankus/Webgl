import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class GateMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x0');
        this.materialDiffuse = Util.Hex2Vec4('0xBB5E00');
        this.materialSpecular = Util.Hex2Vec4('0x080808');
        this.materialShininess = 2.0;
    }
}