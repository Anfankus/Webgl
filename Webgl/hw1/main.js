//作者  71116414张可
//      71116411 李嘉兴
//      71116432 唐寅凯

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    //程序对象生成和连接
    var vertices_circle = Circle([0.0,0.0,  1,0.8559,0.73843,0.0],0.07,0.3,40,360,0xff0000);
    var vertices_circle_2 = Circle([0.0,0.0,  0,0.0,0.0,1.0],0.07,0.3,40,360);
    var vertices_wingcircle_left1 = Circle([0.375,-0.4583, 0.0,0.0,0.0,1.0],0.02,0.02,40,360);
    var vertices_wingcircle_left2 = Circle([0.4583,-0.375, 0.0,0.0,0.0,1.0],0.02,0.02,40,360);
    var vertices_wingcircle_left3 = Circle([0.45,0.45, 0.0,0.0,0.0,1.0],0.05,0.05,40,360);
    var vertices_wingcircle_right1 = Circle([-0.375,-0.4583, 0.0,0.0,0.0,1.0],0.02,0.02,40,360);
    var vertices_wingcircle_right2 = Circle([-0.4583,-0.375, 0.0,0.0,0.0,1.0],0.02,0.02,40,360);
    var vertices_wingcircle_right3 = Circle([-0.45,0.45, 0.0,0.0,0.0,1.0],0.05,0.05,40,360);
    var vertices_wing=Wing([0.0,0.0 ,0,0,0.0,1.0],0.9,2,100,360);
    var vertices_wing_2=Wing([0.0,0.0 ,0,0.98039,0.60392,1.0],0.85,2,32,360,0x1e90ff);
    var vertices_wing_3=Wing([0.0,0.0 ,0.49804,1,0,1.0],0.5,2,200,360,0x1e90ff);
    var vertices_wing_4=Wing([0.0,0.0 ,0,0,0,1.0],0.5,2,200,360);
    var line_1=Circle([-0.3,0.3,0,0,0.0,1.0],0.3,0.4,40,80);
    var line_2=Circle([ 0.3,0.3,0,0,0.0,1.0],0.3,0.4,40,80,100);
    var bodycircle = Circle([0.0,0.0,  0.0,0.0,0.0,1.0],0.07,0.02,40,180,180);
    var bodycircle_2 = Circle([0.0,0.05,  0.0,0.0,0.0,1.0],0.065,0.02,40,180,180);
    var bodycircle_3 = Circle([0.0,-0.05,  0.0,0.0,0.0,1.0],0.065,0.02,40,180,180);
    var bodycircle_4 = Circle([0.0,0.1,  0.0,0.0,0.0,1.0],0.062,0.018,40,180,180);
    var bodycircle_5 = Circle([0.0,-0.1,  0.0,0.0,0.0,1.0],0.062,0.018,40,180,180);
    var bodycircle_6 = Circle([0.0,0.15,  0.0,0.0,0.0,1.0],0.060,0.017,40,180,180);
    var bodycircle_7 = Circle([0.0,-0.15,  0.0,0.0,0.0,1.0],0.060,0.017,40,180,180);
    var bodycircle_8 = Circle([0.0,-0.2,  0.0,0.0,0.0,1.0],0.055,0.017,40,180,180);
    var bodycircle_9 = Circle([0.0,-0.25,  0.0,0.0,0.0,1.0],0.05,0.017,40,180,180);
    var lefteye = Circle([0.045,0.2,  0.0,0.0,0.0,1.0],0.015,0.023,40,360);
    var righteye = Circle([-0.045,0.2,  0.0,0.0,0.0,1.0],0.015,0.023,40,360);



    //创建缓冲区
    var bufferId = gl.createBuffer();
    //将缓冲区绑定到对象
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    //向缓冲区写入数据
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(vertices_wing), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 6*4, 0 );
    gl.enableVertexAttribArray( vPosition );

    let vColor=gl.getAttribLocation(program,'vColor');
    gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,6*4,2*4);
    gl.enableVertexAttribArray(vColor);
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    
    //wing
    gl.drawArrays( gl.TRIANGLE_FAN,0,vertices_wing.length/6);
    
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(vertices_wing_2), gl.STATIC_DRAW );
    gl.drawArrays( gl.TRIANGLE_FAN,0,vertices_wing_2.length/6);
    
    //line on the right wing
    let line_vertive_left1=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.6,0.6, 0,0.0,0.0  ,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left1),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left2=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.43,0.645, 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left2),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left3=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.23,0.55 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left3),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left4=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.645,0.43 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left4),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left5=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.55,0.23 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left5),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left6=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.5,-0.5, 0,0.0,0.0  ,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left6),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left7=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.358,-0.5375, 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left7),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left8=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.1916,-0.4583 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left8),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left9=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.5375,-0.358 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left9),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_left10=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        0.4583,-0.1916 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_left10),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    

    //line on the right wing
    let line_vertive_right1=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.5,-0.5, 0,0.0,0.0  ,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right1),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_right2=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.358,-0.5375, 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right2),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);

    let line_vertive_right3=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.1916,-0.4583 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right3),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_right4=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.5375,-0.358 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right4),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_right5=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.4583,-0.1916 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right5),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_right6=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.6,0.6, 0,0.0,0.0  ,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right6),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_right7=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.43,0.645, 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right7),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);

    let line_vertive_right8=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.23,0.55 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right8),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_right9=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.645,0.43 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right9),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);
    let line_vertive_right10=[
        0.0,0.0, 0.0,0,0.0,1.0    ,
        -0.55,0.23 , 0,0.0,0.0,1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(line_vertive_right10),gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES,0,2);

    //wings
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(vertices_wing_3), gl.STATIC_DRAW );
    gl.drawArrays( gl.TRIANGLE_FAN,0,vertices_wing_3.length/6);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(vertices_wing_4), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINE_LOOP,1,vertices_wing_4.length/6-1);

    //circle
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(vertices_circle), gl.STATIC_DRAW );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices_circle.length/6);   
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(vertices_circle_2), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINE_LOOP, 1, vertices_circle_2.length/6-1);

    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(line_1), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINES,1,line_1.length/6-1);

    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(line_2), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINES,1,line_2.length/6-1);

    //circle on the left wing
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices_wingcircle_left1),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices_circle.length/6);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices_wingcircle_left2),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices_circle.length/6)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices_wingcircle_left3),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices_circle.length/6)

    //circle on the right wing
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices_wingcircle_right1),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices_circle.length/6);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices_wingcircle_right2),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices_circle.length/6)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices_wingcircle_right3),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices_circle.length/6)

    //line on the body
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINES,1,bodycircle.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_2), gl.STATIC_DRAW );
    //gl.drawArrays( gl.LINES,1,bodycircle_2.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_3), gl.STATIC_DRAW );
    //gl.drawArrays( gl.LINES,1,bodycircle_3.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_4), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINES,1,bodycircle_4.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_5), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINES,1,bodycircle_5.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_6), gl.STATIC_DRAW );
    //gl.drawArrays( gl.LINES,1,bodycircle_6.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_7), gl.STATIC_DRAW );
    //gl.drawArrays( gl.LINES,1,bodycircle_7.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_8), gl.STATIC_DRAW );
    gl.drawArrays( gl.LINES,1,bodycircle_8.length/6-1);
    gl.bufferData( gl.ARRAY_BUFFER,new Float32Array(bodycircle_9), gl.STATIC_DRAW );
    //gl.drawArrays( gl.LINES,1,bodycircle_9.length/6-1);

    //eye
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lefteye),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, lefteye.length/6)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(righteye),gl.STATIC_DRAW);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, righteye.length/6)
    
};

