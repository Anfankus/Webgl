import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten } from "../MV";
import { Material } from "../interface/Material";
import { NoneMaterial } from "../materials/NoneMaterial";
import {Util} from "../Util";
import {CustomizedMaterial} from "../materials/CustomizedMaterial";
import { MetalMaterial } from "../materials/MetalMaterial";
import Collisible from "../interface/Collisible";
import {Texture} from "../texture/Textrue";
import Collision, { ImpactType } from "../Collision/Collision";
export class Ground implements Drawable,Collisible{
    collision:Collision;
    material: Material;
    buffers: any;
    texture:Texture;

    vertices:Array<number>;
    normals:Array<number>;
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
        this.normals=[
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0
        ];
        this.texture=new Texture;
        //this.texture.imagepath="../../../image/texImageBackGround.jpg";
        this.texture.textureVertic=[
            0,0,
            0,1,
            1,1,
            0,1,
            1,1,
            1,0
        ]
        
        this.collision=new Collision(ImpactType.flat,size);
        this.collision.setPosition(position);
    }
    setMaterial(m:Material) {
        this.material=m;
    }
    initBuffer(gl: GL): void {
        let _gl=gl.gl;
        this.buffers={
            positions:_gl.createBuffer(),
            normals:_gl.createBuffer(),
            tex:_gl.createBuffer()
        };
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.vertices), _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.normals), _gl.STATIC_DRAW);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.tex);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.texture.textureVertic), _gl.STATIC_DRAW);
    }

    draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;
        _gl.uniform1i(gl.programInfo.uniformLocations.bTexCoordLocation, 1);
        //this.texture.initTexture(gl, this.texture.imagepath);

        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(mat4()));
        let lt = gl.currentLight;
        let ambientProduct = Util.Vec4Mult(lt.lightAmbient, this.material.materialAmbient);
        let diffuseProduct = Util.Vec4Mult(lt.lightDiffuse, this.material.materialDiffuse);
        let specularProduct = Util.Vec4Mult(lt.lightSpecular, this.material.materialSpecular);
        _gl.uniform4fv(gl.programInfo.uniformLocations.ambientVectorLoc, new Float32Array(ambientProduct));
        _gl.uniform4fv(gl.programInfo.uniformLocations.diffuseVectorLoc, new Float32Array(diffuseProduct));
        _gl.uniform4fv(gl.programInfo.uniformLocations.specularVectorLoc, new Float32Array(specularProduct));
        _gl.uniform1f(gl.programInfo.uniformLocations.shininessLoc, this.material.materialShininess);
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.normalMatrixLoc, false, flatten(mat4()));

        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.normals);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexNormal, 3, _gl.FLOAT, false, 0, 0);

        //纹理
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.tex);
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.texcoordLocation);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.texcoordLocation, 2, _gl.FLOAT, false, 0, 0);

        _gl.drawArrays(_gl.TRIANGLES, 0, this.vertices.length / 3);
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexNormal);

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.texcoordLocation);
    }
}
