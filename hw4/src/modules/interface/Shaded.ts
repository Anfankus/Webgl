import GL from "../GL";

export default interface Shaded{
    shaded:boolean;
    setShaded():void;
    clearShaded():void;
    drawShadow(gl:GL,self:boolean):void;
}