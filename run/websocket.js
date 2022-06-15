
const WebSocket = window.WebSocket || window.MozWebSocket


export default class wsocket{
    
    setHost(host){
        this.host=host;
        return this;
    }
    //配置消息
    setMessageConfig(fn){
        this.messageConfigHandel = fn;
    }
    //sdp answer消息
    setMessageAnswer(fn){
        this.messageAnswerHandel = fn;
    }
    setMessageIceCandidate(fn){
        this.messageIceCandidateHandel = fn;
    }
    setMessageError(fn){
        this.messageErrorHandel=fn;
    }
    message(msg){
        switch (msg.type) {
            case 'config':
                this.messageConfigHandel(msg);
            break
            case 'answer':
                this.messageAnswerHandel(msg);
            break
            case 'iceCandidate':
                this.messageIceCandidateHandel(msg);
            break
            case "error":
                this.messageErrorHandel(msg.message);
            break;
        }
    }
    run(){
        this.ws = new WebSocket(this.host)
        this.ws.onopen = ()=>{
            this.send({
                type: 'ready',
            })
            this.timeInvate = setInterval(() => {
                this.send({
                    type: 'ping',
                })
            }, 50000)
        }
        
        this.ws.onmessage = (event) => {
            var msg = JSON.parse(event.data)
            this.message(msg);
        }
        
        this.ws.onclose = (event) => {
            if (this.timeInvate) {
                clearInterval(this.timeInvate)
            }
        }
    }
    send(data){
        if(this.ws){
            this.ws.send(JSON.stringify(data));
        }
        
    }
}
