import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten } from "../MV";
import {Material} from "../interface/Material";
import {Util} from "../Util";
import {NoneMaterial} from "../materials/NoneMaterial";
import { Translatable } from "../interface/Translatable";
import Collisible from "../interface/Collisible";
import Collision, { ImpactType } from "../Collision/Collision";
import { Cube } from "./Basis/Cube";

export class Apartment extends Translatable implements Drawable,Collisible{//size = 8*6.5
    collision:Collision;
    material: Material;
    setMaterial(m: Material) {
        this.material=m;
    }
    buffers: any;
    public building:Array<Cube>;
    public door:Array<Cube>;
    public window:Array<Cube>;

    constructor(){
        super();
        let [x,y,z] = [0,0,0];
        this.translate(x,1)
        this.material = new NoneMaterial;
        this.building = [
            new Cube(8,21,6.5,[x,y,z],null),
        ];
        this.door = [
            new Cube(1,1.8,0.1,[x+3,y,z+0.05],null),
            new Cube(1,1.8,0.1,[x+4,y,z+0.05],null)
        ];
        this.window = [
            //1
            new Cube(1,1,0.06,[x+0.4,y+3+0.8,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3+0.8,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3+0.8,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3+0.8,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3+0.8,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3+0.8,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3+0.8,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3+0.8,z-6.45],null),
            //2
            new Cube(1,1,0.06,[x+0.4,y+3.8+2,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2,z-6.45],null),
            //3
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*2,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*2,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*2,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*2,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*2,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*2,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*2,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*2,z-6.45],null),
            //4
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*3,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*3,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*3,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*3,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*3,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*3,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*3,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*3,z-6.45],null),
            //5
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*4,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*4,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*4,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*4,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*4,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*4,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*4,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*4,z-6.45],null),
            //6
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*5,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*5,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*5,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*5,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*5,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*5,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*5,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*5,z-6.45],null),
            //7,null
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*6,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*6,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*6,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*6,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*6,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*6,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*6,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*6,z-6.45],null),
            //8
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*7,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*7,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*7,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*7,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*7,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*7,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*7,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*7,z-6.45],null),
            //9
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*8,z-0.05],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*8,z-0.05],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*8,z-0.05],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*8,z-0.05],null),
            new Cube(1,1,0.06,[x+0.4,y+3.8+2*8,z-6.45],null),new Cube(1,1,0.06,[x+1.7,y+3.8+2*8,z-6.45],null),new Cube(1,1,0.06,[x+3.4,y+3.8+2*8,z-6.45],null),new Cube(1,1,0.06,[x+4.7,y+3.8+2*8,z-6.45],null),
        ];
        this.collision=new Collision(ImpactType.ball,4);
        //this.collision.setPosition(position);
    }
    initBuffer(gl: GL): void {
        let _gl = gl.gl;
        this.buffers={
            positions:{},
            normals:{}
        }
        //building
        this.buffers.positions.building = [];
        this.buffers.normals.building=[];
        for(let i in this.building){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.building.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.building[i].vertices), _gl.STATIC_DRAW);
            let tempNBuf = _gl.createBuffer();
            this.buffers.normals.building.push(tempNBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempNBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.building[i].normals), _gl.STATIC_DRAW);

        }
        //roof
        // this.buffers.positions.roof = [];
        // this.buffers.normals.roof=[];

        // for(let i in this.roof){
        //     let tempPBuf = _gl.createBuffer();
        //     this.buffers.positions.roof.push(tempPBuf);
        //     _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
        //     _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.roof[i].vertices), _gl.STATIC_DRAW);
        //     let tempNBuf = _gl.createBuffer();
        //     this.buffers.normals.roof.push(tempNBuf);
        //     _gl.bindBuffer(_gl.ARRAY_BUFFER, tempNBuf);
        //     _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.roof[i].normals), _gl.STATIC_DRAW);

        // }
        //door
        this.buffers.positions.door = [];
        this.buffers.normals.door=[];

        for(let i in this.door){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.door.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.door[i].vertices), _gl.STATIC_DRAW);
            let tempNBuf = _gl.createBuffer();
            this.buffers.normals.door.push(tempNBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempNBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.door[i].normals), _gl.STATIC_DRAW);

        }
        //window
        this.buffers.positions.window = [];
        this.buffers.normals.window=[];

        for(let i in this.window){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.window.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.window[i].vertices), _gl.STATIC_DRAW);
            let tempNBuf = _gl.createBuffer();
            this.buffers.normals.window.push(tempNBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempNBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.window[i].normals), _gl.STATIC_DRAW);

        }
        //wall
        // this.buffers.positions.wall = [];
        // this.buffers.normals.wall=[];

        // for(let i in this.wall){
        //     let tempPBuf = _gl.createBuffer();
        //     this.buffers.positions.wall.push(tempPBuf);
        //     _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
        //     _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.wall[i].vertices), _gl.STATIC_DRAW);
        //     let tempNBuf = _gl.createBuffer();
        //     this.buffers.normals.wall.push(tempNBuf);
        //     _gl.bindBuffer(_gl.ARRAY_BUFFER, tempNBuf);
        //     _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.wall[i].normals), _gl.STATIC_DRAW);

        // }

    }

  draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;
    //光照处理
    let lt = gl.currentLight;
    let ambientProduct = Util.Vec4Mult(lt.lightAmbient, this.material.materialAmbient);
    let diffuseProduct = Util.Vec4Mult(lt.lightDiffuse, this.material.materialDiffuse);
    let specularProduct = Util.Vec4Mult(lt.lightSpecular, this.material.materialSpecular);
    _gl.uniform4fv(gl.programInfo.uniformLocations.ambientVectorLoc, new Float32Array(ambientProduct));
    _gl.uniform4fv(gl.programInfo.uniformLocations.diffuseVectorLoc, new Float32Array(diffuseProduct));
    _gl.uniform4fv(gl.programInfo.uniformLocations.specularVectorLoc, new Float32Array(specularProduct));
    _gl.uniform1f(gl.programInfo.uniformLocations.shininessLoc, this.material.materialShininess);

    _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
    _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.normalMatrixLoc, false, flatten(this.rotateMatrix));
        //building
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);
        for (let i in this.building) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.building[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.building[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLES, 0, this.building[i].vertices.length / 3)
        }
        //roof
        // for (let i in this.roof) {
        //     _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.roof[i]);
        //     _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        //     _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.roof[i]);
        //     _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
        //     _gl.drawArrays(_gl.TRIANGLES, 0, this.roof[i].vertices.length / 3)
        // }
        //door
        for (let i in this.door) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.door[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.door[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLES, 0, this.door[i].vertices.length / 3)
        }
        //window
        for (let i in this.window) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.window[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.window[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLES, 0, this.window[i].vertices.length / 3)
        }
         //wall
        //  for (let i in this.wall) {
        //      _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.wall[i]);
        //      _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        //      _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.wall[i]);
        //      _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
        //       _gl.drawArrays(_gl.TRIANGLES, 0, this.wall[i].vertices.length / 3)
        //  }

         _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
         _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

    }
}