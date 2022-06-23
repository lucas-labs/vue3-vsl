export declare type AnObject = Record<string, unknown>;
export declare type ScrollingDirection = 'vertical' | 'horizontal';
export declare type DataKeyFunction = (source: any[]) => string;
/**
 * - FRONT => scroll up or left
 * - BEHIND => scroll down or right
 */
export declare type DirectionType = 'FRONT' | 'BEHIND' | '';
export declare type CalcType = 'INIT' | 'FIXED' | 'DYNAMIC';
export declare const LEADING_BUFFER = 0;
export declare type ItemIdType = string | number;
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
export declare enum EventType {
    ITEM = "ITEM",
    SLOT = "SLOT"
}
export declare const SlotType: {
    HEADER: string;
    FOOTER: string;
};
