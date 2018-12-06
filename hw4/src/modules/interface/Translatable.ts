import {Util} from '../Util';
import {mat4,translate,mult,rotate,rotateX,rotateY,rotateZ} from '../MV' 
export enum transType {
    none, rotateX, rotateY, rotateZ, rotateMain, rotateSec, translateX, translateY, translateZ, translateMain, zoom
}
export  class Translatable {
    public direction: Array<number>;
    public baseDirection: Array<number>;
    public axisMain: Array<number>;
    public baseAxisMain: Array<number>;
    public axisSecondary: Array<number>;
    public baseAxisSec: Array<number>;
    public position: Array<number>;
    public basePosition: Array<number>;

    public modelMatrix:Array<Array<number>>;
    public baseMatrix:Array<Array<number>>;
    
    public lastTrans: transType;
    constructor() {
        this.direction = [0, 1, 0, 1];
        this.baseDirection = [0, 1, 0, 1];

        this.axisMain = [0, 0, 1, 1];
        this.baseAxisMain = [0, 0, 1, 1];

        this.axisSecondary = [1, 0, 0, 1];
        this.baseAxisSec = [1, 0, 0, 1];

        this.position = [0, 0, 0, 1];
        this.basePosition = [0, 0, 0, 1];

        this.modelMatrix = mat4();
        this.baseMatrix = mat4();
        this.lastTrans = transType.none;
    }
    /**
     * 
     * @param delta 旋转角度
     * @param related 旋转是否相对于上次绘制
     * @param axisType 旋转轴：1--X；2--Y；3--Z,4---自身横轴;0--自身纵轴
     */
    public rotate(delta: number, related = true, axisType = 0): boolean {
        let rotateMatrix;

        let transMatrix;
        let currentTrans = [transType.rotateMain, transType.rotateX, transType.rotateY, transType.rotateZ, transType.rotateSec][axisType];
        let ret = false;
        if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseDirection = this.direction;
            this.baseMatrix = this.modelMatrix;
            this.baseAxisMain = this.axisMain;
            this.baseAxisSec = this.axisSecondary;
            this.basePosition = this.position;
        }
        switch (currentTrans) {
            case transType.rotateSec:
                transMatrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition) );
                rotateMatrix = rotate(delta, this.baseAxisSec);
                transMatrix = mult(rotateMatrix, transMatrix);
                transMatrix = mult(translate(...this.basePosition), transMatrix);
                break;
            case transType.rotateMain:
                transMatrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition));
                rotateMatrix = rotate(delta, this.baseAxisMain);
                transMatrix = mult(rotateMatrix, transMatrix);
                transMatrix = mult(translate(...this.basePosition), transMatrix);
                break;
            case transType.rotateX: rotateMatrix = transMatrix = rotateX(delta);
                break;
            case transType.rotateY: rotateMatrix = transMatrix = rotateY(delta);
                break;
            case transType.rotateZ: rotateMatrix = transMatrix = rotateZ(delta);
                break;
        }
        if (related) {
            this.modelMatrix = mult(transMatrix, this.modelMatrix);
            this.direction = Util.Mat4Vec(transMatrix, this.direction);
            return ret;
        }
        this.modelMatrix = mult(transMatrix, this.baseMatrix);
        this.position = Util.Mat4Vec(transMatrix, this.basePosition);

        this.direction = Util.Mat4Vec(rotateMatrix, this.baseDirection);
        this.axisMain = Util.Mat4Vec(rotateMatrix, this.baseAxisMain);
        this.axisSecondary=Util.Mat4Vec(rotateMatrix, this.baseAxisSec);
        this.lastTrans = currentTrans;
        return ret;
    }
    /**
     * 
     * @param distance 距离
     * @param direction 0：主方向；1：x轴方向；2：y轴方向；3：z轴方向
     * @param related 平移是否相对于上次绘制
     */
    public translate(distance: number, direction: number, related: boolean) {
        let x_dis, y_dis, z_dis;
        let currentTrans = [transType.translateMain, transType.translateX, transType.translateY, transType.translateZ][direction];
        let ret = false;
        if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseDirection = this.direction;
            this.baseMatrix = this.modelMatrix;
            this.baseAxisMain = this.axisMain;
            this.baseAxisSec=this.axisSecondary;
            this.basePosition = this.position;
        }
        switch (currentTrans) {
            case transType.translateMain:
                let eachStep = distance / Math.sqrt(
                    this.direction[0] * this.direction[0]
                    + this.direction[1] * this.direction[1]
                    + this.direction[2] * this.direction[2])
                x_dis = eachStep * this.direction[0];
                y_dis = eachStep * this.direction[1];
                z_dis = eachStep * this.direction[2];
                break;
            case transType.translateX:
                x_dis = distance;
                y_dis = z_dis = 0;
                break;
            case transType.translateY:
                y_dis = distance;
                x_dis = z_dis = 0;
                break;
            case transType.translateZ:
                z_dis = distance;
                y_dis = x_dis = 0;
                break;
        }
        let transMatrix = translate(x_dis, y_dis, z_dis);

        if (related) {
            this.modelMatrix = mult(transMatrix, this.modelMatrix);
            return ret;
        }
        this.modelMatrix = mult(transMatrix, this.baseMatrix);
        this.position = Util.Mat4Vec(transMatrix, this.basePosition);
        this.lastTrans = currentTrans;
        return ret;
    }

    public zoom(size: number, related: boolean) {
        let transMatrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition));
        let temp = mat4(size);
        temp[3][3] = 1;

        transMatrix = mult(temp, transMatrix);
        transMatrix = mult(translate(...this.basePosition), transMatrix);

        let currentTrans = transType.zoom;
        if (related) {
            this.modelMatrix = mult(transMatrix, this.modelMatrix);
        } else if (this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            this.baseMatrix = this.modelMatrix;
        }
        this.modelMatrix = mult(transMatrix, this.baseMatrix);
        this.lastTrans = currentTrans;
    }

}