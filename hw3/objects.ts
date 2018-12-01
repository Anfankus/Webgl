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
        let rotateM = rotateY(eachDegree);

        let _color = Array.isArray(color) ? color : Util.Hex2Vec4(color);
        for (let i = 0; i < frag; i++) {
            let newVer = [];
            for (let j = 0; j < this.baseCircle.vertices.length; j += 3) {
                this.colors.push(..._color, ..._color);
                this.vertices.push(last[j] + xp, last[j + 1] + yp, last[j + 2] + zp)
                for (let k = 0; k < 3; k++) {
                    let newEle = rotateM[k][0] * last[j] + rotateM[k][1] * last[j + 1] + rotateM[k][2] * last[j + 2];
                    newVer.push(newEle);
                    this.vertices.push(newEle + position[k]);
                }
            }
            last = newVer;
        }
    }
}
class ButterFly {
    public body: Ellipsoid;
    public eyes: Array<Ellipsoid>;
    public flatWings: Array<Array<number>>;
    public Wing: Wing;
    public lines;

    public direction: Array<number>;
    public baseDirection: Array<number>;
    public axis: Array<number>;
    public baseAxis: Array<number>;
    public position: Array<number>;
    public basePosition: Array<number>;

    public modelMatrixs;
    public baseMatrixs;
    public lastTrans: transType;
    constructor() {
        this.direction = [0, 1, 0, 1];
        this.baseDirection = [0, 1, 0, 1];
        this.axis = [0, 0, 1, 1];
        this.baseAxis = [0, 0, 1, 1];
        this.position = [0, 0, 0, 1];
        this.basePosition = [0, 0, 0, 1];
        this.body = new Ellipsoid(0.07, 0.3, [0, 0, 0], [1, 0.8559, 0.73843, 1.0]);

        this.eyes = [
            new Ellipsoid(0.023, 0.02, [0.045, 0.2, 0], '0x000000'),
            new Ellipsoid(0.023, 0.02, [-0.045, 0.2, 0], '0x000000'),
            new Ellipsoid(0.02, 0.02, [0.15, 0.6, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.15, 0.6, 0], '0x000000f0')

        ];
        this.Wing = new Wing(0.95);
        this.flatWings = this.Wing.flats;
        this.lines = [
            -0.008, 0.3, 0, -0.15, 0.6, 0,
            0.008, 0.3, 0, 0.15, 0.6, 0
        ];
        // let LinesOnWings = [1, 2];
        // for (let j of LinesOnWings) {
        //     let centerPoint = [
        //         ...this.flatWings[j].slice(0, 2),
        //         this.flatWings[j][2] * 1.5
        //     ];
        //     for (let i = 0; i < this.flatWings[j].length; i += 3) {
        //         this.lines.push(...centerPoint);
        //         this.lines.push(...this.flatWings[j].slice(i, i + 2), centerPoint[2]);
        //     }
        // }


        this.modelMatrixs = mat4();
        this.baseMatrixs = mat4();
        this.lastTrans = transType.none;
    }
    public initBuffer(gl: GL) {
        let _gl = gl.gl;
        //body
        gl.buffers.positions.butterfly.body = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.body);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body.vertices), _gl.STATIC_DRAW);

        gl.buffers.colors.butterfly.body = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.colors.butterfly.body);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body.colors), _gl.STATIC_DRAW);
        //eyes
        gl.buffers.positions.butterfly.eyes = [];
        gl.buffers.colors.butterfly.eyes = [];
        for (let i in this.eyes) {
            let tempPBuf = _gl.createBuffer();
            gl.buffers.positions.butterfly.eyes.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].vertices), _gl.STATIC_DRAW);

            let tempCBuf = _gl.createBuffer();
            gl.buffers.colors.butterfly.eyes.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].colors), _gl.STATIC_DRAW);

        }

        //FlatWings
        gl.buffers.positions.butterfly.wings = [_gl.createBuffer(), _gl.createBuffer()];
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.wings[0]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.Wing.flats[0]), _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.wings[1]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.Wing.flats[1]), _gl.STATIC_DRAW);

        //lines
        let lineBuf = _gl.createBuffer();
        gl.buffers.positions.butterfly.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);

        //Wing:
        let WingBuf = _gl.createBuffer();
        gl.buffers.positions.butterfly.Wing = WingBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, WingBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.Wing.vertices), _gl.STATIC_DRAW);


    }

    /**
     * 
     * @param delta 旋转角度
     * @param related 旋转是否相对于上次绘制
     * @param axisType 旋转轴：1--X；2--Y；3--Z;0--自身纵轴
     */
    public rotate(delta: number, related = true, axisType = 0): boolean {
        let transMetrix;
        let currentTrans;
        switch (axisType) {
            case 0:
                transMetrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition));
                let temp = rotate(delta, ...this.baseAxis);
                transMetrix = mult(temp, transMetrix);
                transMetrix = mult(translate(...this.basePosition), transMetrix);
                currentTrans = transType.rotateMain;
                break;
            case 1: transMetrix = rotateX(delta); currentTrans = transType.rotateX;
                break;
            case 2: transMetrix = rotateY(delta); currentTrans = transType.rotateY;
                break;
            case 3: transMetrix = rotateZ(delta); currentTrans = transType.rotateZ;
                break;
        }
        let ret = false;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
            this.direction = Util.Mat4Vec(transMetrix, this.direction);
            return ret;
        }
        else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseDirection = this.direction;
            this.baseMatrixs = this.modelMatrixs;
            this.baseAxis = this.axis;
            this.basePosition = this.position;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.direction = Util.Mat4Vec(transMetrix, this.baseDirection);
        this.position = Util.Mat4Vec(transMetrix, this.basePosition);
        if (axisType !== 0) {
            this.axis = Util.Mat4Vec(transMetrix, this.baseAxis);
        }
        console.log(this.axis, this.baseAxis);
        this.lastTrans = currentTrans;
        return ret;
    }
    /**
     * 
     * @param distance 距离
     * @param direction 0：主方向；1：x轴方向；2：y轴方向；3：z轴方向
     * @param related 平移是否相对于上次绘制
     */
    public translate(distance: number, direction: number, related: boolean) {
        let x_dis, y_dis, z_dis;
        let currentTrans;
        switch (direction) {
            case 0:
                let eachStep = distance / Math.sqrt(
                    this.direction[0] * this.direction[0]
                    + this.direction[1] * this.direction[1]
                    + this.direction[2] * this.direction[2])
                x_dis = eachStep * this.direction[0];
                y_dis = eachStep * this.direction[1];
                z_dis = eachStep * this.direction[2];
                currentTrans = transType.translateMain;
                break;
            case 1:
                x_dis = distance;
                y_dis = z_dis = 0;
                currentTrans = transType.translateX;
                break;
            case 2:
                y_dis = distance;
                x_dis = z_dis = 0;
                currentTrans = transType.translateY;
                break;
            case 3:
                z_dis = distance;
                y_dis = x_dis = 0;
                currentTrans = transType.translateZ;
                break;
        }
        let transMetrix = translate(x_dis, y_dis, z_dis);
        let ret = false;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
            return ret;
        } else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseMatrixs = this.modelMatrixs;
            this.basePosition = this.position;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.position = Util.Mat4Vec(transMetrix, this.basePosition);
        this.lastTrans = currentTrans;
        console.log(this.axis, this.baseAxis);

        return ret;
    }

    public zoom(size: number, related: boolean) {
        let transMetrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition));
        let temp = mat4(size);
        temp[3][3] = 1;

        transMetrix = mult(temp, transMetrix);
        transMetrix = mult(translate(...this.basePosition), transMetrix);

        let currentTrans = transType.zoom;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
        } else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            this.baseMatrixs = this.modelMatrixs;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.lastTrans = currentTrans;
    }
    public draw(gl: GL, clear = true) {
        let _gl = gl.gl;
        if (clear) {
            _gl.clearColor(0.0, 0.0, 0.0, 1.0);
            _gl.clearDepth(1.0);
        }
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrixs));

        //body
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.body);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.colors.butterfly.body);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        _gl.drawArrays(_gl.LINES, 0, this.body.vertices.length / 3)
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body.vertices.length / 3)

        //eyes
        for (let i in this.eyes) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.colors.butterfly.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.eyes[i].vertices.length / 3)
        }

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        //wings
        for (let i in this.flatWings) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.wings[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.flatWings[i].length / 3)

        }
        //lines

        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3)

        //Wing
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.Wing);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.Wing.vertices.length / 3)
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);

    }
}

