import { mat4, mult, rotate, rotateX, rotateY, rotateZ, translate, cross } from '../MV';
import { Util } from '../Util';
export enum transType {
    none,
    rotateX, rotateY, rotateZ,
    rotateSelfX, rotateSelfY, rotateSelfZ,
    rotateMain, rotateSec, rotateDir, rotateFall,
    translateX, translateY, translateZ,
    translateMain,translateSecondary,
    zoom
}
export abstract class Translatable {
    public direction: Array<number>;
    public baseDirection: Array<number>;
    public axisMain: Array<number>;
    public baseAxisMain: Array<number>;
    public axisSecondary: Array<number>;
    public baseAxisSec: Array<number>;
    public position: Array<number>;
    public basePosition: Array<number>;

    public modelMatrix: Array<Array<number>>;
    public baseMatrix: Array<Array<number>>;
    public rotateMatrix: Array<Array<number>>;
    public baseRotateMatrix: Array<Array<number>>;

    public lastTrans: transType;
    protected constructor() {
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
        this.rotateMatrix = mat4();
        this.baseRotateMatrix = mat4();

        this.lastTrans = transType.none;
    }

    /**
     *
     * @param delta 旋转角度,角度
     * @param related 旋转是否相对于上次绘制
     * @param axisType 旋转轴：1--X；2--Y；3--Z,4---自身横轴;5----自身方向;0--自身纵轴;6--下坠形式 ; 7----绕X轴；8----绕Y轴；0----绕Z轴
     * @param changeAxis
     */
    public rotate(delta: number, related = true, axisType = 0, changeAxis = true): boolean {

        let currentTrans = [
            transType.rotateMain,
            transType.rotateSelfX,
            transType.rotateSelfY,
            transType.rotateSelfZ,
            transType.rotateSec,
            transType.rotateDir,
            transType.rotateFall,
            transType.rotateX,
            transType.rotateY,
            transType.rotateZ
        ][axisType];
        let ret = false;
        if (related || this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseMatrix = this.modelMatrix;
            this.baseDirection = this.direction;
            this.baseAxisMain = this.axisMain;
            this.baseAxisSec = this.axisSecondary;
            this.basePosition = this.position;
            this.baseRotateMatrix = this.rotateMatrix;
        }
        let transMatrix = translate(...Util.Mat4Vec(mat4(-1), this.basePosition));
        let rotateMatrix = mat4();
        let self = true;
        switch (currentTrans) {
            case transType.rotateFall:
                rotateMatrix = rotate(delta, cross(this.baseDirection, [0, -1, 0]));
                break;
            case transType.rotateDir:
                rotateMatrix = rotate(delta, this.baseDirection);
                break;
            case transType.rotateSec:
                rotateMatrix = rotate(delta, this.baseAxisSec);
                break;
            case transType.rotateMain:
                rotateMatrix = rotate(delta, this.baseAxisMain);
                break;
            case transType.rotateX:
                self = false;
            case transType.rotateSelfX:
                rotateMatrix = rotateX(delta);
                break;
            case transType.rotateY:
                self = false;
            case transType.rotateSelfY:
                rotateMatrix = rotateY(delta);
                break;
            case transType.rotateZ:
                self = false;
            case transType.rotateSelfZ:
                rotateMatrix = rotateZ(delta);
                break;
        }
        transMatrix = mult(rotateMatrix, transMatrix);
        transMatrix = mult(translate(...this.basePosition), transMatrix);

        if(!self){
            transMatrix=rotateMatrix;
        }
        this.rotateMatrix = mult(rotateMatrix, this.baseRotateMatrix);
        this.modelMatrix = mult(transMatrix, this.baseMatrix);
        this.position = Util.Mat4Vec(transMatrix, this.basePosition);
        if (changeAxis) {
            this.direction = Util.Mat4Vec(rotateMatrix, this.baseDirection);
            this.axisMain = Util.Mat4Vec(rotateMatrix, this.baseAxisMain);
            this.axisSecondary = Util.Mat4Vec(rotateMatrix, this.baseAxisSec);
        }
        this.lastTrans = currentTrans;
        return ret;
    }
    /**
     *
     * @param distance 距离
     * @param direction 0：主方向；1：x轴方向；2：y轴方向；3：z轴方向 ;4:副轴方向
     * @param related 平移是否相对于上次绘制
     */
    public translate(distance: number, direction: number, related = true) {
        let x_dis, y_dis, z_dis;
        let currentTrans = [
            transType.translateMain,
            transType.translateX,
            transType.translateY,
            transType.translateZ,
            transType.translateSecondary][direction];
        let ret = false;
        if (related || this.lastTrans !== currentTrans && this.lastTrans !== transType.none) {
            ret = true;
            this.baseDirection = this.direction;
            this.baseMatrix = this.modelMatrix;
            this.baseAxisMain = this.axisMain;
            this.baseAxisSec = this.axisSecondary;
            this.basePosition = this.position;
        }
        switch (currentTrans) {
            case transType.translateSecondary:
                let eachStepSecondary = distance / Math.sqrt(
                    this.axisSecondary[0] * this.axisSecondary[0]
                    + this.axisSecondary[1] * this.axisSecondary[1]
                    + this.axisSecondary[2] * this.axisSecondary[2])
                x_dis = eachStepSecondary * this.axisSecondary[0];
                y_dis = eachStepSecondary * this.axisSecondary[1];
                z_dis = eachStepSecondary * this.axisSecondary[2];
                break;
            case transType.translateMain:
                let eachStepMain = distance / Math.sqrt(
                    this.direction[0] * this.direction[0]
                    + this.direction[1] * this.direction[1]
                    + this.direction[2] * this.direction[2])
                x_dis = eachStepMain * this.direction[0];
                y_dis = eachStepMain * this.direction[1];
                z_dis = eachStepMain * this.direction[2];
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