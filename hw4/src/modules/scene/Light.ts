import { vec4 } from "../MV";

export class Light{
    public lightPosition:Array<number>;
    public lightAmbient :Array<number>;
    public lightDiffuse :Array<number>;
    public lightSpecular:Array<number>;
    constructor(){
        this.lightPosition = vec4(0.0, 0.0, 5.0, 1.0);
        this.lightAmbient = vec4(0.0, 0.2, 0.2, 1.0);
        this.lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
        this.lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    }
}