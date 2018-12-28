import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class HouseRoofMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0x0');
        this.materialDiffuse = Util.Hex2Vec4('0x642100');
        this.materialSpecular = Util.Hex2Vec4('0xeeeeee');
        this.materialShininess = 100.0;
    }
}