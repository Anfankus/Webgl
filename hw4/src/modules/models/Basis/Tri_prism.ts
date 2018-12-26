import { Translatable } from "../../interface/Translatable";
import Drawable from "../../interface/Drawable";
import { Material } from "../../interface/Material";
import GL from "../../GL";
import { Util } from "../../Util";
import { flatten } from "../../MV";
import { NoneMaterial } from "../../materials/NoneMaterial";
export class Tri_prism extends Translatable implements Drawable {
    buffers: any;
    material: Material;
    public vertices: Array<number>;
    public normals: Array<number>;
    //color用处
    constructor(s = 5,h = 3,l = 5,a = [0,0,0],color: string | Array<number>){
        super();
        this.material = new NoneMaterial
        let b = [a[0]+s,a[1],a[2]];
        let c = [a[0]+s,a[1],a[2]-l];
        let d = [a[0],a[1],a[2]-l];
        let e = [a[0]+s/2,a[1]+h,a[2]];
        let f = [e[0],e[1],e[2]-l];
        this.vertices=[
            ...a,...b,...e,

            ...c,...f,...d,
            
            ...b,...c,...e,
            ...f,...c,...e,

            ...a,...d,...e,
            ...f,...d,...e,

            ...a,...b,...c,
            ...a,...d,...c,
        ];
        this.normals = [
            0,0,1, 0,0,1, 0,0,1,

            0,0,-1, 0,0,-1, 0,0,-1,

            2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            
            -2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            -2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            -2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            -2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            -2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,
            -2*h/Math.sqrt(4*h**2+s**2),s/Math.sqrt(4*h**2+s**2),0,

            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,
        ];
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
}