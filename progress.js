'use strict';
export default class progress{
    running=false;
    _over=false;
    element;
    _progress=0;
    stop=0;
    step=1;
    van;
    top;
    left;
    constructor(element){
      this.element=element;
      if(this.element.getContext){
        this.van = this.element.getContext("2d");
        this.top = Math.ceil(this.element.height/2);
        this.left = Math.ceil(this.element.width/2);
      }
    }
    init(){
      this._over=false;
      this._progress=0;
    }
    to(stop){
      return new Promise((resole,reject)=>{
        this.stop=(this._progress>stop) ? this._progress : stop;
        if(this.running==false){
          this.draw().then(()=>{
            resole()
          });
        }else{
          resole();
        }
      })
    }
    over(){
      return new Promise((resole,reject)=>{
        this.step=Math.ceil((100 - this._progress)/3);
        this.to(100).then(async ()=>{
          await this.sleep(100);
          this._over=true;
          resole();
        });
        ;
      })
    }
    error(message){
      this._over=true;
      this.text(message);
    }
    draw(){
      return new Promise(async (resole,reject)=>{
        console.log("draw");
        this.running=true;
        this._progress+=this.step;
        if(this._progress<=this.stop){
          this.do();
          await this.sleep(10);
          await this.draw();
          resole();
        }else{
          this.running=false;
          resole()
        }
      })
    }
    sleep(ms){
      return new Promise((resole,reject)=>{
        setTimeout(()=>{
          resole();
        },ms);
      })
    }
    text(text){
      this.van.fillStyle="#fff";
      this.van.shadowColor="#f9d6ff"
      this.van.shadowBlur = 0;
      this.van.font="normal 12px '微软雅黑'";
      this.van.fillText(text,this.left-50,this.top-40);
    }
  
    do(){
      if(this._over){
        return ;
      }
      this.van.clearRect(0,0,this.element.width,this.element.height);
      this.van.fillStyle="#262446";
      this.van.fillRect(0,0,this.element.width,this.element.height);
  
      this.progressBg();
      this.progressLine();
    }
    progressBg(){
      let width = 10;
      this.van.shadowBlur = 0;
      // this.van.fillStyle="#1f1c39";
      this.van.fillStyle="#262446";
      this.van.beginPath();
      this.van.arc(this.left-500,this.top,width/2,0.5*Math.PI,1.5*Math.PI);
      this.van.arc(this.left+500,this.top,width/2,-0.5*Math.PI,0.5*Math.PI);
      this.van.closePath();
      this.van.fill();
    }
    progressLine(){
      let width = 10;
      this.van.beginPath();
      this.van.fillStyle="#fff";
      this.van.shadowColor="#a8cff3"
      this.van.shadowBlur = 30;
      this.van.arc(this.left-500,this.top,width/2,0.5*Math.PI,1.5*Math.PI);
      this.van.arc(this.left-500+(this._progress*10),this.top,width/2,-0.5*Math.PI,0.5*Math.PI);
      this.van.fill();

      this.setLineBrighten(1,"#ffffff")
      this.setLineBrighten(2,"#dbf5ff")
      this.setLineBrighten(4,"#b7eaff")
      this.setLineBrighten(8,"#8addff")
      this.setLineBrighten(16,"#6cd4ff")
      this.setLineBrighten(32,"#3cc6ff")
      this.van.closePath();
    }

    setLineBrighten(shadowBlur,color){
      let width=10;
      this.van.shadowColor=color
      this.van.shadowBlur = shadowBlur;
      this.van.arc(this.left-500,this.top,width/2,0.5*Math.PI,1.5*Math.PI);
      this.van.arc(this.left-500+(this._progress*10),this.top,width/2,-0.5*Math.PI,0.5*Math.PI);
      this.van.fill();
    }
  }
  