import base from "./base";
import messageType from "./messageType";


const SpecialKeyCodes = {
    BackSpace: 8,
    Shift: 16,
    Control: 17,
    Alt: 18,
    RightShift: 253,
    RightControl: 254,
    RightAlt: 255
}

function getKeyCode(e) {
    if (e.keyCode === SpecialKeyCodes.Shift && e.code === 'ShiftRight') return SpecialKeyCodes.RightShift;
    else if (e.keyCode === SpecialKeyCodes.Control && e.code === 'ControlRight') return SpecialKeyCodes.RightControl;
    else if (e.keyCode === SpecialKeyCodes.Alt && e.code === 'AltRight') return SpecialKeyCodes.RightAlt;
    else return e.keyCode;
}
class down extends base{
    constructor(e){
        super();
        this.data = new Uint8Array([messageType.KeyDown, getKeyCode(e), e.repeat]);
    }
}

class up extends base{
    constructor(e){
        super();
        this.data = new Uint8Array([messageType.KeyUp, getKeyCode(e)]);
    }
}

class press extends base{
    constructor(e){
        super();
        this.data = new DataView(new ArrayBuffer(3));
        this.data.setUint8(0, messageType.KeyPress);
        this.data.setUint16(1, e.charCode, true);
    }
}

export default {
    down:down,
    up:up,
    press:press
}