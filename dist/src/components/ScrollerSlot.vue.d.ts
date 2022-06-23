import type { DefineComponent, Ref, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
import { type SizeChangeEmitCallback } from './wrapper.composable';
declare const _sfc_main: DefineComponent<{
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
export default _sfc_main;
