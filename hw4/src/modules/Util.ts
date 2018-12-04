export class Util {
    public static Mat4Vec(Mat4:Array<Array<number>>, Vec:Array<number>) {
        let tempVec = [];
        for (let i in [0, 1, 2]) {
            tempVec.push(Vec[0] * Mat4[i][0]
                + Vec[1] * Mat4[i][1]
                + Vec[2] * Mat4[i][2]
                + Vec[3] * Mat4[i][3]);
        }
        tempVec.push(1);
        return tempVec
    }
    public static Hex2Vec4(hex: string) {
        let _hex = parseInt(hex);
        let ret;
        if (hex.length <= 8) {
            ret = [_hex >> 16, (_hex & 0xFF00) >> 8, _hex & 0xFF, 0xFF];
        }
        else {
            ret = [_hex >> 24, (_hex & 0xff0000) >> 16, (_hex & 0xff00) >> 8, _hex & 0xFF];
        }
        return ret.map(x => x / 0xFF);
    }
    public static isInteger(num:number){
        return (num | 0) === num;
    }
    public static MatsMult(A: Array<number>, B: Array<number>, i: number, reverse = false) {
        if (Util.isInteger(i) && Util.isInteger(A.length / i) && Util.isInteger(B.length / i)) {
            let ret;
            let a = 0;
            if (reverse) {
                let ARows = A.length / i;
                let AColumns = i;
                let BRows = B.length / i;
                let BColumns = i;
                ret = new Array<number>(ARows * BRows);

                while (a < ret.length) {
                    let row = Math.floor(a / BRows);
                    let column = a % BRows;
                    let each = 0;
                    for (let index = 0; index < i; index++) {
                        each += A[row * AColumns + index] * B[BColumns * column + index];
                    }
                    ret[a++] = each;
                }
            }
            else {
                let ARows = A.length / i;
                let AColumns = i;
                let BRows = i;
                let BColumns = B.length / i;

                ret = new Array<number>(ARows * BColumns);
                while (a < ret.length) {
                    let row = Math.floor(a / BColumns);
                    let column = a % BColumns;
                    let each = 0;
                    for (let index = 0; index < i; index++) {
                        each += A[row * AColumns + index] * B[BColumns * index + column];
                    }
                    ret[a++] = each;
                }
            }
            return ret;
        }
        else {
            throw '错误的矩阵大小'
        }
    }
    public static radians(degrees: number) {
        return degrees * Math.PI / 180.0;
    }

    public static rotateY(theta: number) {
        var c = Math.cos(Util.radians(theta));
        var s = Math.sin(Util.radians(theta));
        var ry = new Array<number>(c, 0.0, -s,
            0.0, 1.0, 0.0,
            s, 0.0, c);
        return ry;
    }

}