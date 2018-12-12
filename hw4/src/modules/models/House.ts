import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten } from "../MV";
import { Cube, Tri_prism } from "./Basis";
export class House implements Drawable{
    material: import("c:/Users/21405/Desktop/Webgl-master/hw4/src/modules/interface/Material").Material;
    setMaterial(m: import("c:/Users/21405/Desktop/Webgl-master/hw4/src/modules/interface/Material").Material) {
        throw new Error("Method not implemented.");
    }
    buffers: any;
    public building:Array<Cube>;
    public roof:Array<Tri_prism>;
    public door:Array<Cube>;
    public window:Array<Cube>;
    public wall:Array<Cube>;

    constructor(position:Array<number>){
        let [x,y,z] = position;
        this.building = [
            new Cube(4,5,3,[x,y,z]),
            new Cube(1.5,3,3,[x+3.999,y-2,z]),//[x+4,y-2,z]取3.99为让两个平面错开
            new Cube(2.5,3,2.7,[x,y-2,z+2.9999])
        ];
        this.roof = [
            new Tri_prism(4.5,1,3,[x-0.25,y,z+2.9998]),
            new Tri_prism(3,0.8,5,[x-0.25,y-2,z+5.6999])
        ];
        this.door = [
            new Cube(1.2,1.8,0.1,[x+0.25,y+0.001,z+0.001])
        ];
        this.window = [//数据有点问题，等加了纹理再调
            new Cube(1,1,0.1,[x+3.9998,y-2,z+0.5]),
            new Cube(1,1,0.1,[x+0.5,y-2,z+3.4999]),
            new Cube(1,1,0.1,[x+1,y,z]),
        ];
        this.wall = [
            new Cube(3,2,0.5,[x,y,z-10]),
        ];
    } 
    initBuffer(gl: GL): void {
        let _gl = gl.gl;
        this.buffers={
            positions:{}
        }
        //building
        this.buffers.positions.building = [];
        for(let i in this.building){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.building.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.building[i].vertices), _gl.STATIC_DRAW);
        }
        //roof
        this.buffers.positions.roof = [];
        for(let i in this.roof){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.roof.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.roof[i].vertices), _gl.STATIC_DRAW);
        }
        //door
        this.buffers.positions.door = [];
        for(let i in this.door){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.door.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.door[i].vertices), _gl.STATIC_DRAW);
        }
        //window
        this.buffers.positions.window = [];
        for(let i in this.window){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.window.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.window[i].vertices), _gl.STATIC_DRAW);
        }
        //wall
        this.buffers.positions.wall = [];
        for(let i in this.wall){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.wall.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.wall[i].vertices), _gl.STATIC_DRAW);
        }
   
    }
    draw(gl: GL): void {
        let _gl = gl.gl;
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(mat4()));
        //building
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        for (let i in this.building) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.building[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.building[i].vertices.length / 3)
        }
        //roof
        for (let i in this.roof) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.roof[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.roof[i].vertices.length / 3)
        }
        //door
        for (let i in this.door) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.door[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.door[i].vertices.length / 3)
        }
        //window
        for (let i in this.window) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.window[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.window[i].vertices.length / 3)
        }
         //wall
         for (let i in this.wall) {
             _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.wall[i]);
             _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
             _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.wall[i].vertices.length / 3)
         }

         _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);

    }
}