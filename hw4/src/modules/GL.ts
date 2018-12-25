import { flatten } from './MV'
import Drawable from './interface/Drawable';
import Camera from './models/Camera';
import { Light } from './scene/Light';
import Collisible from './interface/Collisible';
import { Util } from './Util';

export default class GL {
    public gl: WebGLRenderingContext;
    public programInfo: any;

    public objects: Array<Drawable>;
    public collisions:Collisible[];
    public cameras: Array<Camera>;
    public lights: Array<Light>;

    public currentCamera: Camera;
    public currentLight: Light;

    public ready:number;
    constructor() {
        let canvas = document.getElementById("gl-canvas");
        this.gl = WebGLUtils.setupWebGL(canvas);
        if (!this.gl) { alert("WebGL isn't available"); }
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        let shaderPro = initShaders(this.gl, "vertex-shader", "fragment-shader");
        this.programInfo = {
            program: shaderPro,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderPro, 'vPosition'),
                vertexNormal: this.gl.getAttribLocation(shaderPro, 'vNormal'),
                texcoordLocation:this.gl.getAttribLocation(shaderPro,'a_texcoord')
            },
            uniformLocations: {
                modelViewMatrix: this.gl.getUniformLocation(shaderPro, 'uModelMatrix'),
                cameraMatrixLoc: this.gl.getUniformLocation(shaderPro, 'uCameraMatrix'),
                projectionMatrixLoc: this.gl.getUniformLocation(shaderPro, 'uProjectionMatrix'),
                normalMatrixLoc: this.gl.getUniformLocation(shaderPro, 'uNormalMatrix'),

                ambientVectorLoc: this.gl.getUniformLocation(shaderPro, 'ambientProduct'),
                diffuseVectorLoc: this.gl.getUniformLocation(shaderPro, 'diffuseProduct'),
                specularVectorLoc: this.gl.getUniformLocation(shaderPro, 'specularProduct'),
                lightVectorLoc: this.gl.getUniformLocation(shaderPro, 'lightPosition'),
                shininessLoc: this.gl.getUniformLocation(shaderPro, 'shininess'),

                bTexCoordLocation:this.gl.getUniformLocation(shaderPro,'bTexCoord'),
                textureLocation:this.gl.getUniformLocation(shaderPro,'u_texture'),
                texture1Location:this.gl.getUniformLocation(shaderPro,'u_texture1'),
                texture2Location:this.gl.getUniformLocation(shaderPro,'u_texture2'),
                texture3Location:this.gl.getUniformLocation(shaderPro,'u_texture3')
            },
        };
        this.gl.useProgram(this.programInfo.program);

        this.objects = [];
        this.lights = [];
        this.cameras = [];
        this.collisions=[];
        this.ready=0;

        //加载纹理图片
        let p1="../../../image/grass.jpg";
        let p2="../../../image/starspace-2.png";
        let p3="../../../image/vn.jpg";
        let p4="../../../image/globe.jpg";
        this.initTexture(this.programInfo.uniformLocations.textureLocation,p1,0);
        this.initTexture(this.programInfo.uniformLocations.texture1Location,p2,1);
        this.initTexture(this.programInfo.uniformLocations.texture2Location,p3,2);
        this.initTexture(this.programInfo.uniformLocations.texture3Location,p4,3);
    }
    public addObjects(...obs: Array<Drawable>) {
        for (let i of obs) {
            this.objects.push(i);
            i.initBuffer(this);
        }
    }
    public addCollisible(...obs:Collisible[]){
        this.collisions.push(...obs);
    }
    public addCameras(...obs: Array<Camera>) {
        for (let i of obs) {
            this.cameras.push(i);
        }
    }
    public switchCamera(camera: Camera) {
        this.currentCamera = camera;
    }
    public addLights(...obs: Array<Light>) {
        for (let i of obs) {
            this.addObjects(i);
            this.lights.push(i);
        }
    }
    public switchLight(light: Light) {
        this.currentLight = light;
    }

    public drawScene() {
        if (this.objects.length <= 0)
            throw '场景内没有物体';
        else if (this.cameras.length <= 0 || !this.currentCamera) {
            throw '未指定摄像机';
        }
        else if (this.lights.length <= 0 || !this.currentLight) {
            throw '未指定光源';
        } {
            this.resize();
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clearDepth(1.0);

            this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.cameraMatrixLoc, false, flatten(this.currentCamera.cameraMatrix));
            this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrixLoc, false, flatten(this.currentCamera.projectionMatrix));

            this.gl.uniform4fv(this.programInfo.uniformLocations.lightVectorLoc, new Float32Array(this.currentLight.position));


            for (let i of this.objects) {
                i.draw(this, true);
            }
        }
    }
    public impactChecking(target:Collisible):boolean{
        if(this.collisions.indexOf(target)<0){
            throw '无法检测到此对象';
        }
        let ret=false;
        for(let i of this.collisions){
            if(i===target){
                continue
            }
            else if(target.collision.ifCollide(i.collision)){
                ret=true;
                break;
            }
        }
        return ret;
    }
    private resize() {
        var displayWidth = this.gl.canvas.clientWidth;
        var displayHeight = this.gl.canvas.clientHeight;
        let val=Math.min(displayWidth,displayHeight)
        if (this.gl.canvas.width != val ||
            this.gl.canvas.height != val) {
            this.gl.canvas.width = val;
            this.gl.canvas.height = val;
        }
        this.gl.canvas.style.height=this.gl.canvas.style.width=`${val}px`;
        this.gl.viewport(0, 0, val, val);
    }

    public initTexture(location:any,path:any,num:number){
        let self=this;
        let gl = this.gl;
        var texture0 = gl.createTexture();     
        //gl.activeTexture(gl.TEXTURE0);      //激活0号理单元
        var image = new Image();
        image.src = path;
        image.addEventListener('load', function () {
            if(num == 0){
                gl.activeTexture(gl.TEXTURE0);
            }else if(num == 1){
                gl.activeTexture(gl.TEXTURE1);
            }else if(num == 2){
                gl.activeTexture(gl.TEXTURE2);
            }else if(num == 3){
                gl.activeTexture(gl.TEXTURE3);
            }         
            gl.bindTexture(gl.TEXTURE_2D, texture0);  //创建纹理对象
             //对纹理图像进行y轴反转
             gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, Number(true));
             //配置纹理图像
             gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
             if(Util.isPowerOf2(image.width)&&Util.isPowerOf2(image.height)){
             gl.generateMipmap( gl.TEXTURE_2D );
            }else{
            //配置纹理参数
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
            //将纹理传递给着色器
            gl.uniform1i(location, num);
            self.ready++;
        });
    }

    public initTexture1(){
        let gl=this.gl;
        var texture = gl.createTexture();//创建纹理对象
        var texture1 = gl.createTexture();
        if(!texture || !texture1){
            console.log("无法创建纹理对象");
            return;
        }
           let ch1=false;
            let ch2=false;
         function loadTexture(gl:any,texture:any,location:any,image:any,num:number){
            
            gl.bindTexture(gl.TEXTURE_2D, texture);  //创建纹理对象
                 //对纹理图像进行y轴反转
                 gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, Number(true));
                 //配置纹理图像
                 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                 gl.generateMipmap( gl.TEXTURE_2D );
                //配置纹理参数
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                if(num == 0){
                    gl.activeTexture(gl.TEXTURE0);
                    ch1=true;
                }else if(num == 1){
                    gl.activeTexture(gl.TEXTURE1);
                    ch2=true;
                }
                //将纹理传递给着色器
                gl.uniform1i(location, num);
    
                if(ch1&&ch2){
                    gl.clearColor(0.0,0.0,0.0,1.0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                }
        }

        //获取u_Sampler的存储位置
        var u_Sampler = this.programInfo.uniformLocations.textureLocation;
        var u_Sampler1 = this.programInfo.uniformLocations.texture1Location;
        if(u_Sampler < 0 || u_Sampler1 < 0){
            console.log("无法获取变量的存储位置");
            return;
        }
        //创建Image对象，并绑定加载完成事件
        let p="../../../image/texImageBackGround.jpg";
        let p2="../../../image/SA2011_black.gif";
        var image = new Image();
        image.src=p;
        var image1 = new Image();
        image1.src=p2;
        image.onload = function () {
            loadTexture(gl,texture,u_Sampler,image,0);
        };
        image1.onload = function () {
            loadTexture(gl,texture1,u_Sampler1,image1,1);
        };
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
