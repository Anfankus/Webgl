import {Util} from '../../Util';
import { Translatable } from '../../interface/Translatable';
import Drawable from '../../interface/Drawable';
import GL from '../../GL'
import { flatten, vec4 } from '../../MV';
import { Material } from '../../interface/Material';
import { NoneMaterial } from '../../materials/NoneMaterial';
class Circle3D {
    public vertices: Array<number>;
    public colors: Array<number>;
    constructor(a = 0.5, b = 0.5, center = [0, 0, 0], frag = 30) {
        let radian = 2 * Math.PI;
        let eachDegree = radian / frag;
        this.vertices = [];
        let [, , z] = center;

        for (let i = 0; i <= radian; i += eachDegree) {
            this.vertices.push(center[0] + Math.cos(i) * a, center[1] + Math.sin(i) * b, z);
        }
    }
}
class FlatHalfWing {
    public flag;
    public vertices: Array<number>;
    public colors: Array<number>;
    //flag: 0--线 1--面
    constructor(size = 0.5,isLeft=true, z = 0, frag = 90, flag = 0, edgeColor = '0x000000') {
        let wingCount = 2;

        this.vertices = [];
        this.colors = [];
        this.flag = flag;
        let _color = Util.Hex2Vec4(edgeColor);

        let offset=Math.PI/2;
        let start=isLeft?0:Math.PI;
        let radian = isLeft?Math.PI:2 * Math.PI;

        let eachDegree = radian / frag;
        for (let i = start+offset; i <= radian+offset; i += eachDegree) {
            let length = size * Math.sin(wingCount * i);
            if(Math.sin(i)<0){
                length*=0.85;
            }
            let x=Math.sin(i) * length,y=Math.cos(i) * length;
            this.vertices.push(x,y, z);
            this.colors.push(..._color);
        }
    }
    public setCenterColor(color: string) {
        let [r, g, b, a] = Util.Hex2Vec4(color);
        this.colors[0] = r;
        this.colors[1] = g;
        this.colors[2] = b;
        this.colors[3] = a

    }
}
class HalfWing extends Translatable implements Drawable {
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

        let tempNor1=Util.Mat3Vec(rotate,[0,0,isLeft?1:-1]);
        let tempNor2=Util.Mat3Vec(Util.rotateY(angle),[0,0,isLeft?-1:1]);
        for(let i=0;i<this.flats[0].length;i+=3){
            this.normals.flats[0].push(...tempNor1);
            this.normals.flats[1].push(...tempNor2);
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
    draw(gl: GL): void {
        let _gl = gl.gl;

        //光照处理
        let normalMatrix = [
            ...this.modelMatrix[0].slice(0,3),
            ...this.modelMatrix[1].slice(0,3),
            ...this.modelMatrix[2].slice(0,3)
        ];
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
        _gl.uniformMatrix3fv(gl.programInfo.uniformLocations.normalMatrixLoc, false, new Float32Array(normalMatrix));

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
class Ellipsoid extends Translatable implements Drawable{
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

export {Circle3D,FlatHalfWing,HalfWing,Ellipsoid}