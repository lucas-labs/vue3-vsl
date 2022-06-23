import type { SizeChangeEmitCallback } from './wrapper.composable';
import type { DefineComponent, Ref, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
import type { ItemIdType, AnObject, type DataKeyFunction } from '../common/types';
declare const _sfc_main: DefineComponent<{
    dataSources: {
        type: ArrayConstructor;
        required: true;
    };
    dataKey: {
        type: StringConstructor[];
        required: true;
    };
    keeps: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    estimatedSize: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    direction: {
        type: any;
        required: false;
        default: string;
    };
    start: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    offset: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    topThreshold: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    bottomThreshold: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    pageMode: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    class: {
        type: (StringConstructor | ObjectConstructor)[];
        required: false;
    };
}, {
    element: Ref<HTMLElement>;
    shepherd: Ref<HTMLElement>;
    props: {
        dataSources: any[];
        dataKey: string | DataKeyFunction;
        keeps: number;
        estimatedSize: number;
        direction: ScrollingDirection;
        start: number;
        offset: number;
        topThreshold: number;
        bottomThreshold: number;
        pageMode: boolean;
        class?: string | Record<string, boolean>;
    };
    emit: (event: "resized" | "scroll" | "totop" | "tobottom", ...args: any[]) => void;
    isHorizontal: Ref<boolean>;
    directionKey: "scrollLeft" | "scrollTop";
    virtual: VirtualListManager;
    range: Ref<VirtualListRange>;
    getOffset: () => number;
    getClientSize: () => number;
    getScrollSize: () => number;
    scrollToOffset: (offset: number) => void;
    scrollToIndex: (index: number) => void;
    scrollToBottom: () => void;
    updatePageModeFront: () => void;
    onChildResize: (id: ItemIdType, size: number) => void;
    onSlotResize: (id: ItemIdType, size: number) => void;
    onRangeChanged: (newRange: VirtualListRange) => void;
    onScroll: (evt: any) => void;
    emitEvent: (offset: number, clientSize: number, scrollSize: number, evt: Event) => void;
    getUniqueIdFromDataSources: () => any[];
    installVirtual: () => void;
    SlotType: any;
    ScrollerItem: DefineComponent<{
        horizontal: {
            type: BooleanConstructor;
            required: true;
        };
        uniqueKey: {
            type: any;
            required: true;
        };
        source: {
            type: any;
            required: false;
        };
    }, {
        element: Ref<HTMLElement>;
        /** Starting item position. *Defaults to `0` (starts on top)* */
        props: {
            horizontal: boolean;
            uniqueKey: ItemIdType;
            source?: AnObject;
        }; /** Starting item position. *Defaults to `0` (starts on top)* */
        emit: (event: "sizeChanged", ...args: any[]) => void;
        emitSizeChanged: SizeChangeEmitCallback;
    }, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, "sizeChanged"[], "sizeChanged", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{
        horizontal: {
            type: BooleanConstructor;
            required: true;
        };
        uniqueKey: {
            type: any;
            required: true;
        };
        source: {
            type: any;
            required: false;
        };
    }>> & {
        onSizeChanged?: (...args: any[]) => any;
    }, {
        source: any;
    }>;
    ScrollerSlot: DefineComponent<{
        uniqueKey: {
            type: StringConstructor;
            required: true;
        };
        horizontal: {
            type: BooleanConstructor;
            required: true;
        };
        tag: {
            type: StringConstructor;
            required: false;
        };
    }, {
        element: Ref<HTMLElement>;
        props: {
            uniqueKey: string;
            horizontal: boolean;
            tag?: string;
        };
        emit: (event: "sizeChanged", ...args: any[]) => void;
        emitSizeChanged: SizeChangeEmitCallback;
    }, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, "sizeChanged"[], "sizeChanged", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{
        uniqueKey: {
            type: StringConstructor;
            required: true;
        };
        horizontal: {
            type: BooleanConstructor;
            required: true;
        };
        tag: {
            type: StringConstructor;
            required: false;
        };
    }>> & {
        onSizeChanged?: (...args: any[]) => any;
    }, {}>;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("resized" | "scroll" | "totop" | "tobottom")[], "resized" | "scroll" | "totop" | "tobottom", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{
    dataSources: {
        type: ArrayConstructor;
        required: true;
    };
    dataKey: {
        type: StringConstructor[];
        required: true;
    };
    keeps: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    estimatedSize: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    direction: {
        type: any;
        required: false;
        default: string;
    };
    start: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    offset: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    topThreshold: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    bottomThreshold: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    pageMode: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    class: {
        type: (StringConstructor | ObjectConstructor)[];
        required: false;
    };
}>> & {
    onResized?: (...args: any[]) => any;
    onScroll?: (...args: any[]) => any;
    onTotop?: (...args: any[]) => any;
    onTobottom?: (...args: any[]) => any;
}, {
    keeps: number;
    estimatedSize: number;
    direction: any;
    start: number;
    offset: number;
    topThreshold: number;
    bottomThreshold: number;
    pageMode: boolean;
}>;
export default _sfc_main;
