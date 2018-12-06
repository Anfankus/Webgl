import Vue from 'vue/dist/vue.js'
import GL from './modules/GL';
import Camera from './modules/models/Camera';
import { ButterFly } from './modules/models/Butterfly';
import { Ground } from './modules/models/Ground';

var _gl = new GL;
let but=new ButterFly;
but.translate(50,2);
but.rotate(90,true,4);
_gl.addObjects(new Ground([0,-2,0],50),but);
let stateButterFly={
    height:10,
    speed:0
}
_gl.drawScene();
let camera = new Vue({
    el: '#camera',
    data() {
        return {
            camera:_gl.cameras[0],
            glOb: _gl,
            theta: 0,
            phi: 0,
            radius: 75,
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
            let then = performance.now() * 0.03,start=then;
            let range=30*2;
            let degree=0,flap=1;

            let c=this.camera;
            function _draw(now: number) {
                now *= 0.03;
                let relatedDegree=((now - then)*(flap+2))*flap*1.8;
                if(Math.abs(degree+relatedDegree)>range/2){
                    relatedDegree*=-1;
                    flap*=-1;
                }
                but.flap(relatedDegree);
                but.fall(now-then);

                let speed=Math.sqrt(0.01**2+((now-start)*9.8/500)**2)
                but.moveForward(speed)

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

camera.play();
let mousedown = false;
let ele = window;
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
    ele.onwheel = function (e) {
        let temp = (camera.radius) + e.deltaY / 350;
        if (temp <= 0 || temp > 10)
            return;
        camera.radius = temp;
    }
    ele.onkeydown=function(e){
        console.log(e.keyCode);
        switch(e.keyCode){
            case 37:
            but.rotate(5,true,0)
            break;
            case 38:
            but.translate(0.3,0)
            break;
            case 39:
            but.rotate(-5,true,0)
            break;
            case 40:
            but.translate(-0.3,0)
            break;
        }
    };
    ele.onkeypress=e=>{
        console.log('press',e.key,e.keyCode);
    }
}
console.log(but.position,but.direction,but.axisMain,but.axisSecondary);
console.log(but.LeftWing.position,but.LeftWing.direction,but.LeftWing.axisMain,but.LeftWing.axisSecondary);
