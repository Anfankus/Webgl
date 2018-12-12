import Vue from 'vue/dist/vue.js'
import GL from './modules/GL';
import Camera from './modules/models/Camera';
import { ButterFly } from './modules/models/Butterfly';
import { Ground } from './modules/models/Ground';
import { House } from './modules/models/House';

var _gl = new GL;
let but=new ButterFly;
but.translate(10,2);
but.rotate(90, true, 4);
_gl.addObjects(new Ground([0,-10,0],50),new House([0,-2,0]),but);
let stateButterFly={
    butt:but,
    height:10,
    speedX:5,
    speedY:0,
    get speed() : number {
        return Math.sqrt(this.speedX**2+this.speedY**2)
    },
    turn:{
        state:0,             //0为可变状态
        $degree:0,
        set degree(val){
            if(!this.state){

            }
        }
    }
}
let camera = new Vue({
    el: '#camera',
    data() {
        return {
            camera:_gl.cameras[0],
            glOb: _gl,
            theta: 0,
            phi: 0,
            radius: 50,
            animeHandle: 0
        }
    },
    watch: {
        theta() {
            this.change();
        },
        phi() {
            this.change();
        },
        radius() {
            this.change();
        }
    },
    methods: {
        change() {
            this.camera.view(this.radius, this.theta, this.phi);
            this.glOb.drawScene();
        },
        play() {
            let then = performance.now() * 0.001,start=then;
            let range=45*2;
            let degree=0,flap=1;

            let c=this.camera;
            function _draw(now: number) {
                now *= 0.001;
                let lastTime=now-then;
                //翅膀扇动
                let relatedDegree=(lastTime*(flap+2))*flap*50;
                if(Math.abs(degree+relatedDegree)>range/2){
                    relatedDegree*=-1;
                    flap*=-1;
                }
                but.flap(relatedDegree);

                //随时间加速
                stateButterFly.speedX+=lastTime*3;
                //蝴蝶下坠
                stateButterFly.speedY+=but.fall(lastTime,stateButterFly.speedX);
                but.moveForward(stateButterFly.speed*lastTime)

                _gl.drawScene();
                then=now;
                degree+=relatedDegree;
                camera.animeHandle = requestAnimationFrame(_draw);
            }
            this.animeHandle = requestAnimationFrame(_draw);
        },
        stop() {
            cancelAnimationFrame(this.animeHandle);
            this.animeHandle = 0;
        }
    }
})
but.rotate(-30, true, 4);
//camera.play();
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
        if (mousedown) {
            camera.theta = ((camera.theta) + (e.movementX) * -0.8) % 360;
            camera.phi = ((camera.phi) + (e.movementY) * 0.8) % 360;
        }
    }
    window.onwheel = function (e) {
        let temp = (camera.radius) + e.deltaY / 350;
        if (temp <= 0 || temp > 10)
            return;
        camera.radius = temp;
    }
    window.onkeydown=function(e){
        console.log(e.keyCode);
        switch(e.keyCode){
            case 32://空格
            stateButterFly.speedY+=but.fly(stateButterFly.speedX);
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
    };
}
_gl.drawScene();
