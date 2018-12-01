var Circle3D = /** @class */ (function () {
    function Circle3D(a, b, center, frag) {
        if (a === void 0) { a = 0.5; }
        if (b === void 0) { b = 0.5; }
        if (center === void 0) { center = [0, 0, 0]; }
        if (frag === void 0) { frag = 30; }
        var radian = 2 * Math.PI;
        var eachDegree = radian / frag;
        this.vertices = [];
        var z = center[2];
        for (var i = 0; i <= radian; i += eachDegree) {
            this.vertices.push(center[0] + Math.cos(i) * a, center[1] + Math.sin(i) * b, z);
        }
    }
    return Circle3D;
}());
var FlatWing = /** @class */ (function () {
    //flag: 0--线 1--面
    function FlatWing(size, z, frag, flag, edgeColor) {
        var _a;
        if (size === void 0) { size = 0.5; }
        if (z === void 0) { z = 0; }
        if (frag === void 0) { frag = 90; }
        if (flag === void 0) { flag = 0; }
        if (edgeColor === void 0) { edgeColor = '0x000000'; }
        var wingCount = 2;
        this.vertices = [];
        this.colors = [];
        this.flag = flag;
        var _color = Util.Hex2Vec4(edgeColor);
        var radian = 2 * Math.PI;
        var eachDegree = radian / frag;
        for (var i = 0; i <= radian; i += eachDegree) {
            var length_1 = size * Math.sin(wingCount * i);
            if (i > radian / 2) {
                length_1 *= 0.85;
            }
            this.vertices.push(Math.sin(i) * length_1, Math.cos(i) * length_1, z);
            (_a = this.colors).push.apply(_a, _color);
        }
    }
    FlatWing.prototype.setCenterColor = function (color) {
        var _a = Util.Hex2Vec4(color), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
        this.colors[0] = r;
        this.colors[1] = g;
        this.colors[2] = b;
        this.colors[3] = a;
    };
    return FlatWing;
}());
var Wing = /** @class */ (function () {
    function Wing(size, thicknessFrag) {
        if (size === void 0) { size = 0.5; }
        if (thicknessFrag === void 0) { thicknessFrag = 20; }
        this.vertices = new Array();
        var angle = 25;
        var eachAngle = 2 * angle / thicknessFrag;
        var baseWing = new FlatWing(size);
        var rotate = Util.rotateY(-angle);
        var last = Util.MatsMult(baseWing.vertices, rotate, 3, true);
        var rotateM = Util.rotateY(eachAngle);
        for (var i = -angle; i < angle; i += eachAngle) {
            var newVer = [];
            for (var j = 0; j < baseWing.vertices.length; j += 3) {
                this.vertices.push(last[j], last[j + 1], last[j + 2]);
                for (var k = 0; k < 3; k++) {
                    var newEle = rotateM[3 * k] * last[j] + rotateM[3 * k + 1] * last[j + 1] + rotateM[3 * k + 2] * last[j + 2];
                    newVer.push(newEle);
                    this.vertices.push(newEle);
                }
            }
            last = newVer;
        }
    }
    Wing.getSize = function (maxSize, maxThickness, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        return 2 * cos / (maxSize * ((Math.sqrt(sin / maxThickness) + Math.sqrt(cos / maxSize))));
    };
    return Wing;
}());
var Ellipsoid = /** @class */ (function () {
    function Ellipsoid(a, b, position, color) {
        var _a;
        this.baseCircle = new Circle3D(a, b);
        this.vertices = [];
        this.colors = [];
        var last = this.baseCircle.vertices;
        var frag = 30;
        var xp = position[0], yp = position[1], zp = position[2];
        var eachDegree = 180 / frag;
        var rotateM = rotateY(eachDegree);
        var _color = Array.isArray(color) ? color : Util.Hex2Vec4(color);
        for (var i = 0; i < frag; i++) {
            var newVer = [];
            for (var j = 0; j < this.baseCircle.vertices.length; j += 3) {
                (_a = this.colors).push.apply(_a, _color.concat(_color));
                this.vertices.push(last[j] + xp, last[j + 1] + yp, last[j + 2] + zp);
                for (var k = 0; k < 3; k++) {
                    var newEle = rotateM[k][0] * last[j] + rotateM[k][1] * last[j + 1] + rotateM[k][2] * last[j + 2];
                    newVer.push(newEle);
                    this.vertices.push(newEle + position[k]);
                }
            }
            last = newVer;
        }
    }
    return Ellipsoid;
}());
var ButterFly = /** @class */ (function () {
    function ButterFly() {
        var _a, _b;
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
        this.flatWings = [
            new FlatWing(0.9),
            new FlatWing(0.85, 0.002, 32, 0, '0x1e90ff'),
            new FlatWing(0.85, -0.002, 32, 0, '0x1e90ff'),
            new FlatWing(0.5, 0.004, 200, 1),
            new FlatWing(0.5, -0.004, 200, 1)
        ];
        this.flatWings[1].setCenterColor('0xfffffff0');
        this.flatWings[2].setCenterColor('0xfffffff0');
        this.lines = [
            -0.008, 0.3, 0, -0.15, 0.6, 0,
            0.008, 0.3, 0, 0.15, 0.6, 0
        ];
        var LinesOnWings = [1, 2];
        for (var _i = 0, LinesOnWings_1 = LinesOnWings; _i < LinesOnWings_1.length; _i++) {
            var j = LinesOnWings_1[_i];
            var centerPoint = this.flatWings[j].vertices.slice(0, 2).concat([
                this.flatWings[j].vertices[2] * 1.5
            ]);
            for (var i = 0; i < this.flatWings[j].vertices.length; i += 3) {
                (_a = this.lines).push.apply(_a, centerPoint);
                (_b = this.lines).push.apply(_b, this.flatWings[j].vertices.slice(i, i + 2).concat([centerPoint[2]]));
            }
        }
        this.Wing = new Wing(0.95);
        this.modelMatrixs = mat4();
        this.baseMatrixs = mat4();
        this.lastTrans = transType.none;
    }
    ButterFly.prototype.initBuffer = function (gl) {
        var _gl = gl.gl;
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
        for (var i in this.eyes) {
            var tempPBuf = _gl.createBuffer();
            gl.buffers.positions.butterfly.eyes.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].vertices), _gl.STATIC_DRAW);
            var tempCBuf = _gl.createBuffer();
            gl.buffers.colors.butterfly.eyes.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].colors), _gl.STATIC_DRAW);
        }
        //FlatWings
        gl.buffers.positions.butterfly.wings = [];
        gl.buffers.colors.butterfly.wings = [];
        for (var i in this.flatWings) {
            var tempPBuf = _gl.createBuffer();
            gl.buffers.positions.butterfly.wings.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.flatWings[i].vertices), _gl.STATIC_DRAW);
            var tempCBuf = _gl.createBuffer();
            gl.buffers.colors.butterfly.wings.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.flatWings[i].colors), _gl.STATIC_DRAW);
        }
        //lines
        var lineBuf = _gl.createBuffer();
        gl.buffers.positions.butterfly.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);
        //Wing:
        var wing = _gl.createBuffer();
        gl.buffers.positions.butterfly.Wing = wing;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, wing);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.Wing.vertices), _gl.STATIC_DRAW);
    };
    /**
     *
     * @param delta 旋转角度
     * @param related 旋转是否相对于上次绘制
     * @param axisType 旋转轴：1--X；2--Y；3--Z;0--自身纵轴
     */
    ButterFly.prototype.rotate = function (delta, related, axisType) {
        if (related === void 0) { related = true; }
        if (axisType === void 0) { axisType = 0; }
        var transMetrix;
        var currentTrans;
        switch (axisType) {
            case 0:
                transMetrix = translate.apply(void 0, Util.Mat4Vec(mat4(-1), this.basePosition));
                var temp = rotate.apply(void 0, [delta].concat(this.baseAxis));
                transMetrix = mult(temp, transMetrix);
                transMetrix = mult(translate.apply(void 0, this.basePosition), transMetrix);
                currentTrans = transType.rotateMain;
                break;
            case 1:
                transMetrix = rotateX(delta);
                currentTrans = transType.rotateX;
                break;
            case 2:
                transMetrix = rotateY(delta);
                currentTrans = transType.rotateY;
                break;
            case 3:
                transMetrix = rotateZ(delta);
                currentTrans = transType.rotateZ;
                break;
        }
        var ret = false;
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
    };
    /**
     *
     * @param distance 距离
     * @param direction 0：主方向；1：x轴方向；2：y轴方向；3：z轴方向
     * @param related 平移是否相对于上次绘制
     */
    ButterFly.prototype.translate = function (distance, direction, related) {
        var x_dis, y_dis, z_dis;
        var currentTrans;
        switch (direction) {
            case 0:
                var eachStep = distance / Math.sqrt(this.direction[0] * this.direction[0]
                    + this.direction[1] * this.direction[1]
                    + this.direction[2] * this.direction[2]);
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
        var transMetrix = translate(x_dis, y_dis, z_dis);
        var ret = false;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
            return ret;
        }
        else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseMatrixs = this.modelMatrixs;
            this.basePosition = this.position;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.position = Util.Mat4Vec(transMetrix, this.basePosition);
        this.lastTrans = currentTrans;
        console.log(this.axis, this.baseAxis);
        return ret;
    };
    ButterFly.prototype.zoom = function (size, related) {
        var transMetrix = translate.apply(void 0, Util.Mat4Vec(mat4(-1), this.basePosition));
        var temp = mat4(size);
        temp[3][3] = 1;
        transMetrix = mult(temp, transMetrix);
        transMetrix = mult(translate.apply(void 0, this.basePosition), transMetrix);
        var currentTrans = transType.zoom;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
        }
        else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            this.baseMatrixs = this.modelMatrixs;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.lastTrans = currentTrans;
    };
    ButterFly.prototype.draw = function (gl, clear) {
        if (clear === void 0) { clear = true; }
        var _gl = gl.gl;
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
        _gl.drawArrays(_gl.LINES, 0, this.body.vertices.length / 3);
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body.vertices.length / 3);
        //eyes
        for (var i in this.eyes) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.colors.butterfly.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.eyes[i].vertices.length / 3);
        }
        //wings
        for (var i in this.flatWings) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.wings[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.colors.butterfly.wings[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);
            if (this.flatWings[i].flag === 1) {
                _gl.drawArrays(_gl.LINE_LOOP, 0, this.flatWings[i].vertices.length / 3);
            }
            else {
                _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.flatWings[i].vertices.length / 3);
            }
        }
        //lines
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3);
        //Wing
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers.positions.butterfly.Wing);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.Wing.vertices.length/3)
    };
    return ButterFly;
}());
var Insect = /** @class */ (function () {
    function Insect() {
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
    Insect.prototype.initBuffer = function (gl) {
        var _gl = gl.gl;
        //body
        gl.buffers1.positions.insect.body = [];
        gl.buffers1.colors.insect.body = [];
        for (var i in this.body) {
            var tempPBuf = _gl.createBuffer();
            gl.buffers1.positions.insect.body.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body[i].vertices), _gl.STATIC_DRAW);
            var tempCBuf = _gl.createBuffer();
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
        for (var i in this.eyes) {
            var tempPBuf = _gl.createBuffer();
            gl.buffers1.positions.insect.eyes.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].vertices), _gl.STATIC_DRAW);
            var tempCBuf = _gl.createBuffer();
            gl.buffers1.colors.insect.eyes.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].colors), _gl.STATIC_DRAW);
        }
        //lines
        var lineBuf = _gl.createBuffer();
        gl.buffers1.positions.insect.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);
    };
    /**
     *
     * @param delta 旋转角度
     * @param related 旋转是否相对于上次绘制
     * @param axisType 旋转轴：1--X；2--Y；3--Z;0--自身纵轴
     */
    Insect.prototype.rotate = function (delta, related, axisType) {
        if (related === void 0) { related = true; }
        if (axisType === void 0) { axisType = 0; }
        var transMetrix;
        var currentTrans;
        switch (axisType) {
            case 0:
                transMetrix = translate.apply(void 0, Util.Mat4Vec(mat4(-1), this.basePosition));
                var temp = rotate.apply(void 0, [delta].concat(this.baseAxis));
                transMetrix = mult(temp, transMetrix);
                transMetrix = mult(translate.apply(void 0, this.basePosition), transMetrix);
                currentTrans = transType.rotateMain;
                break;
            case 1:
                transMetrix = rotateX(delta);
                currentTrans = transType.rotateX;
                break;
            case 2:
                transMetrix = rotateY(delta);
                currentTrans = transType.rotateY;
                break;
            case 3:
                transMetrix = rotateZ(delta);
                currentTrans = transType.rotateZ;
                break;
        }
        var ret = false;
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
    };
    /**
     *
     * @param distance 距离
     * @param direction 0：主方向；1：x轴方向；2：y轴方向；3：z轴方向
     * @param related 平移是否相对于上次绘制
     */
    Insect.prototype.translate = function (distance, direction, related) {
        var x_dis, y_dis, z_dis;
        var currentTrans;
        switch (direction) {
            case 0:
                var eachStep = distance / Math.sqrt(this.direction[0] * this.direction[0]
                    + this.direction[1] * this.direction[1]
                    + this.direction[2] * this.direction[2]);
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
        var transMetrix = translate(x_dis, y_dis, z_dis);
        var ret = false;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
            return ret;
        }
        else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseMatrixs = this.modelMatrixs;
            this.basePosition = this.position;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.position = Util.Mat4Vec(transMetrix, this.basePosition);
        this.lastTrans = currentTrans;
        console.log(this.axis, this.baseAxis);
        return ret;
    };
    Insect.prototype.zoom = function (size, related) {
        var transMetrix = translate.apply(void 0, Util.Mat4Vec(mat4(-1), this.basePosition));
        var temp = mat4(size);
        temp[3][3] = 1;
        transMetrix = mult(temp, transMetrix);
        transMetrix = mult(translate.apply(void 0, this.basePosition), transMetrix);
        var currentTrans = transType.zoom;
        if (related) {
            this.modelMatrixs = mult(transMetrix, this.modelMatrixs);
        }
        else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            this.baseMatrixs = this.modelMatrixs;
        }
        this.modelMatrixs = mult(transMetrix, this.baseMatrixs);
        this.lastTrans = currentTrans;
    };
    Insect.prototype.draw = function (gl, clear) {
        if (clear === void 0) { clear = true; }
        var _gl = gl.gl;
        if (clear) {
            _gl.clearColor(0.0, 0.0, 0.0, 1.0);
            _gl.clearDepth(1.0);
        }
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrixs));
        //body
        for (var i in this.body) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.body[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.body[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body[i].vertices.length / 3);
        }
        //head
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.head);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.head);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.head.vertices.length / 3);
        //eyes
        for (var i in this.eyes) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.eyes[i].vertices.length / 3);
        }
        //lines
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3);
    };
    return Insect;
}());
var GL = /** @class */ (function () {
    function GL() {
        var canvas = document.getElementById("gl-canvas");
        this.gl = WebGLUtils.setupWebGL(canvas);
        if (!this.gl) {
            alert("WebGL isn't available");
        }
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        var shaderPro = initShaders(this.gl, "vertex-shader", "fragment-shader");
        this.programInfo = {
            program: shaderPro,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderPro, 'vPosition'),
                vertexColor: this.gl.getAttribLocation(shaderPro, 'vColor')
            },
            uniformLocations: {
                modelViewMatrix: this.gl.getUniformLocation(shaderPro, 'uModelViewMatrix')
            }
        };
        this.buffers = {
            positions: { butterfly: {} },
            colors: { butterfly: {} }
        };
        this.buffers1 = {
            positions: { insect: {} },
            colors: { insect: {} }
        };
        this.gl.useProgram(this.programInfo.program);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
        this.butterfly = new ButterFly();
        this.butterfly.initBuffer(this);
        this.insect = new Insect();
        this.insect.initBuffer(this);
    }
    return GL;
}());
var transType;
(function (transType) {
    transType[transType["none"] = 0] = "none";
    transType[transType["rotateX"] = 1] = "rotateX";
    transType[transType["rotateY"] = 2] = "rotateY";
    transType[transType["rotateZ"] = 3] = "rotateZ";
    transType[transType["rotateMain"] = 4] = "rotateMain";
    transType[transType["translateX"] = 5] = "translateX";
    transType[transType["translateY"] = 6] = "translateY";
    transType[transType["translateZ"] = 7] = "translateZ";
    transType[transType["translateMain"] = 8] = "translateMain";
    transType[transType["zoom"] = 9] = "zoom";
})(transType || (transType = {}));
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.Mat4Vec = function (Mat4, Vec) {
        var tempVec = [];
        for (var i in [0, 1, 2]) {
            tempVec.push(Vec[0] * Mat4[i][0]
                + Vec[1] * Mat4[i][1]
                + Vec[2] * Mat4[i][2]
                + Vec[3] * Mat4[i][3]);
        }
        tempVec.push(1);
        return tempVec;
    };
    Util.Hex2Vec4 = function (hex) {
        var _hex = parseInt(hex);
        var ret;
        if (hex.length <= 8) {
            ret = [_hex >> 16, (_hex & 0xFF00) >> 8, _hex & 0xFF, 0xFF];
        }
        else {
            ret = [_hex >> 24, (_hex & 0xff0000) >> 16, (_hex & 0xff00) >> 8, _hex & 0xFF];
        }
        return ret.map(function (x) { return x / 0xFF; });
    };
    Util.MatsMult = function (A, B, i, reverse) {
        if (reverse === void 0) { reverse = false; }
        if (Number.isInteger(i) && Number.isInteger(A.length / i) && Number.isInteger(B.length / i)) {
            var ret = void 0;
            var a = 0;
            if (reverse) {
                var ARows = A.length / i;
                var AColumns = i;
                var BRows = B.length / i;
                var BColumns = i;
                ret = new Array(ARows * BRows);
                while (a < ret.length) {
                    var row = Math.floor(a / BRows);
                    var column = a % BRows;
                    var each = 0;
                    for (var index = 0; index < i; index++) {
                        each += A[row * AColumns + index] * B[BColumns * column + index];
                    }
                    ret[a++] = each;
                }
            }
            else {
                var ARows = A.length / i;
                var AColumns = i;
                var BRows = i;
                var BColumns = B.length / i;
                ret = new Array(ARows * BColumns);
                while (a < ret.length) {
                    var row = Math.floor(a / BColumns);
                    var column = a % BColumns;
                    var each = 0;
                    for (var index = 0; index < i; index++) {
                        each += A[row * AColumns + index] * B[BColumns * index + column];
                    }
                    ret[a++] = each;
                }
            }
            return ret;
        }
        else {
            throw '错误的矩阵大小';
        }
    };
    Util.radians = function (degrees) {
        return degrees * Math.PI / 180.0;
    };
    Util.rotateY = function (theta) {
        var c = Math.cos(Util.radians(theta));
        var s = Math.sin(Util.radians(theta));
        var ry = new Array(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
        return ry;
    };
    return Util;
}());
