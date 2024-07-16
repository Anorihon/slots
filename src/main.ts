import '../style.css'
import { Application, Assets } from 'pixi.js'
// @ts-ignore
import type { AssetsBundle } from 'pixi.js/lib/assets/types'
import Grid from './Grid.ts'
import { SLOT_ELEMENT_KEYS, SLOT_SIZE } from './constants.ts'
import Button from './Button.ts'
import Character from './Character.ts'
import { IWinPattern } from './interfaces.ts'

(async () => {
    // create application
    let app = new Application()

    await app.init({
        background: '#1099bb',
        resizeTo: window,
        eventFeatures: {
            click: true,
        }
    })

    document.body.appendChild(app.canvas)

    // preload assets
    const imgPath = 'assets/img/'
    const assetsBundle: AssetsBundle['assets'] = [
        {alias: 'ElementBg', src: imgPath + 'ElementBg.png'},
    ]

    // add elements assets
    for (const slotElementKey of SLOT_ELEMENT_KEYS) {
        if (slotElementKey === 'None') continue

        assetsBundle.push({
            alias: slotElementKey,
            src: imgPath + 'Element/' + slotElementKey + '/ElementSelected.png',
        })
    }

    // Char loader helper
    const charAssetsBuilder = (characterName: string, animationName: string, frames: number) => {
        for (let frameIndex = 0; frameIndex < frames; frameIndex++) {
            assetsBundle.push({
                alias: `${characterName}_${animationName}_${frameIndex}`,
                src: imgPath + `${characterName}/${animationName}/skeleton-${animationName}_${frameIndex}.png`,
            })
        }
    }

    // Load characters assets
    charAssetsBuilder('Hero', 'Idle', 10)
    charAssetsBuilder('Hero', 'Hit', 22)
    charAssetsBuilder('Hero', 'GetHit', 14)

    charAssetsBuilder('Enemy', 'Idle', 10)
    charAssetsBuilder('Enemy', 'Death', 31)
    charAssetsBuilder('Enemy', 'GetHit', 14)

    Assets.addBundle('assets', assetsBundle)

    await Assets.loadBundle('assets')

    // create grid
    const grid: Grid = new Grid()

    grid.x = app.screen.width / 2 - SLOT_SIZE * 1.5
    grid.y = app.screen.height / 2 - SLOT_SIZE * 1.5

    app.stage.addChild(grid)

    // Add Enemy
    const enemy = new Character('Enemy')

    enemy.scale.x = -enemy.scale.x
    enemy.x = app.screen.width / 2
    enemy.y = app.screen.height / 2 - SLOT_SIZE * 2 + 8
    enemy.addAnimation('Idle', 10, true)
    enemy.addAnimation('Death', 31)
    enemy.addAnimation('GetHit', 14)

    enemy.playAnimation('Idle')
    app.stage.addChild(enemy)

    // Add Hero
    const hero = new Character('Hero')

    hero.x = app.screen.width / 2 - SLOT_SIZE
    hero.y = app.screen.height / 2 - SLOT_SIZE * 2
    hero.addAnimation('Idle', 10, true)
    hero.addAnimation('Hit', 22)
    hero.addAnimation('GetHit', 14)

    hero.playAnimation('Idle')
    app.stage.addChild(hero)

    // Add Spin button
    const spinBtn = new Button('Spin', async () => {
        grid.clearHighlight()
        spinBtn.disabled = true

        await grid.fillGrid()

        const matches = grid.getMatches()
        grid.highlightMatches(matches)

        if (matches.length === 0) {
            spinBtn.disabled = false

            return
        }

        console.log('Matches', matches)

        playMatchAnimations(matches)
    })
    spinBtn.x = app.screen.width / 2 + SLOT_SIZE * 1.5
    spinBtn.y = app.screen.height / 2
    app.stage.addChild(spinBtn)


    function playMatchAnimations(matches: Array<IWinPattern>) {
        let currentMatch = 0

        function playNextMatch() {
            if (currentMatch >= matches.length) {
                hero.playAnimation('Idle')
                enemy.playAnimation('Idle')
                spinBtn.disabled = false
                return
            }

            hero.playAnimation('Hit', () => {
                enemy.playAnimation('GetHit', () => {
                    currentMatch++
                    playNextMatch()
                })
            })
        }

        playNextMatch()
    }
})()