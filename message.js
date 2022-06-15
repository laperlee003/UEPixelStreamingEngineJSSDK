
const ToClientMessageType = {
    QualityControlOwnership: 0,
    Response: 1,
    Command: 2,
    FreezeFrame: 3,
    UnfreezeFrame: 4,
    VideoEncoderAvgQP: 5,
}

import callback from "./callback";
export default class Message {
    handel(type,response){
        switch(type){
            case ToClientMessageType.QualityControlOwnership:
                this.qualityControlOwnershipHandel(response);
                break;
            case ToClientMessageType.Response:
                response=JSON.parse(response);
                if(response.message){
                    callback.runFunction(response.message,response);
                }
                this.responseHandel(response);
                break;
            case ToClientMessageType.Command:
                this.commandHandel(response);
                break;
            case ToClientMessageType.FreezeFrame:
                this.freezeFrameHandel(response);
                break;
            case ToClientMessageType.UnfreezeFrame:
                this.unfreezeFrameHandel(response);
                break;
            case ToClientMessageType.VideoEncoderAvgQP:
                this.videoEncoderAvgQPHandel(response);
                break;
        }
    }

    qualityControlOwnershipHandel(response){}
    responseHandel(response){}
    commandHandel(response){}
    freezeFrameHandel(response){}
    unfreezeFrameHandel(response){}
    videoEncoderAvgQPHandel(response){}
}