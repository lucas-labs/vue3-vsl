import type { DefineComponent, Ref, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
import { type AnObject, type ItemIdType } from '../common/types';
import { type SizeChangeEmitCallback } from './wrapper.composable';
declare const _sfc_main: DefineComponent<{
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
    props: {
        horizontal: boolean;
        uniqueKey: ItemIdType;
        source?: AnObject;
    };
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
export default _sfc_main;
