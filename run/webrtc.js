export default class Webrtc{
    stream;
    //设置ice处理函数
    setIceCandidateHandel(fn){
        this.iceCandidateHandel=fn;
        return this;
    }
    //设置媒体流处理函数
    setStreamHandel(fn){
        this.streamHandel=fn;
        this.streamHandel(this.stream);
        return this;
    }
    //设置数据通道打开处理函数
    setDataChannelOpenHandel(fn){
        this.dataChannelOpenHandel =fn;
        return this;
    }
    //设置数据通道关闭处理函数
    setDataChannelCloseHandel(fn){
        this.dataChannelCloseHandel =fn;
        return this;
    }
    //設置速率事件動作
    setSpeedHandel(fn){
        this.speedHandel=fn;
        return this;
    }

    //发送动作
    send(action){
        if(this.dcClient && this.dcClient.readyState == 'open'){
            this.dcClient.send(action.buffer);
            if(action.promise){
                return action.promise;
            }
        }
        return this;
    }
    message(message){
        this.dataChannelMessageHandel = ((type,response)=>{
            message.handel(type,response);
        });
        return this;
    }
    

    async init(config){
        let _this = this;
        this.pc = new RTCPeerConnection(config);
        this.pc.addEventListener('icecandidate', (e) => {
            if (e.candidate && e.candidate.candidate) {
                if(_this.iceCandidateHandel){
                    _this.iceCandidateHandel(e.candidate);
                }
            }
        })
        this.pc.addEventListener('track', (e) => {
            if(e.receiver.track.kind=="video"){
                _this.stream=e.streams[0];
                if(_this.streamHandel){
                    _this.streamHandel(_this.stream);
                }
            }
        })
        
        this.dcClient = this.pc.createDataChannel('cirrus', { ordered: true })
        this.dcClient.onopen = function (e) {
            _this.dataChannelOpenHandel(e);
        }
        
        this.dcClient.onclose = function (e) {
            _this.dataChannelCloseHandel(e);
        }
        
        this.dcClient.onmessage = function (e) {
            let data = e.data
            var view = new Uint8Array(data)
            let response = new TextDecoder('utf-16').decode(data.slice(1));
            if(_this.dataChannelMessageHandel){
                _this.dataChannelMessageHandel(view[0],response);
            }
            if(view[0]==5){
                _this.speedHandel(response);
            }
        }
        let offer = await this.getOffer();
        return offer;
    }

    async getOffer() {
        let offer = await this.pc.createOffer({
            offerToReceiveAudio: 1, // 1开启  0关闭
            offerToReceiveVideo: 1,
            voiceActivityDetection: false
        })
        //设置压缩率和立体声
        offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1;stereo=1;sprop-maxcapturerate=48000');
        
        // offer.sdp = offer.sdp.replace(/(a=extmap-allow-mixed)\r\n/gm, "");
        await this.pc.setLocalDescription(offer)
        return offer
    }
    setAnswer(answer){
        var answerDesc = new RTCSessionDescription(answer)
        this.pc.setRemoteDescription(answerDesc)
    }
    setIceCandidate(candidate){
        let rtcCandidate = new RTCIceCandidate(candidate)
        this.pc.addIceCandidate(rtcCandidate).then((_) => {
            console.log('ICE candidate successfully added')
        })
    }

}