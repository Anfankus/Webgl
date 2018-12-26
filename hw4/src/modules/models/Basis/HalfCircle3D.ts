import { Translatable } from "../../interface/Translatable";
import Drawable from "../../interface/Drawable";
import { Material } from "../../interface/Material";
import GL from "../../GL";
import { Util } from "../../Util";
import { flatten } from "../../MV";
import { SkyMaterial } from "../../materials/SkyMaterial";
export class HalfCircle3D extends Translatable implements Drawable {
    buffers: any;
    material: Material;
    public vertices: Array<number>;
    public normals: Array<number>;
    constructor(a = 0.5, b = 0.5, center = [0, 0, 0], frag = 30,color: string | Array<number>) {
        super();
        this.material = new SkyMaterial
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
    drawNormals(gl:GL):void{
        let _gl = gl.gl;
        let tempbuf = _gl.createBuffer();
        let v = [];
        //
        // for (let i = 0; i < this.vertices.length; i += 3) {
        //     let point = this.vertices.slice(i, i + 3);
        //     let vec = this.normals.slice(i, i + 3);
        //     v.push(...point, ...add(point, scale(2, vec)));
        //}
        // _gl.bindBuffer(_gl.ARRAY_BUFFER, tempbuf);
        // _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(v), _gl.STATIC_DRAW)
        // _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        // _gl.drawArrays(_gl.LINES, 0, v.length / 3)
    }
    private calculateNormals(): void {
        this.normals=[];
        // for (let i = 0; i < this.vertices.length; i += 9) {
        //     let ver1=this.vertices.slice(i,i+3);
        //     let ver2=this.vertices.slice(i+3,i+6);
        //     let ver3=this.vertices.slice(i+6,i+9);
        //     let vec1=subtract(ver1,ver2);
        //     let vec2=subtract(ver3,ver2);
        //     let nor=cross(vec2,vec1);

        //     let k=dot(ver1,nor)>=0?nor:negate(nor);
        //     let normal=normalize(k);
        //     this.normals.push(
        //         ...normal,...normal,...normal
        //     )
        // }
    }

}