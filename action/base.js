function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
import callback from "./../callback";
export default class base {
    messageType;
    $data;

    get buffer(){
        if(!this.data){
            this.data=this.getData();
        }
        return this.data.buffer;
    }
    
    // 事件操作方法 （参数：事件类型，描述符）
    getData() {
        let descriptor={
            action:this.$action,
            data:this.$data,
            message:this.callback ? this.setMessage() : null
        }
        return this.serialize(descriptor);
    }

    serialize(descriptor){
        // 将描述符对象转换为JSON字符串。
        let descriptorAsString = JSON.stringify(descriptor)

        // 将UTF-16 JSON字符串添加到数组字节缓冲区，每次两个字节。
        let data = new DataView(new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length))
        let byteIdx = 0
        data.setUint8(byteIdx, this.messageType)
        byteIdx++
        data.setUint16(byteIdx, descriptorAsString.length, true)
        byteIdx += 2
        for (let i = 0; i < descriptorAsString.length; i++) {
            data.setUint16(byteIdx, descriptorAsString.charCodeAt(i), true)
            byteIdx += 2
        }
        return data;
    }


    setMessage(){
        let message = randomString(32);
        this.promise = new Promise((resolve,reject)=>{
            callback.setFunction(message,(response)=>{
                resolve(response);
            });
        })
        return message;
    }

    
}

