import { Translatable } from "../../interface/Translatable";
import Drawable from "../../interface/Drawable";
import { Material } from "../../interface/Material";
import { NoneMaterial } from "../../materials/NoneMaterial";
import { FlatHalfWing } from "./Basis";
import { Util } from "../../Util";
import GL from "../../GL";
import { flatten } from "../../MV";

export class HalfWing extends Translatable implements Drawable {
    buffers: any;
    material:Material;
    public vertices: Array<number>;
    public flats: Array<Array<number>>;
    private normals:{
        arc:Array<number>,
        flats:Array<Array<number>>
    }
    constructor(size = 0.5,isLeft=true, thicknessFrag = 20) {
        super();

        this.vertices = [];
        this.flats = [[],[]];
        this.normals={
            arc:[],
            flats:[[],[]]
        }
        this.material=new NoneMaterial;

        let angle = 1;
        let eachAngle = 2 * angle / thicknessFrag;

        let baseWing = new FlatHalfWing(size,isLeft)

        let rotate = Util.rotateY(-angle);
        let last = Util.MatsMult(baseWing.vertices, rotate, 3, true);
        this.flats[0] = last;

        let rotateM = Util.rotateY(eachAngle);
        for (let i = -angle; i < angle; i += eachAngle) {
            let newVer = [];
            for (let j = 0; j < baseWing.vertices.length; j += 3) {
                this.vertices.push(last[j], last[j + 1], last[j + 2]);
                this.normals.arc.push(last[j], last[j + 1], last[j + 2]);
                let newEle=Util.Mat3Vec(rotateM,last.slice(j,j+3));
                newEle.pop();

                newVer.push(...newEle);
                this.vertices.push(...newEle);
                this.normals.arc.push(...newEle);
            }
            last = newVer;
        }
        this.flats[1] = last;

        let flatFront=Util.Mat3Vec(rotate,[0,0,isLeft?1:-1]);
        let flatBehind=Util.Mat3Vec(Util.rotateY(angle),[0,0,isLeft?-1:1]);
        for(let i=0;i<this.flats[0].length;i+=3){
            this.normals.flats[0].push(...flatFront.slice(0,3));
            this.normals.flats[1].push(...flatBehind.slice(0,3));
        }
    }
    initBuffer(gl: GL): void {
        let _gl=gl.gl;
        this.buffers={
            positions:{},
            normals:{}
        }
        this.buffers.positions.flatWings = [_gl.createBuffer(), _gl.createBuffer()];
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.flatWings[0]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.flats[0]), _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.flatWings[1]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.flats[1]), _gl.STATIC_DRAW);
        this.buffers.normals.flatWings = [_gl.createBuffer(), _gl.createBuffer()];
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.flatWings[0]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.normals.flats[0]), _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.flatWings[1]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.normals.flats[1]), _gl.STATIC_DRAW);

        //Wing:
        this.buffers.positions.ringWing = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.ringWing);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.vertices), _gl.STATIC_DRAW);
        this.buffers.normals.ringWing = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.ringWing);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.normals.arc), _gl.STATIC_DRAW);


    }

  draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;

        //光照处理
        let lt=gl.currentLight;
        let ambientProduct = Util.Vec4Mult(lt.lightAmbient, this.material.materialAmbient);
        let diffuseProduct = Util.Vec4Mult(lt.lightDiffuse, this.material.materialDiffuse);
        let specularProduct = Util.Vec4Mult(lt.lightSpecular, this.material.materialSpecular);
        _gl.uniform4fv(gl.programInfo.uniformLocations.ambientVectorLoc, new Float32Array(ambientProduct));
        _gl.uniform4fv(gl.programInfo.uniformLocations.diffuseVectorLoc, new Float32Array(diffuseProduct));
        _gl.uniform4fv(gl.programInfo.uniformLocations.specularVectorLoc, new Float32Array(specularProduct));
        _gl.uniform1f(gl.programInfo.uniformLocations.shininessLoc, this.material.materialShininess);

        //模型
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

        for (let i in this.flats) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.flatWings[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.flatWings[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.flats[i].length / 3)

        }
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.ringWing);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.ringWing);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.vertices.length / 3)

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);
    }
    setMaterial(m:Material){
        this.material=m;
    }
}