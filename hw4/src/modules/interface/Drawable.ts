import GL from "../GL";
import { Material } from "./Material";

export default interface Drawable{
    buffers:any;
    material:Material;
    
    setMaterial(m:Material);
    initBuffer(gl: GL):void;
    draw(gl: GL):void;
}