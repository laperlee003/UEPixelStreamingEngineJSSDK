# UEPixelStreamingEngineJSSDK
UE Pixel Streaming Engine JSSDK
虚幻引擎像素流插件 JSSDK

## 信令服务
#### 开源地址
- xxxxx


## 渲染主机管理端
#### 开源地址
- https://github.com/laperlee003/UEPixelStreamingEngineMaster

## 调用示例
```
import engine from "UEPixelStreamingEngine";
engine.run("wx://127.0.0.1:8888","canvas").then(result=>{
     let rtc=result.rtc;
     result.msg.responseHandel=(response)=>{
          console.log("收到response消息",response);
     }
     rtc.send(new engine.action.test.test()).then(()=>{
          console.log("操作响应信息")
     });
}).catch(msg=>{
     console.error(msg);
});
```

## Development Specification
## 开发规范
基于webrtc通讯的消息传输规范定义
web端向ue4端发送UIInteraction消息的时候
以如下标准消息规范发送
```
{
     action:"动作",
     data: #动作协定数据格式#, 可以是object、null、string
     message:"random"        随机生成的32位字符串消息编号
}
```

## Unreal Engine Development Specification 
## 虚幻引擎开发规范

收到 UIInteraction消息的时候
首先解析该消息的action动作
并根据动作获取data数据执行具体交互流程
在执行完成以后如果存在message字段，则需要返回一个Response消息给web端
并将message带回 格式为JSON字符串
```
{
    action:"callback",
    data:#返回的数据信息#,       可以是object、null、string
    message:"消息编号"
}
```
