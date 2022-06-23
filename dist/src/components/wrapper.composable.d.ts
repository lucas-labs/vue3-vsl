import { type Ref } from "vue";
export declare type SizeChangeEmitCallback = (size: number) => void;
export declare function useSizeChange(element: Ref<HTMLElement>, horizontal: boolean, emitSizeChange: SizeChangeEmitCallback): void;
