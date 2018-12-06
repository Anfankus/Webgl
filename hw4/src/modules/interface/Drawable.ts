import GL from "../GL";

export default interface Drawable{
    buffers:any;

    initBuffer(gl: GL):void;
    draw(gl: GL):void;
}