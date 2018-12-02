var _gl = new GL();
_gl.butterfly.draw(_gl);
_gl.insect.draw(_gl, false);

var vm = new Vue({
    el: '#app',
    data() {
        return {
            glOb: _gl,
            attrib: {
                angleMain: 0,
                angleSec: 0,
                distMain: 0
            },
            zoom: 1,
            animeHandle: null
        }
    },
    watch: {
        'attrib.angleMain': function(val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.rotate(val, false, 0)) {
                this.clearOthers('angleMain');
            }
            this.draw();
        },
        'attrib.angleSec': function(val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.rotate(val, false, 4)) {
                this.clearOthers('angleSec');
            }
            this.draw();
        },
        'attrib.distMain': function(val) {
            if (val === 0)
                return;
            if (this.glOb.butterfly.translate(val, 0, false)) {
                this.clearOthers('distMain');
            }
            this.draw();
        },
        'zoom': function(val) {
            this.glOb.butterfly.zoom(val, false);
            this.draw();
        }

    },
    methods: {
        play() {
            let x = this.glOb;
            let then = performance.now() * 0.001;

            function _draw(now) {
                debugger
                now *= 0.001;
                const delta = (now - then) * 25;
                x.butterfly.rotate(delta, true, 1);
                x.butterfly.draw(x);
                x.insect.draw(x, false);

                then = now
                vm.animeHandle = requestAnimationFrame(_draw);
            }
            this.animeHandle = requestAnimationFrame(_draw);
        },
        stop() {
            cancelAnimationFrame(this.animeHandle);
            this.animeHandle = null;
        },
        draw() {
            this.glOb.butterfly.draw(this.glOb);
            this.glOb.insect.draw(this.glOb, false);
        },
        clearOthers(name) {
            for (let each in this.attrib) {
                if (each !== name) {
                    this.attrib[each] = 0;
                }
            }
        }
    }
})

var vm1 = new Vue({
    el: '#app1',
    data() {
        return {
            glOb: _gl,
            attrib: {
                angleMain: 0,
                angleSec: 0,
                distMain: 0
            },
            zoom: 1,
            animeHandle: null
        }
    },
    watch: {
        'attrib.angleMain': function(val) {
            if (val === 0)
                return;
            if (this.glOb.insect.rotate(val, false, 0)) {
                this.clearOthers('angleMain');
            }
            this.draw();
        },
        'attrib.angleSec': function(val) {
            if (val === 0)
                return;
            if (this.glOb.insect.rotate(val, false, 4)) {
                this.clearOthers('angleSec');
            }
            this.draw();
        },
        'attrib.distMain': function(val) {
            if (val === 0)
                return;
            if (this.glOb.insect.translate(val, 0, false)) {
                this.clearOthers('distMain');
            }
            this.draw();
        },
        'zoom': function(val) {
            this.glOb.insect.zoom(val, false);
            this.draw();
        }

    },
    methods: {
        play() {
            let x = this.glOb;
            let then = performance.now() * 0.001;

            function _draw(now) {
                debugger
                now *= 0.001;
                const delta = (now - then) * 25;
                x.insect.rotate(delta, true, 1);
                x.insect.draw(x);
                x.butterfly.draw(x, false);

                then = now
                vm1.animeHandle = requestAnimationFrame(_draw);
            }
            this.animeHandle = requestAnimationFrame(_draw);
        },
        stop() {
            cancelAnimationFrame(this.animeHandle);
            this.animeHandle = null;
        },
        draw() {
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb, false);
        },
        clearOthers(name) {
            for (let each in this.attrib) {
                if (each !== name) {
                    this.attrib[each] = 0;
                }
            }
        }
    }
})

let vm2 = new Vue({
    el: '#camera',
    data() {
        return {
            glOb: _gl,
            theta: 0,
            phi: 0,
            radius: 4,
            animeHandle: null
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
            this.glOb.view(this.radius, this.theta, this.phi);
            this.glOb.insect.draw(this.glOb);
            this.glOb.butterfly.draw(this.glOb, false);

        },
        play() {
            let then=performance.now()*0.03;
            function _draw(now) {
                now *= 0.03;
                _gl.view(vm2.radius, now-then, vm2.phi);
                _gl.insect.draw(_gl);
                _gl.butterfly.draw(_gl, false);
                vm2.animeHandle = requestAnimationFrame(_draw);
            }
            this.animeHandle = requestAnimationFrame(_draw);
        },
        stop() {
            cancelAnimationFrame(this.animeHandle);
            this.animeHandle = null;
        }
    }
})