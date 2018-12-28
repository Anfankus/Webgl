import {Material} from "../interface/Material";
import {vec4} from "../MV";
import { Util } from "../Util";

export class ButterFlyBodyMaterial implements Material {
  materialAmbient: Array<number>;
  materialDiffuse: Array<number>;
  materialShininess: number;
  materialSpecular: Array<number>;

  constructor() {
    this.materialAmbient = Util.Hex2Vec4('0x202020');
    this.materialDiffuse = Util.Hex2Vec4('0x030303');
    this.materialSpecular = Util.Hex2Vec4('0x444444');
    this.materialShininess = 5.0;

  }
}