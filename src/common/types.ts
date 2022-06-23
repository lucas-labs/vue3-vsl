export type AnObject = Record<string, unknown>;
export type ScrollingDirection = 'vertical' | 'horizontal';
export type DataKeyFunction = (source: any[]) => string;

/**
 * - FRONT => scroll up or left
 * - BEHIND => scroll down or right
 */
export type DirectionType = 'FRONT' | 'BEHIND' | '';
export type CalcType = 'INIT' | 'FIXED' | 'DYNAMIC';
export const LEADING_BUFFER = 0;
export type ItemIdType = string | number;

export interface VirtualOptions {
    slotHeaderSize: number;
    slotFooterSize: number;
    keeps: number;
    estimatedSize: number;
    buffer: number;
    uniqueIds: ItemIdType[];
}

export interface VirtualListRange {
    start?: number;
    end?: number;
    padFront?: number;
    padBehind?: number;
}

export enum EventType {
    ITEM = 'ITEM',
    SLOT = 'SLOT'
}

export const SlotType = {
    HEADER: 'list-header', // string value also use for aria role attribute
    FOOTER: 'list-footer'
};

