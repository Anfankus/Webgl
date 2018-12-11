import { Material } from "../interface/Material";
import { vec4 } from "../MV";

export class NoneMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
        this.materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
        this.materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
        this.materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
        this.materialShininess = 20.0;
    }
}