import {Util} from './Util';
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
class FlatWing {
    public flag;
    public vertices: Array<number>;
    public colors: Array<number>;
    //flag: 0--线 1--面
    constructor(size = 0.5, z = 0, frag = 90, flag = 0, edgeColor = '0x000000') {
        let wingCount = 2;

        this.vertices = [];
        this.colors = [];
        this.flag = flag;
        let _color = Util.Hex2Vec4(edgeColor);
        let radian = 2 * Math.PI;

        let eachDegree = radian / frag;
        for (let i = 0; i <= radian; i += eachDegree) {
            let length = size * Math.sin(wingCount * i);
            if (i > radian / 2) {
                length *= 0.85;
            }
            this.vertices.push(Math.sin(i) * length, Math.cos(i) * length, z);
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
class Wing {
    public vertices: Array<number>;
    public flats: Array<Array<number>>;
    constructor(size = 0.5, thicknessFrag = 20) {
        this.vertices = new Array<number>();
        this.flats = new Array<Array<number>>(2);

        let angle = 5;
        let eachAngle = 2 * angle / thicknessFrag;

        let baseWing = new FlatWing(size)

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
    private static getSize(maxSize: number, maxThickness: number, angle: number) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return 2 * cos / (maxSize * ((Math.sqrt(sin / maxThickness) + Math.sqrt(cos / maxSize))));
    }
}
class Ellipsoid {
    public vertices: Array<number>;
    public colors: Array<number>;
    public baseCircle: Circle3D;
    constructor(a, b, position, color: string | Array<number>) {

        this.baseCircle = new Circle3D(a, b);
        this.vertices = [];
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
                this.vertices.push(last[j] + xp, last[j + 1] + yp, last[j + 2] + zp)
                for (let k = 0; k < 3; k++) {
                    let newEle = rotateM[3 * k] * last[j] + rotateM[3 * k + 1] * last[j + 1] + rotateM[3 * k + 2] * last[j + 2];
                    newVer.push(newEle);
                    this.vertices.push(newEle + position[k]);
                }
            }
            last = newVer;
        }
    }
}

export {Circle3D,FlatWing,Wing,Ellipsoid}