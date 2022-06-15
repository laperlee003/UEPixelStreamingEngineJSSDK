import base from "./base";
import messageType from "./messageType";

class test extends base{
    messageType = messageType.UIInteraction;
    callback=true;      //当true的时候该对象的发送结果返回的是Promise对象 否则无返回动作
    
    $action="test";
    $data={name:"laperlee"}
}

export default {
    test:test,
}