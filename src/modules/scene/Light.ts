import { vec4 } from "../MV";
import { Util } from "../Util";

export class Light {
    public lightPosition: Array<number>;
    public lightAmbient: Array<number>;
    public lightDiffuse: Array<number>;
    public lightSpecular: Array<number>;
    constructor() {
        this.lightPosition = vec4(2000, 2000, 2000, 1);
        this.lightAmbient = Util.Hex2Vec4('0xa0a0a0');
        this.lightDiffuse = Util.Hex2Vec4('0xffffff');
        this.lightSpecular = Util.Hex2Vec4('0xffffff');
    }
}