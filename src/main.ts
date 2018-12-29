import Vue from 'vue/dist/vue.js'
import GL from './modules/GL';
import Camera from './modules/models/Camera';
import { ButterFly } from './modules/models/Butterfly';
import { Ground } from './modules/models/Ground';
import { House } from './modules/models/House';
import { Ellipsoid } from './modules/models/Basis/Ellipsoid';
import { Church } from './modules/models/Church';
import { MetalMaterial } from './modules/materials/MetalMaterial';
import { GroundMaterial } from './modules/materials/GroundMaterial';
import { Sun } from './modules/scene/Sun';
import { Sky } from './modules/models/Sky';
import { Translatable } from './modules/interface/Translatable';
import Void from './modules/models/Void';
import { Tri_prism } from './modules/models/Basis/Tri_prism';
import { Rect_pyramid } from './modules/models/Basis/Rect_pyramid';
import { Moon } from './modules/scene/Moon';
alert(`使用提示:
开始游戏：p  视角切换：b  视角锁定：f
向上运动：space  左：←  右：→
用鼠标选中界面并拖动即可切换视角，滑动滚轮即可放大和缩小
未绑定视角时可以使用w,a,s,d移动视野中心
如果你已了解，那么请开始吧！💪`);

let but = new ButterFly; but.translate(-15, 1); but.translate(5, 2); but.rotate(180, true, 5); but.rotate(90, true, 4);
let ball = new Ellipsoid(30, 50, [0, 0, 0], '0xfffff'); ball.setMaterial(new MetalMaterial); ball.translate(150, 2);
let ground = new Ground([0, 0, 0], 500); ground.setMaterial(new GroundMaterial);
// let church =new Rect_pyramid(1.5, 1.2, [ - 1-2,  5.9999, + 1+2],null); church.setMaterial(new MetalMaterial);
//let house = new House([0, -20, 0]); house.setMaterial(new MetalMaterial);
let VoidObj = new Void; VoidObj.rotate(-90, true, 4);VoidObj.translate(-10, 1); VoidObj.translate(2, 2); VoidObj.translate(-2, 3);
let s=new Sun,m=new Moon;
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
    }
    x = -105
}

//初始相机初始化
let camera = new Camera;
let [radius, theta, phi] = [10, 0, 45]
camera.view(radius, theta, phi);
camera.bind(VoidObj);


