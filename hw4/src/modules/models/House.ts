import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten, mult, translate } from "../MV";
import {Material} from "../interface/Material";
import {Util} from "../Util";
import {NoneMaterial} from "../materials/NoneMaterial";
import { Translatable } from "../interface/Translatable";
import Collisible from "../interface/Collisible";
import Collision, { ImpactType } from "../Collision/Collision";
import { Cube } from "./Basis/Cube";
import { Tri_prism } from "./Basis/Tri_prism";
import { SunMaterial } from "../materials/SunMaterial";
import { SkyMaterial } from "../materials/SkyMaterial";
import Shaded from "../interface/Shaded";
import { WindowMaterial } from "../materials/WindowMaterial";
import { HouseMaterial } from "../materials/HouseMaterial";
import { HouseRoofMaterial } from "../materials/HouseRoofMaterial";
import { GateMaterial } from "../materials/GateMaterial";
import { WallMaterial } from "../materials/WallMaterial";

export class House extends Translatable implements Drawable,Collisible,Shaded{//size = 9*7 center(3.5,-2.5)
    shaded: boolean
    collision:Collision;
    material: Material;
    
    buffers: any;
    public building:Array<Cube>;
    public roof:Array<Tri_prism>;
    public door:Array<Cube>;
    public window:Array<Cube>;
    public wall:Array<Cube>;

    constructor(){
        super();
        //let [x,y,z] = position;
        this.material = new SkyMaterial;
        this.building = [
            new Cube(5,3,4,[-3.5,0,2.5],null),
            new Cube(2,3,2.5,[4.9999-3.5,0,-1.5+2.5],null),
            new Cube(3,2.7,2.5,[0-3.5,2.9999,-1.5+2.5],null)
        ];
        this.roof = [
            new Tri_prism(6,0.8,4,[-0.5-3.5,2.9998,0+2.5],null),
            new Tri_prism(3.5,0.5,2.5,[-0.25-3.5,5.6999,-1.5+2.5],null),
            new Tri_prism(3,0.5,2.5,[4.9999-4,2.9998,-1.5+2.5],null)
        ];
        
        this.door = [
            new Cube(1,1.8,0.1,[+5.5-3.5,0,-1.49+2.5],null)
        ];
        this.window = [//数据有点问题，等加了纹理再调
            new Cube(2,1.5,0.06,[1.5-3.5,0.8,0.01+2.5],null),
            new Cube(0.06,1.5,2,[-0.01-3.5,0.8,-1+2.5],null),
            new Cube(0.06,1.3,1.5,[-0.01-3.5,3.7,-2+2.5],null),
        ];
        this.wall = [
            new Cube(6.2,2,0.2,[-1-3.5,0,+1+2.5],null),
            new Cube(0.2,2,6,[-0.9999-3.5,+0.00001,+0.9999+2.5],null),
            new Cube(9,2,0.2,[-1-3.5,0,-5+2.5],null),
            new Cube(0.2,2,6,[7.7999-3.5,0.00001,0.9999+2.5],null),
        ];
        for(let i in this.roof){
            this.roof[i].setMaterial(new HouseRoofMaterial)
        }
        for(let i in this.wall){
            this.wall[i].setMaterial(new WallMaterial)
        }
        for(let i in this.door){
            this.door[i].setMaterial(new GateMaterial)
        }
        for(let i in this.building){
            this.building[i].setMaterial(new HouseMaterial)
        }
        for(let i in this.window){
            this.window[i].setMaterial(new WindowMaterial)
        }
        this.collision=new Collision(ImpactType.ball,4);
        this.collision.setPosition(this.position);
    }
    initBuffer(gl: GL): void {
       
        for(let i in this.building){
            this.building[i].initBuffer(gl)
        }
        //roof
        for(let i in this.roof){
            this.roof[i].initBuffer(gl)

        }
        //door
        for(let i in this.door){
            this.door[i].initBuffer(gl)
        }
        //window
        for(let i in this.window){
            this.window[i].initBuffer(gl)
        }
        //wall
        for(let i in this.wall){
            this.wall[i].initBuffer(gl)
        }

    }

    draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;
        _gl.uniform1i(gl.programInfo.uniformLocations.bTexCoordLocation, 0);
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));

        //building
        for (let i in this.building) {
            this.building[i].draw(gl,false);
        }
        //roof
        for (let i in this.roof) {
            this.roof[i].draw(gl,false)
        }
        //door
        for (let i in this.door) {
            this.door[i].draw(gl,false)
        }
        //window
        for (let i in this.window) {
            this.window[i].draw(gl,false)
        }
         //wall
        for (let i in this.wall) {
             this.wall[i].draw(gl,false)
         }
        if(this.shaded){
            this.drawShadow(gl);
        }

        

    }
    public rotate(delta: number, related = true, axisType = 0): boolean {
        for(let i in this.window){
            this.window[i].rotate(delta,related,axisType)
        }
        for(let i in this.building){
            this.building[i].rotate(delta,related,axisType)
        }
        for(let i in this.roof){
            this.roof[i].rotate(delta,related,axisType)
        }
        for(let i in this.door){
            this.door[i].rotate(delta,related,axisType)
        }
        for(let i in this.wall){
            this.wall[i].rotate(delta,related,axisType)
        }
        return super.rotate(delta, related, axisType);

    }
    public translate(distance: number, direction: number, related = true) {
        for(let i in this.window){
            this.window[i].translate(distance, direction, related)
        }
        for(let i in this.building){
            this.building[i].translate(distance, direction, related)
        }
        for(let i in this.roof){
            this.roof[i].translate(distance, direction, related)
        }
        for(let i in this.door){
            this.door[i].translate(distance, direction, related)
        }
        for(let i in this.wall){
            this.wall[i].translate(distance, direction, related)
        }
        return super.translate(distance, direction, related);
    }
    public zoom(size: number, related: boolean){
        for(let i in this.window){
            this.window[i].zoom(size,related)
        }
        for(let i in this.building){
            this.building[i].zoom(size,related)
        }
        for(let i in this.roof){
            this.roof[i].zoom(size,related)
        }
        for(let i in this.door){
            this.door[i].zoom(size,related)
        }
        for(let i in this.wall){
            this.wall[i].zoom(size,related)
        }
        this.collision.zoom(size);
        return super.zoom(size,related);
    }
    setShaded(): void {
        this.shaded=true;
    }
    clearShaded():void{
        this.shaded=false;
    }
    setMaterial(m: Material) {
        this.material=m;
    }
    drawShadow(gl: GL): void {
        for (let i in this.building) {
            this.building[i].drawShadow(gl);
        }
        //roof
        for (let i in this.roof) {
            this.roof[i].drawShadow(gl)
        }
        //door
        for (let i in this.door) {
            this.door[i].drawShadow(gl)
        }
        //window
        for (let i in this.window) {
            this.window[i].drawShadow(gl)
        }
         //wall
         for (let i in this.wall) {
             this.wall[i].drawShadow(gl)
         }

    }
}