import {Util} from '../Util';
import { Translatable } from '../interface/Translatable';
import Drawable from '../interface/Drawable';
import GL from '../GL'
import { flatten } from '../MV';
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

class Cube{
    public vertices:Array<number>;
    constructor(l = 5,h = 5,w = 5,center = [0,0,0]){
        let a_ = [center[0],center[1],center[2]];
        let b_ = [center[0],center[1]+h,center[2]];
        let c_ = [center[0]+l,center[1]+h,center[2]];
        let d_ = [center[0]+l,center[1],center[2]];
        let e_ = [center[0]+l,center[1],center[2]-w];
        let f_ = [center[0]+l,center[1]+h,center[2]-w];
        let g_ = [center[0],center[1],center[2]-w];
        let h_ = [center[0],center[1]+h,center[2]-w];
        this.vertices = [
            ...a_,...b_,...c_,
            ...a_,...d_,...c_,

            ...d_,...c_,...f_,
            ...d_,...e_,...f_,

            ...e_,...f_,...h_,
            ...e_,...g_,...h_,

            ...a_,...b_,...h_,
            ...a_,...g_,...h_,

            ...a_,...d_,...e_,
            ...a_,...g_,...e_,

            ...b_,...c_,...f_,
            ...b_,...h_,...f_
        ];
    }
}
class Tri_prism{
    public vertices:Array<number>;
    constructor(s = 5,h = 3,l = 5,a = [0,0,0]){
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
    }
}

class Cir_cone{
    public vertices: Array<number>;
    public colors: Array<number>;
    constructor(a = 0.5, b = 0.5, h = 1 ,center = [0, 0, 0], frag = 30) {
        let radian = 2 * Math.PI;
        let eachDegree = radian / frag;
        this.vertices = [];
        let [, y, ] = center;

        for (let i = 0; i <= radian; i += eachDegree) {
            this.vertices.push(center[0] + Math.cos(i) * a, y, center[2] + Math.sin(i) * b);
            this.vertices.push(center[0], y+h ,center[2] )
        }
        
    }
}
export {Circle3D,FlatHalfWing,Cube,Tri_prism,Cir_cone}