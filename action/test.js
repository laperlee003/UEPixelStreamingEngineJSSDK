import base from "./base";
import messageType from "./messageType";

class test extends base{
    messageType = messageType.UIInteraction;
    callback=true;
    
    $action="test";
    $data={name:"laperlee"}
}

class create extends base{
    messageType = messageType.UIInteraction;
    constructor(ClassName,DisplayName,Reference,MouseX,MouseY){
        super();
        this.data=this.serialize({"ServerSendObject":{
            "DataType":"Create",
            "ClassName":ClassName,
            "DisplayName":DisplayName,
            "MouseX":MouseX,
            "MouseY":MouseY,
            "DataObject":{
                "Reference":Reference
            }
        }})
    }
}

class save extends base{
    messageType = messageType.UIInteraction;
    data = this.serialize({"ServerSendObject":{"DataType":"SaveGame"}});
}

class load extends base{
    messageType = messageType.UIInteraction;
    data = this.serialize({"ServerSendObject":{"DataType":"LoadGame"}});
}
export default {
    test:test,
    save:save,
    load:load,
    create:create
}