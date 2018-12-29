import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class HouseRoofMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0xd3866c');
        this.materialDiffuse = Util.Hex2Vec4('0xf5a88e');
        this.materialSpecular = Util.Hex2Vec4('0xeeeeee');
        this.materialShininess = 5.0;
    }
}