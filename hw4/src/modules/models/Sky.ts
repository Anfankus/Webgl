import { Ellipsoid } from "../models/Basis/Ellipsoid";
import { SkyMaterial } from "../materials/SkyMaterial";
import { Util } from "../Util";
import { rotateX } from "../MV";
import GL from "../GL";

export class Sky extends Ellipsoid {
    constructor() {
        super(500,500,[0,0,0],'');
        this.material=new SkyMaterial;
        for(let i in this.normals){
            this.normals[i]=-this.normals[i];
        }
        this.setChoice(3);
    }
    public sunset(degree:number){
        let t=Math.sin((degree%36)/36*2*Math.PI)+0.2;
        //let rotate=(degree+18)%36-18;
        this.rotateMatrix=[
            [t,0,0,0],
            [0,t,0,0],
            [0,0,t,0],
            [0,0,0,1]
        ]
    }
    draw(gl: GL): void {
        gl.clearNormalize();
        super.draw(gl);
        gl.setNormalize();
    }
}