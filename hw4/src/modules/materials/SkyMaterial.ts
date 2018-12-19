import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class SkyMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0xd8d8d8');
        this.materialDiffuse = Util.Hex2Vec4('0xd0d0ff');
        this.materialSpecular = Util.Hex2Vec4('0x0');
        this.materialShininess = 5.0;
    }
}