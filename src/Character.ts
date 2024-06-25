import { AnimatedSprite, Assets, Container, Texture } from 'pixi.js'
import { IAnim } from './interfaces.ts'

class Character extends Container {
    characterName: string = 'Unnamed'
    animator: AnimatedSprite | null = null
    animations: IAnim[] = []

    constructor(_characterName: string) {
        super()

        this.characterName = _characterName
    }

    addAnimation(animationName: string, frames: number, looped: boolean = false) {
        const textures: Texture[] = []

        for (let frameIndex = 0; frameIndex < frames; frameIndex++) {
            const assetName: string = `${this.characterName}_${animationName}_${frameIndex}`

            textures.push(Assets.get(assetName))
        }

        const anim: IAnim = {
            animName: animationName,
            textures,
            looped,
        }
        this.animations.push(anim)

        if (!this.animator) {
            this.animator = new AnimatedSprite(textures)
            this.animator.anchor.set(0.5, 1)
            this.animator.scale.set(.5)
            this.animator.animationSpeed = .3
            this.addChild(this.animator)
        } else {
            this.animator.textures = textures
        }


    }

    getAnim(animationName: string): IAnim | null {
        for (const anim of this.animations) {
            if (anim.animName === animationName) return anim
        }

        return null
    }

    playAnimation(animationName: string, onComplete?: () => void) {
        if (!this.animator) return

        const anim: IAnim | null = this.getAnim(animationName)

        if (!anim) return

        this.animator.loop = anim.looped
        this.animator.textures = anim.textures
        this.animator.play()

        this.animator.onComplete = onComplete ?? undefined
    }
}

export default Character