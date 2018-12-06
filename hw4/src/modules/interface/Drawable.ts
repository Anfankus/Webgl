import GL from "../GL";

export default interface Drawable{
    draw(gl: GL, clear:boolean):void;
}