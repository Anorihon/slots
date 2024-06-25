import { IWinPattern } from './interfaces.ts'

export enum ESlotElement {
    None,
    Air,
    Bomb,
    Earth,
    Fire,
    Meat,
    Shield,
    Water,
}

export const SLOT_ELEMENT_VALUES: Array<number> = Object.values(ESlotElement)
    .filter(value => typeof value === 'number') // Filter only numeric values to exclude keys

export const SLOT_ELEMENT_KEYS: Array<String> = Object.keys(ESlotElement)
    .filter((v) => isNaN(Number(v)))

export const SLOT_SIZE: number = 72

export const WIN_PATTERNS: Array<IWinPattern> = [
    // Straight line
    {
        color: 0xff0000,  // Red
        coordinates: [
            {row: 0, col: 0},
            {row: 0, col: 1},
            {row: 0, col: 2},
        ],
    },
    {
        color: 0x00ff00,  // Green
        coordinates: [
            {row: 1, col: 0},
            {row: 1, col: 1},
            {row: 1, col: 2},
        ],
    },
    {
        color: 0x0000ff,  // Blue
        coordinates: [
            {row: 2, col: 0},
            {row: 2, col: 1},
            {row: 2, col: 2},
        ],
    },

    // Triangle
    {
        color: 0xff00ff,  // Magenta
        coordinates: [
            {row: 0, col: 0},
            {row: 1, col: 1},
            {row: 0, col: 2},
        ],
    },
    {
        color: 0xffff00,  // Yellow
        coordinates: [
            {row: 2, col: 0},
            {row: 1, col: 1},
            {row: 2, col: 2},
        ],
    },
]