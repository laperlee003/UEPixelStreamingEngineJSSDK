import base from "./base";
import messageType from "./messageType";

const MouseButtonsMask = {
    PrimaryButton: 1, // Left button.
    SecondaryButton: 2, // Right button.
    AuxiliaryButton: 4, // Wheel button.
    FourthButton: 8, // Browser Back button.
    FifthButton: 16, // Browser Forward button.
}

const MouseButton = {
    MainButton: 0, // Left button.
    AuxiliaryButton: 1, // Wheel button.
    SecondaryButton: 2, // Right button.
    FourthButton: 3, // Browser Back button.
    FifthButton: 4, // Browser Forward button.
}

class down extends base{
    constructor(button,coord){
        super();
        this.data = new DataView(new ArrayBuffer(6));
        this.data.setUint8(0, messageType.MouseDown);
        this.data.setUint8(1, button);
        this.data.setUint16(2, coord.x, true);
        this.data.setUint16(4, coord.y, true);
    }
}

class up extends base{
    constructor(button,coord){
        super();
        this.data = new DataView(new ArrayBuffer(6));
        this.data.setUint8(0, messageType.MouseUp);
        this.data.setUint8(1, button);
        this.data.setUint16(2, coord.x, true);
        this.data.setUint16(4, coord.y, true);
    }
}

class move extends base{
    constructor(coord,delta){
        super();
        this.data = new DataView(new ArrayBuffer(9));
        this.data.setUint8(0, messageType.MouseMove);
        this.data.setUint16(1, coord.x, true);
        this.data.setUint16(3, coord.y, true);
        this.data.setInt16(5, delta.x, true);
        this.data.setInt16(7, delta.y, true);
    }
}

class enter extends base{
    constructor(){
        super();
        this.data = new DataView(new ArrayBuffer(1));
        this.data.setUint8(0, messageType.MouseEnter);
    }
}

class leave extends base{
    constructor(){
        super();
        this.data = new DataView(new ArrayBuffer(1));
        this.data.setUint8(0, messageType.MouseLeave);
    }
}

class wheel extends base{
    constructor(delta,coord){
        super();
        this.data = new DataView(new ArrayBuffer(7));
        this.data.setUint8(0, messageType.MouseWheel);
        this.data.setInt16(1, delta, true);
        this.data.setUint16(3, coord.x, true);
        this.data.setUint16(5, coord.y, true);
    }
}


class release extends base{
    constructor(buttons, coord){
        super();
        this.data = new DataView(new ArrayBuffer(6));
        this.data.setUint8(0, messageType.MouseUp);
        if (buttons & MouseButtonsMask.PrimaryButton) {
            this.data.setUint8(1, MouseButton.MainButton);
        }
        if (buttons & MouseButtonsMask.SecondaryButton) {
            this.data.setUint8(1, MouseButton.SecondaryButton);
        }
        if (buttons & MouseButtonsMask.AuxiliaryButton) {
            this.data.setUint8(1, MouseButton.AuxiliaryButton);
        }
        if (buttons & MouseButtonsMask.FourthButton) {
            this.data.setUint8(1, MouseButton.FourthButton);
        }
        if (buttons & MouseButtonsMask.FifthButton) {
            this.data.setUint8(1, MouseButton.FifthButton);
        }
        this.data.setUint16(2, coord.x, true);
        this.data.setUint16(4, coord.y, true);
    }
}

class press extends base{
    constructor(buttons, coord){
        super();
        this.data = new DataView(new ArrayBuffer(6));
        this.data.setUint8(0, messageType.MouseDown);
        if (buttons & MouseButtonsMask.PrimaryButton) {
            this.data.setUint8(1, MouseButton.MainButton);
        }
        if (buttons & MouseButtonsMask.SecondaryButton) {
            this.data.setUint8(1, MouseButton.SecondaryButton);
        }
        if (buttons & MouseButtonsMask.AuxiliaryButton) {
            this.data.setUint8(1, MouseButton.AuxiliaryButton);
        }
        if (buttons & MouseButtonsMask.FourthButton) {
            this.data.setUint8(1, MouseButton.FourthButton);
        }
        if (buttons & MouseButtonsMask.FifthButton) {
            this.data.setUint8(1, MouseButton.FifthButton);
        }
        this.data.setUint16(2, coord.x, true);
        this.data.setUint16(4, coord.y, true);
    }
}

export default {
    down:down,
    up:up,
    move:move,
    enter:enter,
    leave:leave,
    wheel:wheel,
    release:release,
    press:press
}