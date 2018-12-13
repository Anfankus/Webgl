import {Material} from "../interface/Material";
import {vec4} from "../MV";
import { Util } from "../Util";

export class CustomizedMaterial implements Material {
  materialAmbient: Array<number>;
  materialDiffuse: Array<number>;
  materialShininess: number;
  materialSpecular: Array<number>;

  constructor() {
    this.materialAmbient = vec4(0, 0.5, 0.5, 1.0);
    this.materialDiffuse = Util.Hex2Vec4('0xffff00')
    this.materialSpecular = Util.Hex2Vec4('0x9d9d9df0')
    this.materialShininess = 1.0;

  }
}