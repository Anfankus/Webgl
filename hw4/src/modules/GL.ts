import {flatten} from './MV'
import Drawable from './interface/Drawable';
import Camera from './models/Camera';
import { Light } from './scene/Light';

export default class GL {
    public gl: WebGLRenderingContext;
    public programInfo: any;

    public objects: Array<Drawable>;
    public cameras: Array<Camera>;
    public lights:Array<Light>;

    public currentCamera:Camera;
    public currentLight:Light;

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
                vertexNormal:this.gl.getAttribLocation(shaderPro,'vNormal')
            },
            uniformLocations: {
                modelViewMatrix: this.gl.getUniformLocation(shaderPro, 'uModelMatrix'),
                cameraMatrixLoc: this.gl.getUniformLocation(shaderPro, 'uCameraMatrix'),
                projectionMatrixLoc: this.gl.getUniformLocation(shaderPro, 'uProjectionMatrix'),
                normalMatrixLoc:this.gl.getUniformLocation(shaderPro,'uNormalMatrix'),

                ambientVectorLoc:this.gl.getUniformLocation(shaderPro,'ambientProduct'),
                diffuseVectorLoc:this.gl.getUniformLocation(shaderPro,'diffuseProduct'),
                specularVectorLoc:this.gl.getUniformLocation(shaderPro,'specularProduct'),
                lightVectorLoc:this.gl.getUniformLocation(shaderPro,'lightPosition'),
                eyeVectorLoc:this.gl.getUniformLocation(shaderPro,'eyePosition'),
                shininessLoc:this.gl.getUniformLocation(shaderPro,'shininess')
            },
        };
        this.gl.useProgram(this.programInfo.program);

        this.objects=[];
        this.lights=[];
        this.cameras=[];
        /**
         * 测试用例
         */
        let l=new Light;
        this.currentLight=l;
        this.lights.push(l);
    }
    public addObjects(...obs: Array<Drawable>) {
        for (let i of obs) {
            this.objects.push(i);
            i.initBuffer(this);
        }
    }
    public addCameras(...obs: Array<Camera>) {
        for (let i of obs) {
            this.cameras.push(i);
        }
    }
    public switchCamera(camera:Camera){
        this.currentCamera=camera;
    }

    public drawScene() {
        if (this.objects.length <= 0)
            throw '场景内没有物体';
        else if(this.cameras.length<=0||!this.currentCamera){
            throw '未指定摄像机';
        }
        else {
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clearDepth(1.0);

            this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.cameraMatrixLoc, false, flatten(this.currentCamera.cameraMatrix));
            this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrixLoc, false, flatten(this.currentCamera.projectionMatrix));

            this.gl.uniform4fv(this.programInfo.uniformLocations.lightVectorLoc, new Float32Array(this.currentLight.lightPosition));


            for (let i of this.objects) {
              i.draw(this, true);
            }
        }
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
