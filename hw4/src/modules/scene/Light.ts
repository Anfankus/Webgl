import { vec4 } from "../MV";
import { Util } from "../Util";

export class Light {
    public lightPosition: Array<number>;
    public lightAmbient: Array<number>;
    public lightDiffuse: Array<number>;
    public lightSpecular: Array<number>;
    constructor() {
        this.lightPosition = vec4(0, 0, 30, 1);
        this.lightAmbient = Util.Hex2Vec4('0xffffff');
        this.lightDiffuse = Util.Hex2Vec4('0xffffff');
        this.lightSpecular = Util.Hex2Vec4('0xffffff');
    }
}