//场景对象添加
let stateButterFly = {
    butt: but,
    height: 10,
    speedX: 5,
    speedY: 0,
    get speed(): number {
        return Math.sqrt(this.speedX ** 2 + this.speedY ** 2)
    }
}
let vue = new Vue({
    el: '#app',
    mounted() {
        //构造画布
        var _gl = new GL;
        camera.setCanvas(_gl.gl.canvas);
        _gl.addCameras(camera);
        _gl.switchCamera(camera);
        //光源ball,church,groundchurch, househouse,,church, church
        _gl.addLights(s,m);
        _gl.switchLight(s);
        _gl.addObjects(but,...building, ground, sky );
        _gl.addCollisible(but,...building , ground);
        _gl.addShaded(but,...building);
        this.glOb = _gl;
        this.bound = VoidObj;
        this.play();
    },
    data() {
        return {
            camera: camera,
            glOb: null,

            theta: theta,
            phi: phi,
            radius: radius,
            move: false,
            fixed: false,
            bound: null,

            frames:0
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
                    let pastTime=now-start;
                    //计算帧数
                    self.frames=Math.floor(1/lastTime);

                    //翅膀扇动
                    let relatedDegree = (lastTime * (flap + 2)) * flap * 50;
                    let nextDegree=Math.abs((degree + relatedDegree+90)%180-90);
                    if ( nextDegree> range / 2) {
                        relatedDegree *= -1;
                        flap *= -1;
                    }
                    but.flap(relatedDegree);
                    degree += relatedDegree;

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
                    let riseSpeed=pastTime * 5
                    for(let u of gl.lights){
                        u.rotate(riseSpeed, false, 7);
                    }
                    sky.sunset(riseSpeed/10);

                    //阴影设置
                    if (gl.lights[0].position[1] <= 1) {
                        gl.switchLight(m);
                        sky.setChoice(5);
                        for (let i of gl.shaded) {
                            //i.clearShaded();
                        }
                    } else {
                        gl.switchLight(s);
                        sky.setChoice(3);
                        for (let i of gl.shaded) {
                            i.setShaded();
                        }
                    }
                    //碰撞检测
                    if (gl.impactChecking(but)) {
                        alert("你可爱的小蝴蝶🦋撞到了建筑物，请刷新界面重新开始吧！\n(如果点击刷新页面没有反应，再点一下确定就可以啦！）\n如果有什么问题，可以向我们提出😁\n联系方式：QQ:2466526388");
                        window.location.reload();
                        self.move ? self.switchState() : true;
                        return;
                    }
                    gl.drawScene();

                }else{
                    start=now;
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
            if (this.bound === VoidObj) {
                return;
            }
            this.fixed = !this.fixed;
        },
        switchBound() {
            if (this.bound !== VoidObj) {
                this.camera.bind(VoidObj);
                this.bound=VoidObj;
            } else {
                this.camera.bind(but);
                this.bound=but;
            }
        }
    }
})
let mousedown = false,touched=false,touchNum=0;
let lastTouch={
    screenX:[],
    screenY:[]
}
let ele = document.getElementById('gl-canvas');
if (ele) {
    ele.ontouchstart=(e)=>{
        //e.preventDefault();
        touched=true;
        touchNum=e.touches.length;
        for(let i=0;i<e.touches.length;i++){
            lastTouch.screenX[i]=e.touches[i].screenX;
            lastTouch.screenY[i]=e.touches[i].screenY;
        }
    }
    ele.ontouchmove=function(e){
        if(touchNum==2){
            let touch1=e.touches[0],touch2=e.touches[1];
            e.preventDefault();
            let movementX = [touch1.screenX - lastTouch.screenX[0],touch2.screenX - lastTouch.screenX[1]],
                movementY = [touch1.screenY - lastTouch.screenY[0],touch2.screenY - lastTouch.screenY[1]];

            if(movementX[0]*movementX[1]>0&&movementY[0]*movementY[1]>0){
                let movX=(movementX[0]+movementX[1])/2,movY=(movementY[0]+movementY[1])/2;
                vue.theta = ((vue.theta) + (movX) * -0.3) % 360;
                if (movY >= 0 || vue.phi > 0) {
                    vue.phi = ((vue.phi) + (movY) * 0.3) % 360;
                }
            } else {
                let relativeDist = Math.sqrt(Math.pow(touch1.screenX - touch2.screenX, 2) + Math.pow(touch1.screenY - touch2.screenY, 2)) -
                    Math.sqrt(Math.pow(lastTouch.screenX[0] - lastTouch.screenX[1], 2) + Math.pow(lastTouch.screenY[0] - lastTouch.screenY[1], 2))
                if (vue.bound && vue.fixed) {
                    return;
                }
                let temp = 0;
                if (5 < vue.radius && vue.radius < 50) {
                    temp = (vue.radius) - relativeDist / 10;
                } else if (vue.radius <= 5) {
                    temp = (vue.radius) - relativeDist / 100;
                } else {
                    temp = (vue.radius) - relativeDist;
                }
                if (temp <= 0)
                    return;
                vue.radius = temp;
            }
        }
        for(let i=0;i<e.touches.length;i++){
            lastTouch.screenX[i]=(e.touches[i].screenX);
            lastTouch.screenY[i]=(e.touches[i].screenY);
        }

    }
    ele.ontouchend=(e)=>{
        //e.preventDefault();
        touched=false;
        touchNum=0;
        lastTouch={
            screenX:[],
            screenY:[]
        }
    }
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
        if(vue.bound&&vue.fixed){
            return;
        }
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
                if(vue.move)
                    stateButterFly.speedY += but.fly(stateButterFly.speedX);
                break;
            case 37://←
                if(vue.move)
                    but.rotate(-5, true, 5);
                break;
            case 39://→
                if(vue.move)
                    but.rotate(5, true, 5);
                break;
            case 104:
                vue.glOb.currentLight.translate(8, 2);
                break;
            case 98:
                vue.glOb.currentLight.translate(-8, 2);
            break;
            case 100:
                vue.glOb.currentLight.translate(-8, 1);
            break;
            case 102:
                vue.glOb.currentLight.translate(8, 1);
                break;
            case 103:
                vue.glOb.currentLight.translate(8, 3);
                break;
            case 105:
                vue.glOb.currentLight.translate(-8, 3);
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
