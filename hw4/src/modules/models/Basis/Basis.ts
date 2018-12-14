import {Util} from '../../Util';
import { normalize } from '../../MV';
const sin=Math.sin,cos=Math.cos;
class Circle3D {
    public vertices: Array<number>;
    public normals: Array<number>;
    constructor(a = 0.5, b = 0.5, center = [0, 0, 0], frag = 30) {
        let radian =2 * Math.PI;
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
}
class FlatHalfWing {
    public flag:number;
    public vertices: Array<number>;
    public normals:Array<number>;
    //flag: 0--线 1--面
    constructor(size = 0.5,isLeft=true, z = 0, frag = 90, flag = 0) {
        let wingCount = 2;

        this.vertices = [];
        this.normals=[];
        this.flag = flag;

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
            let nor=[
                sin(wingCount * i)*sin(i)-wingCount*cos(wingCount*i)*cos(i),
                wingCount*cos(wingCount*i)*sin(i)+sin(wingCount*i)*cos(i),
                z
            ]
            this.normals.push(...normalize(nor));
        }
    }
}
export {Circle3D,FlatHalfWing}