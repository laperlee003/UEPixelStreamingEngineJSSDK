import wsSocket from "./websocket"
import webRtc from "./webrtc"
/**
 * 通过设定信令服务地址和进度条对象
 * 获得一个Promise对象
 * 在then方法中获取webrtc对象
 */
export default (sws,progress)=>{
    return new Promise((resolve,reject)=>{
        progress.to(10);
        let rtc = new webRtc();
        rtc.setDataChannelOpenHandel(e=>{
            progress.to(90);
            console.log("data channel open success");
            resolve(rtc);
        })
        rtc.setDataChannelCloseHandel(e=>{
            console.log("data channel close");
        })
        let socket = new wsSocket();
        socket.setMessageError(message=>{
            progress.error(message);
            reject(message);
        })
        socket.setMessageConfig(async msg=>{
            progress.to(20);
            let config = msg.peerConnectionOptions
            //If this is true in Chrome 89+ SDP is sent that is incompatible with UE WebRTC and breaks.
            config.offerExtmapAllowMixed = false;
            config.sdpSemantics = 'unified-plan'
            let offer = await rtc.init(config);
            socket.send(offer)
        })
        //设置发送ice数据事件
        rtc.setIceCandidateHandel(candidate=>{
            socket.send({
                type: 'iceCandidate',
                candidate: candidate,
            })
        })
        //设置websocket获取sdp answer处理事件
        socket.setMessageAnswer(answer=>{
            progress.to(50);
            rtc.setAnswer(answer);
        })
        //设置websocket获取ice处理事件
        socket.setMessageIceCandidate(msg=>{
            rtc.setIceCandidate(msg.candidate);
        })
        rtc.setSpeedHandel(speed=>{
            socket.send({
                type: 'speed',
                speed: speed,
            })
        })
        try {
            socket.setHost(sws).run();
        } catch (error) {
            reject("信令服务连接失败")
            return ;
        }
    });
}