
import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class WallMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x6f6f6f');
        this.materialDiffuse = Util.Hex2Vec4('0x808080');
        this.materialSpecular = Util.Hex2Vec4('0x0');
        this.materialShininess = 5.0;
    }
}