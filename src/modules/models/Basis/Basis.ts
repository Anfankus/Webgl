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

class HalfCircle3D {
    public vertices: Array<number>;
    public normals: Array<number>;
    constructor(a = 0.5, b = 0.5, center = [0, 0, 0], frag = 30) {
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
}
class FlatHalfWing {
    public flag:number;
    public vertices: Array<number>;
    public normals:Array<number>;
    public texVertice:Array<number>;

    //flag: 0--线 1--面
    constructor(size = 0.5,isLeft=true, z = 0, frag = 90, flag = 0) {
        let wingCount = 2;

        this.vertices = [];
        this.normals=[];
        this.texVertice=[];
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
            this.texVertice.push(Math.abs(x),Math.abs(y));
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

class Cube{
    public normals:Array<number>;
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
        this.normals = [
            0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1,

            1,0,0, 1,0,0, 1,0,0,
            1,0,0, 1,0,0, 1,0,0,

            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,

            -1,0,0, -1,0,0, -1,0,0,
            -1,0,0, -1,0,0, -1,0,0,

            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,

            0,1,0, 0,1,0, 0,1,0,
            0,1,0, 0,1,0, 0,1,0,
        ];
    }
}

class Tri_prism{
    public vertices:Array<number>;
    public normals:Array<number>;
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
}

class Cir_cone{
    public vertices: Array<number>;
    public normals: Array<number>;
    constructor(r = 0.5, h = 1 ,center = [0, 0, 0], frag = 30) {
        let radian = 2 * Math.PI;
        let eachDegree = radian / frag;
        this.vertices = [];
        let [, y, ] = center;
        var a;
        var b;
        var nx;
        var ny;
        var nz;

        for (let i = 0; i <= radian; i += eachDegree) {
            this.vertices.push(center[0] + Math.cos(i) * r, y, center[2] + Math.sin(i) * r);
            this.vertices.push(center[0], y+h ,center[2] );
            this.vertices.push(center[0] + Math.cos(i+eachDegree) * r, y, center[2] + Math.sin(i+eachDegree) * r);
            a = (Math.sin(i)-Math.sin(i+eachDegree))/(Math.cos(i+eachDegree)-Math.cos(i))
            b = r*(a*Math.cos(i+eachDegree)+Math.sin(i+eachDegree))/h;
            nz = 1/(Math.sqrt(a**2+b**2+1));
            nx = nz*a;
            ny = nz*b;
            this.normals.push(nx,ny,nz);
            this.normals.push(nx,ny,nz);
            this.normals.push(nx,ny,nz);
        }
        
    }
}

class Rect_pyramid{
    public vertices: Array<number>;
    public normals: Array<number>;
    constructor(l = 3 , h, a = [0,0,0]){
        let b = [a[0]+l,a[1],a[2]];
        let c = [a[0]+l,a[1],a[2]-l];
        let d = [a[0],a[1],a[2]-l];
        let e = [a[0]+l/2,a[1]+h,a[2]-l/2];
        this.vertices = [
            ...a,...b,...c,
            ...a,...b,...d,

            ...a,...b,...e,

            ...a,...d,...e,

            ...b,...c,...e,

            ...c,...d,...e
        ];
        this.normals = [
            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,

            0,Math.sqrt(1/((4*h**2/l**2)+1)),2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),
            0,Math.sqrt(1/((4*h**2/l**2)+1)),2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),
            0,Math.sqrt(1/((4*h**2/l**2)+1)),2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),

            -2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),Math.sqrt(1/((4*h**2/l**2)+1)),0,
            -2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),Math.sqrt(1/((4*h**2/l**2)+1)),0,
            -2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),Math.sqrt(1/((4*h**2/l**2)+1)),0,

            2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),Math.sqrt(1/((4*h**2/l**2)+1)),0,
            2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),Math.sqrt(1/((4*h**2/l**2)+1)),0,
            2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),Math.sqrt(1/((4*h**2/l**2)+1)),0,

            0,Math.sqrt(1/((4*h**2/l**2)+1)),-2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),
            0,Math.sqrt(1/((4*h**2/l**2)+1)),-2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),
            0,Math.sqrt(1/((4*h**2/l**2)+1)),-2*h/l*Math.sqrt(1/((4*h**2/l**2)+1)),
        ]
    }
}
export {Circle3D,FlatHalfWing}