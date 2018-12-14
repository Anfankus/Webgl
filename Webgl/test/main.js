class FlatWing {
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
    setCenterColor(color) {
        let [r, g, b, a] = Util.Hex2Vec4(color);
        this.colors[0] = r;
        this.colors[1] = g;
        this.colors[2] = b;
        this.colors[3] = a

    }
}
class Wing {
    constructor(size = 0.5, thicknessFrag = 20) {
        this.vertices=[];

        let angle = 25;
        let eachAngle = 2*angle / thicknessFrag;

        let baseWing = new FlatWing(size)

        let rotate = Util.rotateY(-angle);
        let last = Util.MatsMult(baseWing.vertices,rotate,3,true);

        let rotateM=Util.rotateY(eachAngle);
        for (let i = -angle; i < angle; i += eachAngle) {
            let newVer = [];
            for (let j = 0; j < baseWing.vertices.length; j += 3) {
                this.vertices.push(last[j], last[j + 1], last[j + 2])
                for (let k = 0; k < 3; k++) {
                    let newEle = rotateM[3*k] * last[j] + rotateM[3*k+1] * last[j + 1] + rotateM[3*k+2] * last[j + 2];
                    newVer.push(newEle);
                    this.vertices.push(newEle);
                }
            }
            last = newVer;
        }

    }
}
window.onload=function(){
    
}

