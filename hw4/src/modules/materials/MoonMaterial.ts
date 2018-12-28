import { Material } from "../interface/Material";
import { Util } from "../Util";

export class MoonMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x0');
        this.materialDiffuse = Util.Hex2Vec4('0x0045aa');
        this.materialSpecular = Util.Hex2Vec4('0x030303');
        this.materialShininess = 5.0;
    }
}