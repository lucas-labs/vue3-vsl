import type { ItemIdType } from "@/common/types";
import { onBeforeUnmount, onMounted, onUpdated, ref, type Ref } from "vue";

export type SizeChangeEmitCallback = (key: ItemIdType, size: number) => void;

export function useSizeChange(
    element: Ref<HTMLElement>, 
    horizontal: boolean, 
    uniqueKey: ItemIdType, 
    emitSizeChange: SizeChangeEmitCallback
) {
    const shapeKey = horizontal ? 'offsetWidth' : 'offsetHeight';
    const currentSize = ref(0)
    
    const getCurrentSize = () => {
        return element.value ? element.value[shapeKey] : 0;
    }

    const handleSizeChange = ()  => {
        const newSize = getCurrentSize();

        if(newSize !== currentSize.value) {
            currentSize.value = newSize;
            emitSizeChange(uniqueKey, currentSize.value);
        }
    }

    let resizeObserver: ResizeObserver;

    /*
        Lifecycle Hooks
    */

    onMounted(() => {
        if(ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                handleSizeChange();
            });
            if(element.value) resizeObserver.observe(element.value);
        }
    });

    onUpdated(() => {
        handleSizeChange();
    });

    onBeforeUnmount(() => {
        if(resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = undefined;
        }
    });

    return;
}