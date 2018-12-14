import { Translatable } from "../../interface/Translatable";
import Drawable from "../../interface/Drawable";
import { Material } from "../../interface/Material";
import { Circle3D } from "./Basis";
import { Util } from "../../Util";
import GL from "../../GL";
import { flatten, normalize, add, scale, cross, subtract, dot, negate } from "../../MV";
import { NoneMaterial } from "../../materials/NoneMaterial";
import { CustomizedMaterial } from "../../materials/CustomizedMaterial";

export class Ellipsoid extends Translatable implements Drawable {
    buffers: any;
    material: Material;
    public vertices: Array<number>;
    public normals: Array<number>;
    public baseCircle: Circle3D;
    constructor(a, b, position, color: string | Array<number>) {
        super();
        this.baseCircle = new Circle3D(a, b);
        this.vertices = [];
        this.normals = [];
        this.material = new CustomizedMaterial;
        let lastVer = this.baseCircle.vertices;
        let lastNor=this.baseCircle.normals;
        let frag = 50;

        let [xp, yp, zp] = position;
        let eachDegree = 190 / frag;
        let rotateM = Util.rotateY(eachDegree);

        for (let i = 0; i < frag; i++) {
            let newVer = [];
            let newNor=[];
            for (let j = 0; j < this.baseCircle.vertices.length; j += 3) {
                this.vertices.push(lastVer[j] + xp, lastVer[j + 1] + yp, lastVer[j + 2] + zp);
                //this.normals.push(...normalize(lastVer.slice(j, j + 3)));
                this.normals.push(...normalize(lastNor.slice(j, j + 3)));
                let newEle = Util.Mat3Vec(rotateM, lastVer.slice(j, j + 3));
                let newNorEle=Util.Mat3Vec(rotateM, lastNor.slice(j, j + 3));
                newEle.pop();
                newNorEle.pop();
                newVer.push(...newEle);
                newNor.push(...newNorEle);
                for (let index in newEle) {
                    this.vertices.push(newEle[index] + position[index]);
                }
                //this.normals.push(...normalize(newEle));
                this.normals.push(...normalize(newNorEle));

            }
            lastVer = newVer;
            lastNor = newNor;
        }
    }
    initBuffer(gl: GL): void {
        let _gl = gl.gl;
        this.buffers = {
            position: _gl.createBuffer(),
            normal: _gl.createBuffer()
        }
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.position);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.vertices), _gl.STATIC_DRAW);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normal);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.normals), _gl.STATIC_DRAW);

    }

    draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;
        //光照处理
        let lt = gl.currentLight;
        let ambientProduct = Util.Vec4Mult(lt.lightAmbient, this.material.materialAmbient);
        let diffuseProduct = Util.Vec4Mult(lt.lightDiffuse, this.material.materialDiffuse);
        let specularProduct = Util.Vec4Mult(lt.lightSpecular, this.material.materialSpecular);
        _gl.uniform4fv(gl.programInfo.uniformLocations.ambientVectorLoc, new Float32Array(ambientProduct));
        _gl.uniform4fv(gl.programInfo.uniformLocations.diffuseVectorLoc, new Float32Array(diffuseProduct));
        _gl.uniform4fv(gl.programInfo.uniformLocations.specularVectorLoc, new Float32Array(specularProduct));
        _gl.uniform1f(gl.programInfo.uniformLocations.shininessLoc, this.material.materialShininess);
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.normalMatrixLoc, false, flatten(this.rotateMatrix));

        if (self) {
            _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
        }
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.position);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normal);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);

        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.vertices.length / 3)

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

        //this.drawNormals(gl);
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);

    }
    setMaterial(m: Material) {
        this.material = m;
    }
    drawNormals(gl: GL): void {
        let _gl = gl.gl;
        let tempbuf = _gl.createBuffer();
        let v = [];
        for (let i = 0; i < this.vertices.length; i += 3) {
            let point = this.vertices.slice(i, i + 3);
            let vec = this.normals.slice(i, i + 3);
            v.push(...point, ...add(point, scale(2, vec)));
        }
        _gl.bindBuffer(_gl.ARRAY_BUFFER, tempbuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(v), _gl.STATIC_DRAW)
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, v.length / 3)

    }
    private calculateNormals(): void {
        this.normals=[];
        for (let i = 0; i < this.vertices.length; i += 9) {
            let ver1=this.vertices.slice(i,i+3);
            let ver2=this.vertices.slice(i+3,i+6);
            let ver3=this.vertices.slice(i+6,i+9);
            let vec1=subtract(ver1,ver2);
            let vec2=subtract(ver3,ver2);
            let nor=cross(vec2,vec1);

            let k=dot(ver1,nor)>=0?nor:negate(nor);
            let normal=normalize(k);
            this.normals.push(
                ...normal,...normal,...normal
            )
        }
    }
}