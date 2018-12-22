import Vue from 'vue/dist/vue.js'
import GL from './modules/GL';
import Camera from './modules/models/Camera';
import { ButterFly } from './modules/models/Butterfly';
import { Ground } from './modules/models/Ground';
import { House } from './modules/models/House';
import { Ellipsoid } from './modules/models/Basis/Ellipsoid';
import { rotateY, rotateX, rotateZ } from './modules/MV';
import { Util } from './modules/Util';
import { Church } from './modules/models/Church';
import { NoneMaterial } from './modules/materials/NoneMaterial';
import { MetalMaterial } from './modules/materials/MetalMaterial';
import { CustomizedMaterial } from './modules/materials/CustomizedMaterial';
import { Light } from './modules/scene/Light';
import { Sky } from './modules/models/Sky';
//
let but = new ButterFly;but.translate(-10,1);but.translate(5,2);but.translate(-2,3);but.rotate(90,true,5);but.rotate(90, true, 4);
let ball = new Ellipsoid(30, 50, [0, 0, 0], '0xfffff'); ball.setMaterial(new MetalMaterial);
let ground = new Ground([0, -20, 0], 500); ground.setMaterial(new CustomizedMaterial);
let church=new Church([10, -20, 0]);church.setMaterial(new MetalMaterial);
let house=new House([0, -20, 0]);house.setMaterial(new MetalMaterial);
let sky=new Sky;

//初始相机初始化
let camera1 = new Camera;
let [radius, theta, phi] = [10, 0, 45]
camera1.view(radius, theta, phi);


//场景对象添加
let stateButterFly = {
    butt: but,
    height: 10,
    speedX: 2,
    speedY: 0,
    get speed(): number {
        return Math.sqrt(this.speedX ** 2 + this.speedY ** 2)
    },
    turn: {
        state: 0,
        $degree: 0,
        set degree(val) {
            if (!this.state) {

            }
        }
    }
}
let camera = new Vue({
    el: '#camera',
    mounted(){
        //构造画布
        var _gl = new GL;
        _gl.addCameras(camera1);
        _gl.switchCamera(camera1);
        //光源,groundchurch
        let l = new Light;
        _gl.addLights(l);
        _gl.switchLight(l);
        _gl.addObjects(but,church , house, ground,sky);
        _gl.addCollisible(but,house,church,ground);
        this.glOb=_gl;
        this.play();
    },
    data() {
        return {
            camera: camera1,
            glOb: null,
            theta: theta,
            phi: phi,
            radius: radius,
            move:false,
            fixed:false,
            bound:false
        }
    },
    watch: {
        theta(val) {
            this.theta = parseInt(val);
            this.change();
        },
        phi(val) {
            this.phi = parseInt(val);
            this.change();
        },
        radius(val) {
            this.radius = parseFloat(val);
            this.change();
        }
    },
    methods: {
        change() {
            this.camera.view(this.radius, this.theta, this.phi);
            this.glOb.drawScene();

        },
        play() {
            let self=this;
            let then = performance.now() * 0.001, start = then;
            let range = 45 * 2;
            let degree = 0, flap = 1;
            let gl=this.glOb;

            let c = this.camera;
            function _draw(now: number) {
                now *= 0.001;
                let lastTime = now - then;
                //翅膀扇动
                let relatedDegree = (lastTime * (flap + 2)) * flap * 50;
                if (Math.abs(degree + relatedDegree) > range / 2) {
                    relatedDegree *= -1;
                    flap *= -1;
                }
                but.flap(relatedDegree);

                //蝴蝶下坠并前进
                if(camera.move){
                    stateButterFly.speedY += but.fall(lastTime, stateButterFly.speedX);
                    but.moveForward(stateButterFly.speed * lastTime)
                }
                if (camera.bound&&camera.fixed) {
                        c.translateC();
                }
                else
                    c.view(camera.radius, camera.theta, camera.phi);

                //太阳运动
                gl.currentLight.rotate(lastTime*10,true,7)
                sky.sunset(now*10);

                //碰撞检测
                if(gl.impactChecking(but)){
                    self.move?self.switchState():true;
                }
                gl.drawScene();
                then = now;
                degree += relatedDegree;
                requestAnimationFrame(_draw);
            }
            requestAnimationFrame(_draw);
        },
        switchState() {
            this.move = !this.move;
        },
        switchFixed(){
           this.fixed=!this.fixed;
        },
        switchBound(){
            if(this.bound){
                this.camera.release();
            }else{
                this.camera.bind(but);
            }
            this.bound=!this.bound;
        }
    }
})
let mousedown = false;
let ele = document.getElementById('gl-canvas');
if (ele) {
    ele.onmousedown = function (e) {
        mousedown = true;
    };
    ele.onmouseup = function (e) {
        mousedown = false;
    }
    ele.onmousemove = function (e) {
        if (mousedown && (!camera.binding || !camera.animeHandle)) {
            camera.theta = ((camera.theta) + (e.movementX) * -0.8) % 360;
            camera.phi = ((camera.phi) + (e.movementY) * 0.8) % 360;
        }
    }
    window.onwheel = function (e) {
        let temp = 0;
        if (5 < camera.radius && camera.radius < 50) {
            temp = (camera.radius) + e.deltaY / 50;
        } else if (camera.radius <= 5) {
            temp = (camera.radius) + e.deltaY / 500;
        } else {
            temp = (camera.radius) + e.deltaY / 5;
        }
        if (temp <= 0)
            return;
        camera.radius = temp;
    }
    window.onkeydown = function (e) {
        switch (e.keyCode) {
            case 32://空格
                stateButterFly.speedY += but.fly(stateButterFly.speedX);
                break;
            case 37://←
                but.rotate(-5, true, 5);
                break;
            case 38://↑
                but.translate(0.3, 0);
                break;
            case 39://→
                but.rotate(5, true, 5);
                break;
            case 40://↓
                but.translate(-0.3, 0);
                break;
        }
        switch (e.key) {
            case 'w':
            camera.glOb.currentLight.translate(20, 3);
                break;
            case 's':
            camera.glOb.currentLight.translate(-20, 3);
                break;
            case 'a':
            camera.glOb.currentLight.translate(-20, 1);
                break;
            case 'd':
            camera.glOb.currentLight.translate(20, 1);
                break;
            case 'q':
            camera.glOb.currentLight.translate(-20, 2);
                break;
            case 'e':
            camera.glOb.currentLight.translate(20, 2);
                break;
            case 'p':
            camera.switchState();
            break;
            case 'b':
            camera.switchBound();
            break;
            case 'f':
            camera.switchFixed()

        }
    };
}
