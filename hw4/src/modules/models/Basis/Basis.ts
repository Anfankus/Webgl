import {Util} from '../../Util';
import { Translatable } from '../../interface/Translatable';
import Drawable from '../../interface/Drawable';
import GL from '../../GL'
import { flatten } from '../../MV';
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
    public vertices: Array<number>;
    public flats: Array<Array<number>>;
    constructor(size = 0.5,isLeft=true, thicknessFrag = 20) {
        super();

        this.vertices = new Array<number>();
        this.flats = new Array<Array<number>>(2);

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
                this.vertices.push(last[j], last[j + 1], last[j + 2])
                for (let k = 0; k < 3; k++) {
                    let newEle = rotateM[3 * k] * last[j] + rotateM[3 * k + 1] * last[j + 1] + rotateM[3 * k + 2] * last[j + 2];
                    newVer.push(newEle);
                    this.vertices.push(newEle);
                }
            }
            last = newVer;
        }
        this.flats[1] = last;
    }
    initBuffer(gl: GL): void {
        let _gl=gl.gl;
        this.buffers={
            positions:{},
            colors:{}
        }
        this.buffers.positions.flatWings = [_gl.createBuffer(), _gl.createBuffer()];
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.flatWings[0]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.flats[0]), _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.flatWings[1]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.flats[1]), _gl.STATIC_DRAW);
        //Wing:
        let WingBuf = _gl.createBuffer();
        this.buffers.positions.ringWing = WingBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, WingBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.vertices), _gl.STATIC_DRAW);

    }
    draw(gl: GL): void {
        let _gl = gl.gl;
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

        for (let i in this.flats) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.flatWings[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.flats[i].length / 3)

        }
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.ringWing);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.vertices.length / 3)

    }
}
class Ellipsoid {
    public vertices: Array<number>;
    public normals:Array<number>;
    public colors: Array<number>;
    public baseCircle: Circle3D;
    constructor(a, b, position, color: string | Array<number>) {

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
                this.normals.push(last[j] + xp, last[j + 1] + yp, last[j + 2] + zp,0);
                for (let k = 0; k < 3; k++) {
                    let newEle = rotateM[3 * k] * last[j] + rotateM[3 * k + 1] * last[j + 1] + rotateM[3 * k + 2] * last[j + 2];
                    newVer.push(newEle);
                    this.vertices.push(newEle + position[k]);
                    this.normals.push(newEle + position[k]);
                }
                this.normals.push(0);
            }
            last = newVer;
        }
    }
}

export {Circle3D,FlatHalfWing,HalfWing,Ellipsoid}