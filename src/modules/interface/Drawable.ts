import GL from "../GL";
import { Material } from "./Material";
import Collision from "../Collision/Collision";

export default interface Drawable{
    buffers:any;
    material:Material;

    setMaterial(m:Material);
    initBuffer(gl: GL):void;

    draw(gl: GL, self: boolean): void;
}