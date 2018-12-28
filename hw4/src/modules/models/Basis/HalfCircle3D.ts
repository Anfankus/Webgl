import { Translatable } from "../../interface/Translatable";
import Drawable from "../../interface/Drawable";
import { Material } from "../../interface/Material";
import GL from "../../GL";
import { Util } from "../../Util";
import { flatten, mat4, translate, mult } from "../../MV";
import { SkyMaterial } from "../../materials/SkyMaterial";
import Shaded from "../../interface/Shaded";
import { WindowMaterial } from "../../materials/WindowMaterial";
export class HalfCircle3D extends Translatable implements Drawable,Shaded {
    shaded: boolean
    choice: number
    buffers: any;
    material: Material;
    public vertices: Array<number>;
    public normals: Array<number>;
    constructor(a = 0.5, b = 0.5, center = [0, 0, 0], frag = 30,color: string | Array<number>) {
        super();
        this.material = new WindowMaterial
        let radian = Math.PI;
        let eachDegree = radian / frag;
        this.vertices = [];
        this.normals=[];
        let [, , _z] = center;

        for (let i = 0; i <= radian; i += eachDegree) {
            let [x,y,z]=[center[0] + Math.cos(i) * a, center[1] + Math.sin(i) * b, _z]
            this.vertices.push(x,y,z);
            this.normals.push(x/a**2,y/b**2,0);
        }
    }
    initBuffer(gl:GL):void{
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

    draw(gl:GL, self: boolean = true): void{
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
    setMaterial(m: Material){
        this.material = m;
    }
    drawShadow(gl: GL): void {
        let _gl=gl.gl;
        let transMatrix = mat4();
        transMatrix =mult(translate(...Util.Mat4Vec(mat4(-1),gl.currentLight.position)),this.modelMatrix);
        let m=mat4();
        m[3][3]=0;
        m[3][1]=-1/(gl.currentLight.position[1]-0.01);
        transMatrix=mult(m,transMatrix);
        transMatrix = mult(translate(...gl.currentLight.position), transMatrix);
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(transMatrix));

        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.position);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.vertices.length / 3)
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
    }
    setChoice(c:number) {
        this.choice=c;
    }
    setShaded(): void {
        this.shaded=true;
    }
    clearShaded():void{
        this.shaded=false;
    }


}