import { Assets, Sprite } from 'pixi.js'
import SlotElement from './SlotElement.ts'

class Slot extends Sprite {
    row: number = -1
    col: number = -1
    element: SlotElement

    constructor() {
        super(Assets.get('ElementBg')) // Call the parent constructor
        this.anchor.set(0.5)

        // Create the element
        const slotElement = new SlotElement()
        this.element = slotElement
        this.addChild(slotElement)
    }
}

export default Slot