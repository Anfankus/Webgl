export interface Material{
  materialAmbient: Array<number>; //环境光亮度
  materialDiffuse: Array<number>; //反射光亮度
  materialSpecular: Array<number>;//镜面反射光亮度rgba,反射光高亮部分
    materialShininess:number;
}