class Insect {
    public body: Array<Ellipsoid>;
    public head: Ellipsoid;
    public eyes: Array<Ellipsoid>;
    public lines;

    public direction: Array<number>;
    public baseDirection: Array<number>;
    public axis: Array<number>;
    public baseAxis: Array<number>;
    public position: Array<number>;
    public basePosition: Array<number>;

    public modelMatrixs;
    public baseMatrixs;
    public lastTrans: transType;
    constructor() {
        this.direction = [0, 1, 0, 1];
        this.baseDirection = [0, 1, 0, 1];
        this.axis = [0, 0, 1, 1];
        this.baseAxis = [0, 0, 1, 1];
        this.position = [0, 0, 0, 1];
        this.basePosition = [0, 0, 0, 1];
        this.body = [
            new Ellipsoid(0.1, 0.1, [-0.06, 0.3, 0], [0.196, 0.80392, 0.196, 1.0]),
            new Ellipsoid(0.1, 0.1, [-0.10, 0.15, 0], [0, 1, 0, 1.0]),
            new Ellipsoid(0.1, 0.1, [-0.16, 0, 0], [0.196, 0.80392, 0.196, 1.0]),
            new Ellipsoid(0.1, 0.1, [-0.07, -0.15, 0], [0, 1, 0, 1.0]),
            new Ellipsoid(0.1, 0.1, [0, -0.3, 0], [0.196, 0.80392, 0.196, 1.0]),
            new Ellipsoid(0.1, 0.1, [0.06, -0.45, 0], [0, 1, 0, 1.0]),
        ];

        this.head = new Ellipsoid(0.13, 0.11, [0, 0.45, 0], [0, 1, 0, 1.0]);
        this.eyes = [
            new Ellipsoid(0.023, 0.02, [0.05, 0.55, 0], '0x000000'),
            new Ellipsoid(0.023, 0.02, [-0.05, 0.55, 0], '0x000000'),
            new Ellipsoid(0.023, 0.02, [0, 0.55, 0.08], '0x000000'),
            new Ellipsoid(0.02, 0.02, [0.1, 0.75, -0.15], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.1, 0.75, -0.15], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.2, 0.4, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.1, 0.35, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.25, 0.2, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.07, 0.15, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.33, 0, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.02, 0, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.25, -0.15, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.17, -0.3, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.18, -0.25, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.13, -0.41, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.23, -0.4, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.1, -0.1, 0], '0x000000f0')
        ];

        this.lines = [
            0, 0.45, 0, -0.1, 0.75, -0.15,
            0, 0.45, 0, 0.1, 0.75, -0.15,
            -0.06, 0.3, 0, -0.2, 0.4, 0,
            -0.03, 0.3, 0, 0.1, 0.35, 0,
            0, 0.15, 0, -0.25, 0.2, 0,
            0.0, 0.15, 0, 0.07, 0.15, 0,
            -0.16, 0, 0, -0.33, 0, 0,
            -0.13, 0, 0, 0.02, 0, 0,
            -0.07, -0.15, 0, -0.25, -0.15, 0,
            0, -0.15, 0, 0.1, -0.1, 0,
            -0.06, -0.32, 0, -0.17, -0.3, 0,
            -0.03, -0.3, 0, 0.18, -0.25, 0,
            0.06, -0.45, 0, -0.13, -0.41, 0,
            0.06, -0.45, 0, 0.23, -0.4, 0
        ];


        this.modelMatrixs = mat4();
        this.baseMatrixs = mat4();
        this.lastTrans = transType.none;
    }
    public initBuffer(gl: GL) {
        let _gl = gl.gl;
        //body
        gl.buffers1.positions.insect.body = [];
        gl.buffers1.colors.insect.body = [];
        for (let i in this.body) {
            let tempPBuf = _gl.createBuffer();
            gl.buffers1.positions.insect.body.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body[i].vertices), _gl.STATIC_DRAW);

            let tempCBuf = _gl.createBuffer();
            gl.buffers1.colors.insect.body.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body[i].colors), _gl.STATIC_DRAW);
        }
        //head
        gl.buffers1.positions.insect.head = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.head);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.head.vertices), _gl.STATIC_DRAW);

        gl.buffers1.colors.insect.head = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.head);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.head.colors), _gl.STATIC_DRAW);
        //eyes
        gl.buffers1.positions.insect.eyes = [];
        gl.buffers1.colors.insect.eyes = [];
        for (let i in this.eyes) {
            let tempPBuf = _gl.createBuffer();
            gl.buffers1.positions.insect.eyes.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].vertices), _gl.STATIC_DRAW);

            let tempCBuf = _gl.createBuffer();
            gl.buffers1.colors.insect.eyes.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].colors), _gl.STATIC_DRAW);

        }

        //lines
        let lineBuf = _gl.createBuffer();
        gl.buffers1.positions.insect.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);
    }

    /**
     * 
     * @param delta 旋转角度
     * @param related 旋转是否相对于上次绘制
     * @param axisType 旋转轴：1--X；2--Y；3--Z;0--自身纵轴
     */
    public rotate(delta: number, related = true, axisType = 0): boolean {
        let transMetrix;
        let currentTrans;
        switch (axisType) {
            case 0:
                transMetrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition));
                let temp = rotate(delta, ...this.baseAxis);
                transMetrix = mult(temp, transMetrix);
                transMetrix = mult(translate(...this.basePosition), transMetrix);
                currentTrans = transType.rotateMain;
                break;
            case 1: transMetrix = rotateX(delta); currentTrans = transType.rotateX;
                break;
            case 2: transMetrix = rotateY(delta); currentTrans = transType.rotateY;
                break;
            case 3: transMetrix = rotateZ(delta); currentTrans = transType.rotateZ;
                break;
        }
        let ret = false;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
            this.direction = Util.Mat4Vec(transMetrix, this.direction);
            return ret;
        }
        else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseDirection = this.direction;
            this.baseMatrixs = this.modelMatrixs;
            this.baseAxis = this.axis;
            this.basePosition = this.position;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.direction = Util.Mat4Vec(transMetrix, this.baseDirection);
        this.position = Util.Mat4Vec(transMetrix, this.basePosition);
        if (axisType !== 0) {
            this.axis = Util.Mat4Vec(transMetrix, this.baseAxis);
        }
        console.log(this.axis, this.baseAxis);
        this.lastTrans = currentTrans;
        return ret;
    }
    /**
     * 
     * @param distance 距离
     * @param direction 0：主方向；1：x轴方向；2：y轴方向；3：z轴方向
     * @param related 平移是否相对于上次绘制
     */
    public translate(distance: number, direction: number, related: boolean) {
        let x_dis, y_dis, z_dis;
        let currentTrans;
        switch (direction) {
            case 0:
                let eachStep = distance / Math.sqrt(
                    this.direction[0] * this.direction[0]
                    + this.direction[1] * this.direction[1]
                    + this.direction[2] * this.direction[2])
                x_dis = eachStep * this.direction[0];
                y_dis = eachStep * this.direction[1];
                z_dis = eachStep * this.direction[2];
                currentTrans = transType.translateMain;
                break;
            case 1:
                x_dis = distance;
                y_dis = z_dis = 0;
                currentTrans = transType.translateX;
                break;
            case 2:
                y_dis = distance;
                x_dis = z_dis = 0;
                currentTrans = transType.translateY;
                break;
            case 3:
                z_dis = distance;
                y_dis = x_dis = 0;
                currentTrans = transType.translateZ;
                break;
        }
        let transMetrix = translate(x_dis, y_dis, z_dis);
        let ret = false;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
            return ret;
        } else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseMatrixs = this.modelMatrixs;
            this.basePosition = this.position;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.position = Util.Mat4Vec(transMetrix, this.basePosition);
        this.lastTrans = currentTrans;
        console.log(this.axis, this.baseAxis);

        return ret;
    }

    public zoom(size: number, related: boolean) {
        let transMetrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition));
        let temp = mat4(size);
        temp[3][3] = 1;

        transMetrix = mult(temp, transMetrix);
        transMetrix = mult(translate(...this.basePosition), transMetrix);

        let currentTrans = transType.zoom;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
        } else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            this.baseMatrixs = this.modelMatrixs;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.lastTrans = currentTrans;
    }
    public draw(gl: GL, clear = true) {
        let _gl = gl.gl;
        if (clear) {
            _gl.clearColor(0.0, 0.0, 0.0, 1.0);
            _gl.clearDepth(1.0);
        }
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrixs));

        //body
        for (let i in this.body) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.body[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.body[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body[i].vertices.length / 3)
        }
        //head
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.head);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.head);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.head.vertices.length / 3)
        //eyes
        for (let i in this.eyes) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.eyes[i].vertices.length / 3)
        }

        //lines
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3)

    }
}
class GL {
    static then;
    public gl: any;
    public programInfo;
    public butterfly: ButterFly;
    public insect: Insect;
    public buffers: any;
    public buffers1: any;
    constructor() {
        let canvas = document.getElementById("gl-canvas");
        this.gl = WebGLUtils.setupWebGL(canvas);
        if (!this.gl) { alert("WebGL isn't available"); }
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        let shaderPro = initShaders(this.gl, "vertex-shader", "fragment-shader");
        this.programInfo = {
            program: shaderPro,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderPro, 'vPosition'),
                vertexColor: this.gl.getAttribLocation(shaderPro, 'vColor'),
            },
            uniformLocations: {
                modelViewMatrix: this.gl.getUniformLocation(shaderPro, 'uModelViewMatrix'),
            },
        };
        this.buffers = {
            positions: { butterfly: {} },
            colors: { butterfly: {} }
        }
        this.buffers1 = {
            positions: { insect: {} },
            colors: { insect: {} }
        }
        this.gl.useProgram(this.programInfo.program);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);


        this.butterfly = new ButterFly();
        this.butterfly.initBuffer(this);
        this.insect = new Insect();
        this.insect.initBuffer(this);
    }
}
enum transType {
    none, rotateX, rotateY, rotateZ, rotateMain, translateX, translateY, translateZ, translateMain, zoom
}
class Util {
    public static Mat4Vec(Mat4, Vec) {
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
    public static MatsMult(A: Array<number>, B: Array<number>, i: number, reverse = false) {
        if (Number.isInteger(i) && Number.isInteger(A.length / i) && Number.isInteger(B.length / i)) {
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