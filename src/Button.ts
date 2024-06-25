import { Container, Graphics, Text, TextStyle } from 'pixi.js';

const NORMAL_TEXT_STYLE: TextStyle = new TextStyle({
    fill: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
})

class Button extends Container {
    private _view: Graphics = new Graphics()
    private _textNode: Text = new Text()
    private _disabled : boolean = false;
    private _onClickCb: () => void;

    constructor(label: string, onClickCb: () => void) {
        super()

        this._onClickCb = onClickCb

        this.updateView()

        this._view.eventMode = 'static'
        this._view.on('click', this.onClick.bind(this))

        this._textNode.text = label
        this._textNode.style = NORMAL_TEXT_STYLE
        this._textNode.anchor.set(0.5)
        this._textNode.position.set(this._view.width / 2, this._view.height / 2)

        this.addChild(this._view)
        this.addChild(this._textNode)
    }

    set disabled (val: boolean) {
        this._disabled = val
        this.updateView()
    }

    get disabled() {
        return this._disabled
    }

    updateView() {
        this._view.clear()

        this._view.roundRect(0, 0, 150, 50, 10)
        this._view.fill(this._disabled ? 0x808080 : 0x726dff)
    }

    onClick(): void {
        if (this.disabled) return

        this._onClickCb()
    }
}

export default Button;
