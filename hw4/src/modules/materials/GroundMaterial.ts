import {Material} from "../interface/Material";
import {vec4} from "../MV";
import { Util } from "../Util";

export class GroundMaterial implements Material {
  materialAmbient: Array<number>;
  materialDiffuse: Array<number>;
  materialShininess: number;
  materialSpecular: Array<number>;

  constructor() {
    this.materialAmbient = Util.Hex2Vec4('0x202020');
    this.materialDiffuse = vec4(0.4, 1, 0.5,1.0)
    this.materialSpecular = Util.Hex2Vec4('0x080808')
    this.materialShininess = 20.0;

  }
}