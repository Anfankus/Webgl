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
import { GroundMaterial } from './modules/materials/GroundMaterial';
import { Light } from './modules/scene/Light';
import { Sky } from './modules/models/Sky';
import { Translatable } from './modules/interface/Translatable';
import Void from './modules/models/Void';

//
alert(' 使用提示：\n 开始游戏：p  视角切换：b  视角锁定：f \n 向上运动：space  左：←  右：→\n 用鼠标选中界面并拖动即可切换视角，滑动滚轮即可放大和缩小\n 未绑定视角时可以使用w,a,s,d移动视野中心\n 如果你已了解，那么请开始吧！💪');

let but = new ButterFly; but.translate(-10, 1); but.translate(5, 2); but.translate(-2, 3); but.rotate(180, true, 5); but.rotate(90, true, 4);
let ball = new Ellipsoid(30, 50, [0, 0, 0], '0xfffff'); ball.setMaterial(new MetalMaterial); ball.translate(150, 2);
let ground = new Ground([0, 0, 0], 500); ground.setMaterial(new GroundMaterial);
//let church = new Church([10, -20, 0]); church.setMaterial(new MetalMaterial);
//let house = new House([0, -20, 0]); house.setMaterial(new MetalMaterial);
let VoidObj = new Void; VoidObj.rotate(-90, true, 4);
let sky = new Sky;
let x = -105;
let z = -105;
let temp:any
let building=[];
for(;z <= 89;z = z+35){
    for(;x <= 80;){
        let num = Math.floor(Math.random()*10+1);
      
        if(num <=7){//house 22.5
            temp = new House()
            temp.zoom(2.5);temp.translate(x+2.5,1);temp.translate(z-2.5,3);
            let r = Math.floor(Math.random()*4+1);
            if(r == 1){
                temp.rotate(90,true,2);//temp.translate(z+22.5,3);
            }
            else if(r == 2){
                temp.rotate(180,true,2);//temp.translate(x+22.5,1);temp.translate(z+18,3)
            }
            else if(r == 3){
                temp.rotate(270,true,2);//temp.translate(x+18,1);
            }
            building.push(temp)
            x = x+35
        }
        else{//church 15
            temp = new Church()
            temp.zoom(2.5);temp.translate(x+2.5,1);temp.translate(z-2,3)
            building.push(temp)
            x = x+35
        }
    }
    x = -105
}

//初始相机初始化
let camera1 = new Camera;
let [radius, theta, phi] = [10, 0, 45]
camera1.view(radius, theta, phi);
camera1.bind(VoidObj);


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
let vue = new Vue({
    el: '#camera',
    mounted() {
        //构造画布
        var _gl = new GL;
        camera1.setCanvas(_gl.gl.canvas);
        _gl.addCameras(camera1);
        _gl.switchCamera(camera1);
        //光源ball,church,groundchurch, househouse, church
        let l = new Light;
        _gl.addLights(l);
        _gl.switchLight(l);
        _gl.addObjects(but,...building , ground, sky);
        _gl.addCollisible(but,...building , ground);
        _gl.addShaded(but);
        this.glOb = _gl;
        this.bound = VoidObj;
        this.play();
    },
    data() {
        return {
            camera: camera1,
            glOb: null,
            theta: theta,
            phi: phi,
            radius: radius,
            move: false,
            fixed: false,
            bound: null
        }
    },
    watch: {
        theta(val) {
            this.theta = parseFloat(val);
            this.change();
        },
        phi(val) {
            this.phi = parseFloat(val);
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
            let self = this;
            let then = performance.now() * 0.001, start = then;
            let range = 45 * 2;
            let degree = 0, flap = 1;
            let gl = this.glOb;

            let c = this.camera;
            function _draw(now: number) {
                now *= 0.001;

                if (gl.ready >= 4) {
                    let lastTime = now - then;
                    //翅膀扇动
                    let relatedDegree = (lastTime * (flap + 2)) * flap * 50;
                    let n=Math.abs((degree + relatedDegree+90)%180-90)
                    if (n> range / 2) {
                        relatedDegree *= -1;
                        flap *= -1;
                    }
                    but.flap(relatedDegree);

                    //蝴蝶下坠并前进
                    if (vue.move) {
                        stateButterFly.speedY += but.fall(lastTime, stateButterFly.speedX);
                        but.moveForward(stateButterFly.speed * lastTime)
                    }
                    if (vue.bound && vue.fixed) {
                        c.translateC();
                    }
                    else
                        c.view(vue.radius, vue.theta, vue.phi);

                    //太阳运动
                    gl.currentLight.rotate(lastTime * 10, true, 7);
                    sky.sunset(now - start);

                    //阴影设置
                    if (gl.currentLight.position[1] <= 0) {
                        for (let i of gl.shaded) {
                            i.clearShaded();
                        }
                    } else {
                        for (let i of gl.shaded) {
                            i.setShaded();
                        }
                    }
                    //碰撞检测
                    if (gl.impactChecking(but)) {
                        prompt("你可爱的小蝴蝶🦋撞到了建筑物，请刷新界面重新开始吧！\n(如果点击刷新页面没有反应，再点一下确定就可以啦！）\n如果有什么问题，可以向我们提出😁\n联系方式：QQ:2466526388");
                        window.location.reload();
                        self.move ? self.switchState() : true;                      
                    }             
                    degree += relatedDegree;
                    gl.drawScene();

                }
                then = now;

                requestAnimationFrame(_draw);
            }
            requestAnimationFrame(_draw);
        },
        switchState() {
            this.move = !this.move;
        },
        switchFixed() {
            this.fixed = !this.fixed;
        },
        switchBound() {
            if (this.bound !== VoidObj) {
                this.camera.bind(VoidObj);
            } else {
                this.camera.bind(but);
            }
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
        if (mousedown && (!vue.fixed)) {
            vue.theta = ((vue.theta) + (e.movementX) * -0.8) % 360;
            if (e.movementY >= 0 || vue.phi > 0) {
                vue.phi = ((vue.phi) + (e.movementY) * 0.8) % 360;
            }
        }
    }
    window.onwheel = function (e) {
        let temp = 0;
        if (5 < vue.radius && vue.radius < 50) {
            temp = (vue.radius) + e.deltaY / 50;
        } else if (vue.radius <= 5) {
            temp = (vue.radius) + e.deltaY / 500;
        } else {
            temp = (vue.radius) + e.deltaY / 5;
        }
        if (temp <= 0)
            return;
        vue.radius = temp;
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
                VoidObj.translate(2, 0);
                break;
            case 's':
                VoidObj.translate(-2, 0);
                break;
            case 'a':
                VoidObj.translate(-2, 4);
                break;
            case 'd':
                VoidObj.translate(2, 4);
                break;
            case 'p':
                vue.switchState();
                break;
            case 'b':
                vue.switchBound();
                break;
            case 'f':
                vue.switchFixed()

        }
    };
}
