import { Translatable } from '../interface/Translatable';
import Drawable from '../interface/Drawable'
import { flatten, vec4, mult } from '../MV'
import GL from '../GL';
import { Util } from '../Util';
import { Light } from '../scene/Light';
import { Material } from '../interface/Material';
import { NoneMaterial } from '../materials/NoneMaterial';
import { Ellipsoid } from './Basis/Ellipsoid';
import { HalfWing } from './Basis/HalfWing';

export class ButterFly extends Translatable implements Drawable {
    material: Material;
    setMaterial(m:Material) {
        this.material=m;
    }
    buffers: any;

    public body: Ellipsoid;
    public eyes: Array<Ellipsoid>;
    public LeftWing: HalfWing;
    public RightWing: HalfWing;
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
        this.LeftWing = new HalfWing(0.95);
        this.RightWing = new HalfWing(0.95, false);
        this.lines = [
            -0.008, 0.3, 0, -0.15, 0.6, 0,
            0.008, 0.3, 0, 0.15, 0.6, 0
        ];
    }
    public initBuffer(gl: GL) {
        let _gl = gl.gl;
        this.buffers = {
            positions: {},
            normals: {}
        };
        //lines
        let lineBuf = _gl.createBuffer();
        this.buffers.positions.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);
        //body
        this.body.initBuffer(gl);
        //eyes
        for (let i of this.eyes) {
            i.initBuffer(gl);
        }

        this.LeftWing.initBuffer(gl);
        this.RightWing.initBuffer(gl);
    }

  public draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        //lines
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3);
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);


        //body
        this.body.draw(gl);
        //_gl.drawArrays(_gl.LINES, 0, this.body.vertices.length / 3)
        //_gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body.vertices.length / 3)
        for(let i of this.eyes){
          i.draw(gl, false);
        }
        //wings
        this.LeftWing.draw(gl);
        this.RightWing.draw(gl);
    }
    public rotate(delta: number, related = true, axisType = 0): boolean {
        this.body.rotate(delta, related, axisType);
        this.LeftWing.rotate(delta, related, axisType);
        this.RightWing.rotate(delta, related, axisType);
        return super.rotate(delta, related, axisType);
    }
    public translate(distance: number, direction: number, related = true) {
        this.body.translate(distance, direction, related);
        this.LeftWing.translate(distance, direction, related);
        this.RightWing.translate(distance, direction, related);
        return super.translate(distance, direction, related);
    }
    public flap(degree: number): void {
        this.LeftWing.rotate(degree, true, 5, false)
        this.RightWing.rotate(-degree, true, 5, false)
    }
    public fall(lastTime: number, speedX: number): number {
        let decrease = -9.8 * lastTime;
        let x = Math.sqrt(this.direction[0] ** 2 + this.direction[2] ** 2);
        let y = this.direction[1];
      let a = speedX;
        let b = speedX * y / x;

        let alpha = Math.atan(y / x), beta = Math.atan((b + decrease) / a);
        let deflection = Math.abs(Util.degree(alpha - beta));
      this.rotate(deflection, true, 6);
      console.log('fall',deflection);
        return decrease;
    }
    public moveForward(distance: number): void {
        this.translate(distance, 0);
    }
    public fly(speedX: number): number {
        let decrease = 5;
        let x = Math.sqrt(this.direction[0] ** 2 + this.direction[2] ** 2);
        let y = this.direction[1];
        let a = speedX
        let b = speedX * y / x;

        let alpha = Math.atan(y / x), beta = Math.atan((b + decrease) / a);
        let deflection = Util.degree(alpha - beta);
        console.log('fly',deflection);
        this.rotate(deflection, true, 4);
        return decrease;
    }
}