import {Ellipsoid,Wing} from './Basis';
import {Translatable} from '../interface/Translatable';
import Drawable from '../interface/Drawable'
import {flatten} from '../MV'
import GL from '../GL';

export class ButterFly extends Translatable implements Drawable,GLObject{
    buffers: any;
    
    public body: Ellipsoid;
    public eyes: Array<Ellipsoid>;
    public flatWings: Array<Array<number>>;
    public Wing: Wing;
    public lines;
    constructor() {
        super();
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
    }
    public initBuffer(gl: GL) {
        let _gl = gl.gl;
        this.buffers={
            positions:{},
            colors:{}
        }
        //body
        this.buffers.positions.body = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.body);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body.vertices), _gl.STATIC_DRAW);

        this.buffers.colors.body = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors.body);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body.colors), _gl.STATIC_DRAW);
        //eyes
        this.buffers.positions.eyes = [];
        this.buffers.colors.eyes = [];
        for (let i in this.eyes) {
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.eyes.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].vertices), _gl.STATIC_DRAW);

            let tempCBuf = _gl.createBuffer();
            this.buffers.colors.eyes.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].colors), _gl.STATIC_DRAW);

        }

        //FlatWings
        this.buffers.positions.wings = [_gl.createBuffer(), _gl.createBuffer()];
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.wings[0]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.Wing.flats[0]), _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.wings[1]);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.Wing.flats[1]), _gl.STATIC_DRAW);

        //lines
        let lineBuf = _gl.createBuffer();
        this.buffers.positions.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);

        //Wing:
        let WingBuf = _gl.createBuffer();
        this.buffers.positions.Wing = WingBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, WingBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.Wing.vertices), _gl.STATIC_DRAW);


    }

    public draw(gl: GL, clear = true):void {
        let _gl = gl.gl;
        if (clear) {
            _gl.clearColor(0.0, 0.0, 0.0, 1.0);
            _gl.clearDepth(1.0);
        }
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.cameraMatrixLoc, false, flatten(gl.cameraMatrix));
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.projectionMatrixLoc, false, flatten(gl.projectionMatrix));

        //body
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.body);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors.body);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        _gl.drawArrays(_gl.LINES, 0, this.body.vertices.length / 3)
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body.vertices.length / 3)

        //eyes
        for (let i in this.eyes) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.eyes[i].vertices.length / 3)
        }

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        //wings
        for (let i in this.flatWings) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.wings[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.flatWings[i].length / 3)

        }
        //lines

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3)

        //Wing
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.Wing);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.Wing.vertices.length / 3)
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);

    }
}