/*@para center:vec2 a,b:int/float count:int

*/ 
function Hex2Vec4(hex){
    let ret=[hex>>16,(hex&0x00FF00)>>8,hex&0x0000FF,0xFFFFFF];
    return ret.map(x=>x/0xFF);
}

//画圆的函数，参数：center：是一个数组，前两个元素是圆心的横纵坐标，后四个是颜色
//                 a,b:椭圆的长轴和短轴的长度
//                 fradCount:细分数，尽量大就行100以上
//                 degree:画的圆的度数
//                 offset:度数的偏移量，从几度开始画圆
function Circle(center,a,b,fragCount,degree,offset=0,edgeColor=null){
    let radian=degree/180*Math.PI;
    let eachDegree=radian/fragCount;
    let vertices=[].concat(center);

    let offset_radian=offset/180*Math.PI;
    let staticColor=edgeColor!=null?Hex2Vec4(edgeColor):center.slice(2);
    for(let i=0;i<=radian;i+=eachDegree){
        vertices.push(center[0]+Math.cos(i+offset_radian)*a,center[1]+Math.sin(i+offset_radian)*b);
        //vertices=vertices.concat(Hex2Vec4((startColor+i*360*colorStep)%0xFFFFFF));
        vertices=vertices.concat(staticColor);
        //vertices=vertices.concat(center.slice(2));
    }
    return vertices;
}
function Wing(center,size,wingCount,fragCount,degree=360,edgeColor=null){
    let radian=degree/180*Math.PI;
    let eachDegree=radian/fragCount;
    let vertices=[].concat(center);

    //let color=Hex2Vec4(colorStart);
    let staticColor=edgeColor?Hex2Vec4(edgeColor):center.slice(2);
    for(let i=0;i<=radian;i+=eachDegree){
        let length=size*Math.sin(wingCount*i);
        if(i>radian/2)
        length*=0.85;
        vertices.push(center[0]+Math.sin(i)*length,center[1]+Math.cos(i)*length);
        vertices=vertices.concat(staticColor);
    }
    return vertices;
}