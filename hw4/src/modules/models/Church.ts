import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten, mult, translate } from "../MV";
import { Material } from "../interface/Material";
import { NoneMaterial } from "../materials/NoneMaterial";
import { Util } from "../Util";
import { Translatable } from "../interface/Translatable";
import Collision, { ImpactType } from "../Collision/Collision";
import Collisible from "../interface/Collisible";
import { Cube } from "./Basis/Cube";
import { Tri_prism } from "./Basis/Tri_prism";
import { Rect_pyramid } from "./Basis/Rect_pyramid";
import { HalfCircle3D } from "./Basis/HalfCircle3D";
import Shaded from "../interface/Shaded";
export class Church extends Translatable implements Drawable,Collisible,Shaded {
    shaded: boolean;
    collision:Collision;
    material: Material;
    buffers: any;
    public building: Array<Cube>;
    public roof: Array<any>;
    public door: Array<any>;
    public window: Array<any>;
    constructor() {//size = 6*6
        super();
        //let [x, y, z] = position;
        this.material = new NoneMaterial;
        this.shaded=false;
        this.building = [
            new Cube(4, 5, 4, [0, 0, 0],null),
            new Cube(1.5, 6, 1.5, [- 1, 0,  1],null),
            new Cube(1.5, 6, 1.5, [3.5, 0,  1],null),
            new Cube(1.5, 6, 1.5, [- 1, 0,  - 3.5],null),
            new Cube(1.5, 6, 1.5, [ 3.5, 0, - 3.5],null)
        ];
        this.roof = [
            new Tri_prism(4, 0.8, 4, [0, 0 + 4.9999, 0],null),
            new Rect_pyramid(1.5, 1.2, [ - 1,  5.9999,  + 1],null),
            new Rect_pyramid(1.5, 1.2, [ + 3.5,  + 5.9999,  + 1],null),
            new Rect_pyramid(1.5, 1.2, [ - 1,  + 5.9999,  - 3.5],null),
            new Rect_pyramid(1.5, 1.2, [ + 3.5,  + 5.9999,  - 3.5],null)
        ];
        this.door = [
            new Cube(1.8, 2, 0.01, [ + 1.1,  + 0,  + 0.005],null),
            new HalfCircle3D(0.9, 0.9, [ + 1.1,  + 2,  + 0.00001],30,null),
        ];
        this.window = [
            new Cube(0.6, 0.8, 0.01, [ - 0.55, 0,  + 1.0005],null),
            new HalfCircle3D(0.3, 0.3, [ - 0.55,  + 0.8,  + 1.000001],30,null),
            new Cube(0.6, 0.8, 0.01, [ - 0.55,  + 2,  + 1.0005],null),
            new HalfCircle3D(0.3, 0.3, [ - 0.55,  + 2.8,  + 1.000001],30,null),
            new Cube(0.6, 0.8, 0.01, [ - 0.55,  + 4,  + 1.0005],null),
            new HalfCircle3D(0.3, 0.3, [ - 0.55,  + 4.8,  + 1.000001],30,null),
            new Cube(0.6, 0.8, 0.01, [ + 3.95, 0,  + 1.0005],null),
            new HalfCircle3D(0.3, 0.3, [ + 3.95,  + 0.8,  + 1.000001],30,null),
            new Cube(0.6, 0.8, 0.01, [ + 3.95,  + 2,  + 1.0005],null),
            new HalfCircle3D(0.3, 0.3, [ + 3.95,  + 2.8,  + 1.000001],30,null),
            new Cube(0.6, 0.8, 0.01, [ + 3.95,  + 4,  + 1.0005],null),
            new HalfCircle3D(0.3, 0.3, [ + 3.95,  + 4.8,  + 1.000001],30,null),
        ]
        this.collision=new Collision(ImpactType.ball,3);
        this.collision.setPosition(this.position);
    }
    initBuffer(gl: GL): void {

        //building
        for (let i in this.building) {
            this.building[i].initBuffer(gl)
        }
        //roof
        for (let i in this.roof) {
            this.roof[i].initBuffer(gl)
        }
        //door
        for (let i in this.door) {
            this.door[i].initBuffer(gl)
        }
        //window
        for (let i in this.window) {
            this.window[i].initBuffer(gl)
        }


    }
    draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;
        _gl.uniform1i(gl.programInfo.uniformLocations.bTexCoordLocation, 0);
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.normalMatrixLoc, false, flatten(this.rotateMatrix));
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));

        //building
        for (let i in this.building) {
            this.building[i].draw(gl,false);
        }
        //roof
        for (let i in this.roof) {
            this.roof[i].draw(gl,false)
        }
        //door
        for (let i in this.door) {
            this.door[i].draw(gl,false)
        }
        //window
        for (let i in this.window) {
            this.window[i].draw(gl,false)
        }
        if(this.shaded){
            this.drawShadow(gl,false);
        }

    }
    setShaded(): void {
        this.shaded=true;
    }
    clearShaded(): void {
        this.shaded=false;
    }
    drawShadow(gl: GL, self: boolean): void {
        let _gl=gl.gl;
        let transMatrix = mat4();
        transMatrix =mult(translate(...Util.Mat4Vec(mat4(-1),gl.currentLight.position)),this.modelMatrix);
        let m=mat4();
        m[3][3]=0;
        m[3][1]=-1/(gl.currentLight.position[1]-0.1);
        transMatrix=mult(m,transMatrix);
        transMatrix = mult(translate(...gl.currentLight.position), transMatrix);
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(transMatrix));
        _gl.uniform1i(gl.programInfo.uniformLocations.bTexCoordLocation, -1);

        for (let i in this.building) {
            this.building[i].drawShadow(gl,false);
        }
        //roof
        for (let i in this.roof) {
            this.roof[i].drawShadow(gl,false)
        }
    }
    setMaterial(m: Material) {
        this.material = m;
    }

}
