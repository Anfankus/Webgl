import { Translatable } from "../../interface/Translatable";
import Drawable from "../../interface/Drawable";
import { Material } from "../../interface/Material";
import { Circle3D } from "./Basis";
import { Util } from "../../Util";
import GL from "../../GL";
import { flatten } from "../../MV";

export class Ellipsoid extends Translatable implements Drawable{
    buffers: any;
    material:Material;
    public vertices: Array<number>;
    public normals:Array<number>;
    public colors: Array<number>;
    public baseCircle: Circle3D;
    constructor(a, b, position, color: string | Array<number>) {
        super();
        this.baseCircle = new Circle3D(a, b);
        this.vertices = [];
        this.normals=[];
        this.colors = [];
        let last = this.baseCircle.vertices;
        let frag = 30;

        let [xp, yp, zp] = position;
        let eachDegree = 180 / frag;
        let rotateM = Util.rotateY(eachDegree);

        let _color = Array.isArray(color) ? color : Util.Hex2Vec4(color);
        for (let i = 0; i < frag; i++) {
            let newVer = [];
            for (let j = 0; j < this.baseCircle.vertices.length; j += 3) {
                this.colors.push(..._color, ..._color);
                this.vertices.push(last[j] + xp, last[j + 1] + yp, last[j + 2] + zp);
                this.normals.push(last[j] + xp, last[j + 1] + yp, last[j + 2] + zp);
                let newEle=Util.Mat3Vec(rotateM,last.slice(j,j+3));
                newEle.pop();
                newVer.push(...newEle);
                for(let index in newEle){
                    this.vertices.push(newEle[index] + position[index]);
                    this.normals.push(newEle[index] + position[index]);
                }
            }
            last = newVer;
        }
    }
    initBuffer(gl: GL): void {
        let _gl=gl.gl;
        this.buffers={
            position:_gl.createBuffer(),
            normal:_gl.createBuffer()
        }
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.position);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.vertices), _gl.STATIC_DRAW);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normal);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.normals), _gl.STATIC_DRAW);

    }
    draw(gl: GL): void {
        let _gl = gl.gl;
    
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.position);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normal);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);

        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.vertices.length / 3)

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);
    }
    setMaterial(m:Material){
        this.material=m;
    }

}