import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten } from "../MV";
import { Cube, Tri_prism } from "./Basis/Basis";
import {Material} from "../interface/Material";
import {Util} from "../Util";
import {NoneMaterial} from "../materials/NoneMaterial";
import { Translatable } from "../interface/Translatable";
import Collisible from "../interface/Collisible";
import Collision, { ImpactType } from "../Collision/Collision";

export class House extends Translatable implements Drawable,Collisible{//size = 9*7
    collision:Collision;
    material: Material;
    setMaterial(m: Material) {
        this.material=m;
    }
    buffers: any;
    public building:Array<Cube>;
    public roof:Array<Tri_prism>;
    public door:Array<Cube>;
    public window:Array<Cube>;
    public wall:Array<Cube>;

    constructor(position:Array<number>){
        super();
        let [x,y,z] = position;
        this.material = new NoneMaterial;
        this.building = [
            new Cube(5,3,4,[x,y,z]),
            new Cube(2,3,2.5,[x+4.9999,y,z-1.5]),
            new Cube(3,2.7,2.5,[x,y+2.9999,z-1.5])
        ];
        this.roof = [
            new Tri_prism(6,0.8,4,[x-0.5,y+2.9998,z]),
            new Tri_prism(3.5,0.5,2.5,[x-0.25,y+5.6999,z-1.5])
        ];
        this.door = [
            new Cube(1,1.8,0.1,[x+5.5,y,z-1.55])
        ];
        this.window = [//数据有点问题，等加了纹理再调
            new Cube(2,1.5,0.06,[x+1.5,y+0.8,z-0.05]),
            new Cube(0.06,1.5,2,[x-0.01,y+0.8,z-1]),
            new Cube(0.06,1.3,1.5,[x-0.01,y+3.7,z-2]),
        ];
        this.wall = [
            new Cube(6.2,2,0.2,[x-1,y,z+1]),
            new Cube(0.2,2,6,[x-0.9999,y+0.00001,z+0.9999]),
            new Cube(9,2,0.2,[x-1,y,z-5]),
            new Cube(0.2,2,6,[x+7.7999,y+0.00001,z+0.9999]),
        ];
        this.collision=new Collision(ImpactType.ball,4);
        this.collision.setPosition(position);
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
        this.buffers.positions.roof = [];
        this.buffers.normals.roof=[];

        for(let i in this.roof){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.roof.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.roof[i].vertices), _gl.STATIC_DRAW);
            let tempNBuf = _gl.createBuffer();
            this.buffers.normals.roof.push(tempNBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempNBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.roof[i].normals), _gl.STATIC_DRAW);

        }
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
        this.buffers.positions.wall = [];
        this.buffers.normals.wall=[];

        for(let i in this.wall){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.wall.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.wall[i].vertices), _gl.STATIC_DRAW);
            let tempNBuf = _gl.createBuffer();
            this.buffers.normals.wall.push(tempNBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempNBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.wall[i].normals), _gl.STATIC_DRAW);

        }

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
        for (let i in this.roof) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.roof[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.roof[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLES, 0, this.roof[i].vertices.length / 3)
        }
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
         for (let i in this.wall) {
             _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.wall[i]);
             _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
             _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals.wall[i]);
             _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);
              _gl.drawArrays(_gl.TRIANGLES, 0, this.wall[i].vertices.length / 3)
         }

         _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
         _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

    }
}