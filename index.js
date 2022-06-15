'use strict';
import run from "./run";        //引擎运行程序
import action from "./action";        //引擎动作
import message from "./message";        //引擎消息
import videoCanvas from "./canvas";
import progress from "./progress";

/**
 * @function run 
 * @param sws<String> 信令服务地址
 * @param elementId<String> 渲染结果容器id
 * @return Promise then {rtc,msg} catch msg<String>
 * @remark
 * rtc为webrtc对象(非原生webrtc对象 是经过封装的webrtc对象即run/webrtc.js该文件下的封装)
 * msg为消息对象 可以定义各种消息收到时候的动作 具体参考./message.js
 * 
 * @function action
 * 交互指令封装对象 该封装的目录位于action目录下
 * 
 * @example
 * import engine from "UEPixelStreamingEngine";
 * engine.run("wx://127.0.0.1:8888","canvas").then(result=>{
 *      let rtc=result.rtc;
 *      result.msg.responseHandel=(response)=>{
 *          console.log("收到response消息",response);
 *      }
 *      rtc.send(new engine.action.test.test()).then(()=>{
 *          console.log("存档加载成功")
 *      });
 * }).catch(msg=>{
 *      console.error(msg);
 * });
 */
export default {
    run:(sws,elementId)=>{
        return new Promise((resolve,reject)=>{
            // let sws="wss://engine.xscitydo.com/sws/player/"+token;
            // let sws="ws://120.26.78.108:11052/";
            let runBox = document.getElementById(elementId)
            if (!runBox) {
                reject("容器不存在");
                return ;
            }
            let canvasElement = document.createElement("canvas");
    
            canvasElement.width=runBox.clientWidth;
            canvasElement.height=runBox.clientHeight;
            runBox.append(canvasElement);
            let pro = new progress(canvasElement);
            run(sws,pro).then(rtc=>{
                let canvas = new videoCanvas();
                canvas.init(canvasElement);
                canvas.mouseDownHandel=(button,coord)=>{
                    rtc.send(new action.mouse.down(button,coord));
                };
                canvas.mouseMoveHandel=(coord,delta)=>{
                    rtc.send(new action.mouse.move(coord,delta));
                };
                canvas.mouseEnterHandel=()=>{
                    rtc.send(new action.mouse.enter());
                };
                canvas.mouseLeaveHandel=()=>{
                    rtc.send(new action.mouse.leave());
                };
                canvas.mouseUpHandel=(button,coord)=>{
                    rtc.send(new action.mouse.up(button,coord));
                };
                canvas.mouseWheelHandel=(coord,delta)=>{
                    rtc.send(new action.mouse.wheel(coord,delta));
                };
                canvas.mousePressHandel=(buttons,coord)=>{
                    if(buttons){
                        rtc.send(new action.mouse.down(0,coord));
                        rtc.send(new action.mouse.down(1,coord));
                        rtc.send(new action.mouse.down(2,coord));
                        rtc.send(new action.mouse.down(3,coord));
                        rtc.send(new action.mouse.down(4,coord));
                    }
                    
                };
                canvas.mouseReleaseHandel=(buttons,coord)=>{
                    if(buttons){
                        rtc.send(new action.mouse.up(0,coord));
                        rtc.send(new action.mouse.up(1,coord));
                        rtc.send(new action.mouse.up(2,coord));
                        rtc.send(new action.mouse.up(3,coord));
                        rtc.send(new action.mouse.up(4,coord));
                    }
                };
                canvas.keyboardDownHandel=(e)=>{
                    rtc.send(new action.keyboard.down(e));
                };
                canvas.keyboardUpHandel=(e)=>{
                    rtc.send(new action.keyboard.up(e));
                };
                canvas.keyboardPressHandel=(e)=>{
                    rtc.send(new action.keyboard.press(e));
                };
                rtc.setStreamHandel(stream=>{
                    console.log("have streaming")
                    pro.over();
                    canvas.play(stream);
                    let msg = new message();
                    rtc.message(msg);
                    resolve({rtc,msg});
                });
                
            }).catch(msg=>{
                reject(msg);
            });
        });

    },
    action
}