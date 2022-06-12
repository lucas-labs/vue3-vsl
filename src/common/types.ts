export type AnObject = Record<string, unknown>;
export type AFunction = (...props: any[]) => any;
export type DataKeyFunction = (source: any[]) => string;
export type DataComponentFunction = () => AnObject;
export type ScrollingDirection = 'vertical' | 'horizontal';

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
    estimateSize: number;
    buffer: number;
    uniqueIds: ItemIdType[];
}

export interface VirtualListRange {
    start?: number;
    end?: number;
    padFront?: number;
    padBehind?: number;
}

export const EVENT_TYPE = {
    ITEM: 'item_resize',
    SLOT: 'slot_resize'
};
export const SLOT_TYPE = {
    HEADER: 'thead', // string value also use for aria role attribute
    FOOTER: 'tfoot'
};

export const VirtualListProps = {
    dataKey: {
        type: [String, Function],
        required: true
    },
    dataSources: {
        type: Array,
        required: true
    },
    dataComponent: {
        type: [Object, Function],
        required: true
    },
    keeps: {
        type: Number,
        default: 30
    },
    extraProps: {
        type: Object
    },
    estimateSize: {
        type: Number,
        default: 50
    },
    direction: {
        type: String,
        default: 'vertical',
        validator(value: string) {
            return ['vertical', 'horizontal'].includes(value);
        }
    },
    start: {
        type: Number,
        default: 0
    },
    offset: {
        type: Number,
        default: 0
    },
    topThreshold: {
        type: Number,
        default: 0
    },
    bottomThreshold: {
        type: Number,
        default: 0
    },
    pageMode: {
        type: Boolean,
        default: false
    },
    rootTag: {
        type: String,
        default: 'div'
    },
    wrapTag: {
        type: String,
        default: 'div'
    },
    wrapClass: {
        type: String,
        default: ''
    },
    wrapStyle: {
        type: Object
    },
    itemTag: {
        type: String,
        default: 'div'
    },
    itemClass: {
        type: String,
        default: ''
    },
    itemClassAdd: {
        type: Function
    },
    itemStyle: {
        type: Object
    },
    headerTag: {
        type: String,
        default: 'div'
    },
    headerClass: {
        type: String,
        default: ''
    },
    headerStyle: {
        type: Object
    },
    footerTag: {
        type: String,
        default: 'div'
    },
    footerClass: {
        type: String,
        default: ''
    },
    footerStyle: {
        type: Object
    },
    itemScopedSlots: {
        type: Object
    }
};
