import { mat4, mult, vec3, lookAt, perspective, rotate, rotateX, rotateY, rotateZ, translate, vec4 } from '../MV';
import { Util } from '../Util';
import { ButterFly } from './Butterfly';
import { Translatable } from '../interface/Translatable';

export enum transType {
    none,
    rotateObX, rotateObY, rotateObZ,
    rotateMain, rotateSec, rotateDir,
    translateX, translateY, translateZ, translateMain,
    zoom
}

export default class Camera {
    public projectionMatrix: any;
    public cameraMatrix: any;

    public observeObject: Translatable;
    public baseEye: any;
    public nowEye: any;
    public at: any;
    public up: any;

    constructor() {
        this.baseEye = vec4();
        this.nowEye = vec3();
        //this.at = vec3(0, 0, 0);
        //this.up = vec3(0, 1, 0);
        const far = 1000, near = 0.1, aspect = 1, fovy = 60;
        this.projectionMatrix = perspective(fovy, aspect, near, far);

    }
    public view(radius, theta, phi) {

        this.at = vec3(0.0, 0, 0.0);
        this.up = vec3(0.0, 1.0, 0.0);
        if (phi > 90 || phi < -90)
            this.up = vec3(0.0, -1.0, 0.0);
        let eye = vec3(radius * Math.sin(Util.radians(theta)) * Math.cos(Util.radians(phi)),
            radius * Math.sin(Util.radians(phi)),
            radius * Math.cos(Util.radians(theta)) * Math.cos(Util.radians(phi)));

        this.cameraMatrix = lookAt(eye, this.at, this.up);
    }

    public bind(ob: Translatable) {
        this.observeObject = ob;
        this.baseEye=vec4(ob.position[0],-ob.position[1]+5,ob.position[2]-5,1);
        this.at=vec3(ob.position[0],ob.position[1],ob.position[2]);
    }

    public translateC(): boolean {
        if (!this.observeObject)
            throw '摄像机未绑定对象'
        let ret = false;
        this.at=vec3(this.observeObject.position[0],this.observeObject.position[1],this.observeObject.position[2]);
        this.up=vec3(this.observeObject.direction[0],this.observeObject.direction[1],this.observeObject.direction[2]);
        let tempVec = Util.Mat4Vec(this.observeObject.modelMatrix, this.baseEye);
        this.nowEye = vec3(tempVec[0], tempVec[1], tempVec[2]);
        this.cameraMatrix = lookAt(this.nowEye, this.at, this.up);

        return ret;
    }
}