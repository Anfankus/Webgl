import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten } from "../MV";
import { Material } from "../interface/Material";
export class Ground implements Drawable {
    material: Material;
    setMaterial(m:Material) {
        throw new Error("Method not implemented.");
    }
    buffers: any;

    vertices:Array<number>;
    colors:Array<number>;
    constructor(position:Array<number>,size:number){
        let [x,y,z]=position;
        this.vertices=[
            -size+x,y,-size+z,
            size+x,y,-size+z,
            -size+x,y,size+z,

            size+x,y,size+z,
            size+x,y,-size+z,
            -size+x,y,size+z
        ];
        this.colors=[];
        for(let i=0;i<this.vertices.length;i+=3){
            this.colors.push(...[1,1,0,1])
        }
    }
    initBuffer(gl: GL): void {
        let _gl=gl.gl;
        this.buffers={
            positions:_gl.createBuffer(),
            colors:_gl.createBuffer()
        }
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.vertices), _gl.STATIC_DRAW);
        // _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors);
        // _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.colors), _gl.STATIC_DRAW);

    }
    draw(gl: GL): void {
        let _gl = gl.gl;
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(mat4()));
        // _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        // _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors);
        // _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

        _gl.drawArrays(_gl.TRIANGLES, 0, this.vertices.length / 3)
        // _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
    }

}