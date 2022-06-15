'use strict';
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame  
import keyboardConfig from "./keyboard";
export default class videoCanvas {
    constructor() {
      this.isMouseDown=false // 是鼠标按下？
      this.isFocus=false     // 是焦点？ 焦点状态下才可以输入键盘信息
    }
    init(canvasEl) {
      this.fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
      this.fingerIds = {}
      this.canvas = canvasEl
      // 设置好canvas宽高
      this.canvasHeight = canvasEl.clientHeight
      this.canvasWidth = canvasEl.clientWidth
      this.video = document.createElement('video')
      // this.video = document.getElementById('video')
      this.video.playsInline = true
      this.video.muted = true
      this.initCanvas()
    }
    play(stream) {
      this.isPlaying = false
      this.video.srcObject = stream
      let _this = this;
      this.video.addEventListener('loadedmetadata', (e) => {
        _this.setCanvasSize(_this.video.videoWidth, _this.video.videoHeight)
      });
      this.drawCanvas();
    }
    setCanvasSize(videoWidth, videoHeight) {
      let radio = this.canvasWidth/videoWidth;
      this.canvasHeight = radio*videoHeight;
      this.canvas.setAttribute('width', this.canvasWidth)
      this.canvas.setAttribute('height', this.canvasHeight)
    }
    initCanvas() {
        let _this = this
        this.canvas.onfocus = ()=>{
            this.isFocus=true;
        }
        this.canvas.onblur = ()=>{
            this.isFocus=false;
        }
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.setAttribute("style","outline:none")

        this.canvas.onmousedown = (e) => {
            _this.canvas.focus();

            let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
            _this.mouseDownHandel(e.button,coord);

            _this.isMouseDown = e.button
            e.preventDefault()
        }

        this.canvas.onmousemove = (e) => {
            // if (this.isMouseDown===false) return false
            // offsetX 为正  为负  offsetY 为正  为负

            let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
            let delta = _this.normalizeAndQuantizeSigned(e.movementX, e.movementY)
            _this.mouseMoveHandel(coord,delta);

            e.preventDefault()
        }

        this.canvas.onmouseenter = function (e) {

            _this.mouseEnterHandel(e);

            _this.canvas.pressMouseButtons(e);
            e.preventDefault()
        };

        this.canvas.onmouseleave = (e)=>{
            if (_this.isMouseDown!==false){
                _this.mouseLeaveHandel(e);

                _this.canvas.releaseMouseButtons(e);
                _this.isMouseDown = false
            }
            e.preventDefault()
        }

        this.canvas.onmouseup = (e) => {
            let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
            _this.mouseUpHandel(e.button,coord);

            _this.isMouseDown = false
            e.preventDefault()
        }
  
        this.canvas.pressMouseButtons = (e) => {

            let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
            _this.mousePressHandel(e.buttons,coord);

        }
        
        this.canvas.releaseMouseButtons = (e) => {
            let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
            _this.mouseReleaseHandel(e.buttons,coord);
        }


  
        this.canvas.addEventListener('contextmenu', (e) => {

            let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
            _this.mouseUpHandel(e.button,coord);

            e.preventDefault()
        })
  
        document.onkeydown = function(e) {
            if(_this.isFocus){
                if(!keyboardConfig.ignore || keyboardConfig.key.findIndex(item=>{return item==e.key})>=0){
                  _this.keyboardDownHandel(e);
                  e.preventDefault();
                }
            }
        }
        document.onkeyup = function(e) {
            if(_this.isFocus){
                if(!keyboardConfig.ignore || keyboardConfig.key.findIndex(item=>{return item==e.key})>=0){
                    _this.keyboardUpHandel(e);
                    e.preventDefault();
                }
            }
        }
        document.onkeypress = function(e) {
            if(_this.isFocus){
                if(!keyboardConfig.ignore || keyboardConfig.key.findIndex(item=>{return item==e.key})>=0){
                    _this.keyboardPressHandel(e);
                    e.preventDefault();
                }
            }
        }

        if ('onmousewheel' in this.canvas) {
            this.canvas.onmousewheel = (e) => {
                _this.canvas.focus();

                let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
                _this.mouseWheelHandel(e.wheelDelta, coord)

                e.preventDefault()
            }
        } else {
            this.canvas.addEventListener(
                'DOMMouseScroll',
                (e) => {
                    _this.canvas.focus();

                    let coord = _this.normalizeAndQuantizeUnsigned(e.offsetX, e.offsetY)
                    _this.mouseWheelHandel(e.detail * -120, coord)

                    e.preventDefault()
                },
                false
            )
        }
    }
  

  
    normalizeAndQuantizeUnsigned(x, y) {
      let widthRatio = x / this.canvasWidth //0-1之间占比
      let heightRatio = y / this.canvasHeight //0-1之间占比
      let normalizedX = widthRatio
      let normalizedY = heightRatio
      return {
        inRange: true,
        x: normalizedX * 65536,
        y: normalizedY * 65536,
      }
    }
    normalizeAndQuantizeSigned(x, y) {
      let widthRatio = x / (this.canvasWidth / 2) //0-1之间占比
      let heightRatio = y / (this.canvasHeight / 2) //0-1之间占比
      let normalizedX = widthRatio
      let normalizedY = heightRatio
      return {
        x: normalizedX * 32767,
        y: normalizedY * 32767,
      }
    }
  
  
    drawCanvas() {
      if (!this.isPlaying) {
        try {
          this.video.play()
          this.isPlaying = true
        } catch (e) {
          console.error(e);
        }
      }
      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight)
      requestAnimationFrame(this.drawCanvas.bind(this))
    }
  }
