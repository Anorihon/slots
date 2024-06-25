import { Assets, Sprite } from 'pixi.js'
import { ESlotElement, SLOT_ELEMENT_KEYS, SLOT_SIZE } from './constants.ts'

class SlotElement extends Sprite {
    private _slotType: ESlotElement = ESlotElement.None

    constructor(slotType?: ESlotElement) {
        super()

        if (slotType) {
            this.slotType = slotType
        }
    }

    set slotType(val: ESlotElement) {
        this._slotType = val

        // @ts-ignore
        this.texture = val !== ESlotElement.None ? Assets.get(SLOT_ELEMENT_KEYS[val]) : null

        // Calculate scale
        const desiredSize: number = SLOT_SIZE * 0.8
        const scaleX = desiredSize / this.texture.width;
        const scaleY = desiredSize / this.texture.height;

        // Apply scale
        this.scale.set(scaleX, scaleY);

        this.anchor.set(0.5)
    }

    get slotType(): ESlotElement {
        return this._slotType
    }
}

export default SlotElement