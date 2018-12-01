var _gl=new GL();
_gl.butterfly.draw(_gl);
_gl.insect.draw(_gl,false);

var vm = new Vue({
    el: '#app',
    data() {
        return {
            glOb: _gl,
            angleX: 0,
            angleY: 0,
            angleZ: 0,
            angleMain:0,
            distX: 0,
            distY: 0,
            distZ: 0,
            distMain: 0,
            zoom:1,
            animeHandle: null
        }
    },
    watch: {
        angleX: function (val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.rotate(val, false, 1)) {
                this.angleMain=this.angleY = this.angleZ = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        angleY: function (val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.rotate(val, false, 2)) {
                this.angleMain=this.angleX = this.angleZ = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        angleZ: function (val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.rotate(val, false, 3)) {
                this.angleMain=this.angleY = this.angleX = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        angleMain:function(val){
            if (val === 0)
                return;
            if (this.glOb.butterfly.rotate(val, false, 0)) {
                this.angleX=this.angleY = this.angleZ = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        distMain: function (val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.translate(val, 0,false)) {
                this.distX = this.distY = this.distZ = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        distX: function (val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.translate(val, 1,false)) {
                this.distMain = this.distY = this.distZ = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        distY: function (val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.translate(val, 2,false)) {
                this.distX = this.distMain = this.distZ = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        distZ: function (val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.translate(val, 3,false)) {
                this.distX = this.distY = this.distMain = 0;
            }
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        },
        zoom:function(val){
            this.glOb.butterfly.zoom(val,false);
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb,false);
        }

    }
})

var vm1 = new Vue({
    el: '#app1',
    data() {
        return {
            glOb: _gl,
            angleX: 0,
            angleY: 0,
            angleZ: 0,
            angleMain:0,
            distX: 0,
            distY: 0,
            distZ: 0,
            distMain: 0,
            zoom:1,
            animeHandle: null
        }
    },
    watch: {
        angleX: function (val) {
            if (val === 0)
                return;
            if (this.glOb.insect.rotate(val, false, 1)) {
                this.angleMain=this.angleY = this.angleZ = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        angleY: function (val) {
            if (val === 0)
                return;
            if (this.glOb.insect.rotate(val, false, 2)) {
                this.angleMain=this.angleX = this.angleZ = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        angleZ: function (val) {
            if (val === 0)
                return;
            if (this.glOb.insect.rotate(val, false, 3)) {
                this.angleMain=this.angleY = this.angleX = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        angleMain:function(val){
            if (val === 0)
                return;
            if (this.glOb.insect.rotate(val, false, 0)) {
                this.angleX=this.angleY = this.angleZ = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        distMain: function (val) {
            if (val === 0)
                return;
            if (this.glOb.insect.translate(val, 0,false)) {
                this.distX = this.distY = this.distZ = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        distX: function (val) {
            if (val === 0)
                return;
            if (this.glOb.insect.translate(val, 1,false)) {
                this.distMain = this.distY = this.distZ = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        distY: function (val) {
            if (val === 0)
                return;
            if (this.glOb.insect.translate(val, 2,false)) {
                this.distX = this.distMain = this.distZ = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        distZ: function (val) {
            if (val === 0)
                return;
            if (this.glOb.insect.translate(val, 3,false)) {
                this.distX = this.distY = this.distMain = 0;
            }
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        },
        zoom:function(val){
            this.glOb.insect.zoom(val,false);
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);
        }

    }
})

new Vue({
    el:'#camera',
    data(){
        return{
            glOb:_gl,
            theta:0,
            phi:0,
            radius:4
        }
    },
    watch:{
        theta(){
            this.change();
        },
        phi(){
            this.change();
        },
        radius(){
            this.change();
        }
    },
    methods:{
        change(){
            this.glOb.view(this.radius,this.theta,this.phi);
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb,false);

        }
    }
})

