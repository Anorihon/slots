import { Container, Graphics, Ticker } from 'pixi.js'
import Slot from './Slot.ts'
import { ESlotElement, SLOT_SIZE, WIN_PATTERNS } from './constants.ts'
import { IWinPattern } from './interfaces.ts'

interface ElementProbability {
    element: ESlotElement;
    probability: number;
}

const PROBABILITIES: ElementProbability[] = [
    {element: ESlotElement.Bomb, probability: 0.4},
    {element: ESlotElement.Air, probability: 0.2},
    {element: ESlotElement.Earth, probability: 0.1},
    {element: ESlotElement.Fire, probability: 0.3},
    {element: ESlotElement.Meat, probability: 0.3},
    {element: ESlotElement.Shield, probability: 0.15},
    {element: ESlotElement.Water, probability: 0.15},
]

class Grid extends Container {
    readonly gridWidth: number = 3
    readonly gridHeight: number = 3

    private _slotsContainer: Container = new Container()
    private _highlightGraphics: Graphics = new Graphics()
    private _ticker: Ticker = new Ticker()
    private _animationDuration: number = 250 // Duration of the spin animation in milliseconds

    constructor() {
        super()

        // Add containers
        this.addChild(this._slotsContainer)
        this.addChild(this._highlightGraphics)

        // Prepare grid
        this.createGrid()
        this.fillGrid(true)
    }

    get slots(): Array<Slot> {
        return this._slotsContainer.children as Array<Slot>
    }

    createGrid() {
        // Create slots with empty items
        for (let row = 0; row < this.gridWidth; row++) {
            for (let col = 0; col < this.gridHeight; col++) {
                const slot = new Slot()
                slot.row = row
                slot.col = col
                slot.position.set(col * SLOT_SIZE, row * SLOT_SIZE)
                this._slotsContainer.addChild(slot)
            }
        }
    }

    /**
     * Animates the slots by cycling through random elements for a duration.
     * @returns Promise that resolves when the animation is complete.
     */
    async animateSlots(): Promise<void> {
        return new Promise((resolve) => {
            const startTime = Date.now()

            const update = () => {
                const elapsedTime = Date.now() - startTime

                for (const slot of this.slots) {
                    slot.element.slotType = this.getRandomElementByProbability(PROBABILITIES)
                }

                if (elapsedTime >= this._animationDuration) {
                    this._ticker.remove(update)
                    this._ticker.stop()
                    resolve()
                }
            }

            this._ticker.add(update)
            this._ticker.start()
        })
    }

    async fillGrid(withoutMatch: boolean = false): Promise<void> {
        return this.animateSlots().then(() => {
            for (const slot of this.slots) {
                slot.element.slotType = this.getRandomElementByProbability(PROBABILITIES);
            }

            if (!withoutMatch) return;

            const matches = this.getMatches();

            if (matches.length > 0) {
                console.warn('Re-roll fill grid because of match');
                this.fillGrid();
            }
        });
    }

    getRandomElementByProbability(probabilities: ElementProbability[]): ESlotElement {
        const totalProbability = probabilities.reduce((acc, {probability}) => acc + probability, 0)
        const random = Math.random() * totalProbability
        let sum = 0

        for (const {element, probability} of probabilities) {
            sum += probability
            if (random <= sum) {
                return element
            }
        }
        // Fallback in case of rounding issues
        return probabilities[probabilities.length - 1].element
    }

    getSlot(row: number, col: number): Slot | null {
        for (const slot of this.slots) {
            if (slot.row === row && slot.col === col) {
                return slot
            }
        }

        return null
    }

    getMatches(): Array<IWinPattern> {
        const matchedPatterns: Array<IWinPattern> = []

        for (let pattern of WIN_PATTERNS) {
            // Check pattern
            const coordinatesLen: number = pattern.coordinates.length
            let matchedCount: number = 0
            let checkType: ESlotElement = ESlotElement.None

            for (const coordinate of pattern.coordinates) {
                const slot = this.getSlot(coordinate.row, coordinate.col)

                if (!slot || !slot.element || slot.element.slotType === ESlotElement.None) {
                    continue
                }

                if (checkType === ESlotElement.None) {
                    checkType = slot.element.slotType
                    matchedCount += 1
                } else if (checkType === slot.element.slotType) {
                    matchedCount += 1
                } else {
                    break
                }
            }

            if (matchedCount === coordinatesLen) {
                const matchedPattern: IWinPattern = {
                    matchElement: checkType,
                    ...pattern
                }
                matchedPatterns.push(matchedPattern)
            }
        }

        return matchedPatterns
    }

    clearHighlight() {
        this._highlightGraphics.clear()
    }

    highlightMatches(matches: Array<IWinPattern>) {
        this.clearHighlight()

        if (matches.length === 0) return

        const g: Graphics = this._highlightGraphics

        // console.log('highlightMatches', matches)

        for (let pattern of matches) {
            for (let i: number = 0; i < pattern.coordinates.length; i++) {
                const coordinate = pattern.coordinates[i]
                const slot = this.getSlot(coordinate.row, coordinate.col)

                if (!slot) continue

                if (i === 0) {
                    g.moveTo(slot.x, slot.y)
                } else {
                    g.lineTo(slot.x, slot.y)
                }
            }

            g.stroke({
                color: pattern.color,
                width: 4
            })
        }
    }
}

export default Grid