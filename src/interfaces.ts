import { Texture } from 'pixi.js'
import { ESlotElement } from './constants.ts'

export interface IGridCoordinate {
    row: number;
    col: number;
}

export interface IWinPattern {
    color: number
    coordinates: IGridCoordinate[]
    matchElement?: ESlotElement
}

export interface IAnim {
    animName: string
    textures: Texture[]
    looped: boolean
}