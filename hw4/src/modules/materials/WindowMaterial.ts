import { Material } from "../interface/Material";
import { Util } from "../Util";

export class WindowMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x9bc5ee');
        this.materialDiffuse = Util.Hex2Vec4('0xACD6FF');
        this.materialSpecular = Util.Hex2Vec4('0x0');
        this.materialShininess = 20.0;
    }
}