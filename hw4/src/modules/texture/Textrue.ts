import GL from '../GL';

export class Texture {
    public imagepath:any;
    public textureVertic:Array<number>;

    public initTexture(_gl:GL,path:any){
        let gl=_gl.gl;
        var texture0 = gl.createTexture();       //创建纹理对象
        //_gl.gl.activeTexture(_gl.gl.TEXTURE0);      //激活0号理单元
        var image = new Image();
        image.src = path;
        image.addEventListener('load', function() {
            //对纹理图像进行y轴反转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        //开启0号纹理单元
        gl.activeTexture(gl.TEXTURE0);
        //向target绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D,texture0);
        //配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        //将0号纹理传递给着色器
        gl.uniform1i(_gl.programInfo.uniformLocations.textureLocation, 0);
        });
    }


}