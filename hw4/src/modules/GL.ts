import { Util } from './Util'
import { ButterFly } from './models/Butterfly'
import { Insect } from './models/Insect'
import {vec3,lookAt,perspective} from './MV'
import Drawable from './interface/Drawable';
import Viewable from './interface/Viewable';

export default class GL {
    public gl: WebGLRenderingContext;
    public programInfo:any;
    public butterfly: ButterFly;
    public insect: Insect;
    public buffers: any;
    public buffers1: any;

    public objects:Array<Drawable>
    public cameras:Array<Viewable>
    public projectionMatrix: any;
    public cameraMatrix: any;

    constructor() {
        let canvas = document.getElementById("gl-canvas");
        this.gl = WebGLUtils.setupWebGL(canvas);
        if (!this.gl) { alert("WebGL isn't available"); }
        this.gl.viewport(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        let shaderPro = initShaders(this.gl, "vertex-shader", "fragment-shader");
        this.programInfo = {
            program: shaderPro,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderPro, 'vPosition'),
                vertexColor: this.gl.getAttribLocation(shaderPro, 'vColor'),
            },
            uniformLocations: {
                modelViewMatrix: this.gl.getUniformLocation(shaderPro, 'uModelViewMatrix'),
                cameraMatrixLoc: this.gl.getUniformLocation(shaderPro, 'uCameraMatrix'),
                projectionMatrixLoc: this.gl.getUniformLocation(shaderPro, 'uProjectionMatrix'),

            },
        };
        this.buffers = {
            positions: { butterfly: {} },
            colors: { butterfly: {} }
        }
        this.buffers1 = {
            positions: { insect: {} },
            colors: { insect: {} }
        }
        this.gl.useProgram(this.programInfo.program);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);


        this.butterfly = new ButterFly();
        this.butterfly.initBuffer(this);
        this.insect = new Insect();
        this.insect.initBuffer(this);

        this.view(4.0, 2, 0.0);
    }
    public drawScene(){
        if(this.objects.length<=0)
            throw '场景内没有物体';
        else{
            this.objects[0].draw(this,true);
            for(let i of this.objects){
                i.draw(this,false);
            }
        }
    }

    //视图
    public view(radius, theta, phi) {
        const far = 10, near = 0.1, aspect = 1, fovy = 45;

        const at = vec3(0.0, 0.0, 0.0);
        var up = vec3(0.0, 1.0, 0.0);
        if (phi > 90 || phi < -90)
            up = vec3(0.0, -1.0, 0.0);
        let eye = vec3(radius * Math.sin(Util.radians(theta)) * Math.cos(Util.radians(phi)),
            radius * Math.sin(Util.radians(phi)),
            radius * Math.cos(Util.radians(theta)) * Math.cos(Util.radians(phi)));

        this.cameraMatrix = lookAt(eye, at, up);
        this.projectionMatrix = perspective(fovy, aspect, near, far);

    }
}

//=======================================================================================
/////////////////////////////////////////////////////////////////////////////////////////
//=======================================================================================

let WebGLUtils = function () {
    var makeFailHTML = function (msg) {
        return '' +
            '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
            '<td align="center">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<div style="">' + msg + '</div>' +
            '</div>' +
            '</td></tr></table>';
    };
    var GET_A_WEBGL_BROWSER = '' +
        'This page requires a browser that supports WebGL.<br/>' +
        '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

    var OTHER_PROBLEM = '' +
        "It doesn't appear your computer can support WebGL.<br/>" +
        '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

    var setupWebGL = function (canvas, opt_attribs = undefined) {
        function showLink(str) {
            var container = canvas.parentNode;
            if (container) {
                container.innerHTML = makeFailHTML(str);
            }
        };
        if (!WebGLRenderingContext) {
            showLink(GET_A_WEBGL_BROWSER);
            return null;
        }

        var context = create3DContext(canvas, opt_attribs);
        if (!context) {
            showLink(OTHER_PROBLEM);
        }
        return context;
    };

    /**
     * Creates a webgl context.
     * @param {!Canvas} canvas The canvas tag to get context
     *     from. If one is not passed in one will be created.
     * @return {!WebGLContext} The created context.
     */
    var create3DContext = function (canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch (e) { }
            if (context) {
                break;
            }
        }
        return context;
    }

    return {
        create3DContext: create3DContext,
        setupWebGL: setupWebGL
    };
}();
function initShaders(gl, vertexShaderId, fragmentShaderId) {
    var vertShdr;
    var fragShdr;

    var vertElem = document.getElementById(vertexShaderId);
    if (!vertElem) {
        alert("Unable to load vertex shader " + vertexShaderId);
        return -1;
    }
    else {
        vertShdr = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShdr, vertElem.textContent);
        gl.compileShader(vertShdr);
        if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
            var msg = "Vertex shader failed to compile.  The error log is:"
                + "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
            alert(msg);
            return -1;
        }
    }

    var fragElem = document.getElementById(fragmentShaderId);
    if (!fragElem) {
        alert("Unable to load vertex shader " + fragmentShaderId);
        return -1;
    }
    else {
        fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShdr, fragElem.textContent);
        gl.compileShader(fragShdr);
        if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
            var msg = "Fragment shader failed to compile.  The error log is:"
                + "<pre>" + gl.getShaderInfoLog(fragShdr) + "</pre>";
            alert(msg);
            return -1;
        }
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog(program) + "</pre>";
        alert(msg);
        return -1;
    }

    return program;
}
