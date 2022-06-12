import { onBeforeUnmount, onMounted, onUpdated, ref, type Ref } from "vue";

export type SizeChangeEmitCallback = (size: number) => void;

export function useSizeChange(
    element: Ref<HTMLElement>, 
    horizontal: boolean, 
    emitSizeChange: SizeChangeEmitCallback
) {
    const currentSize = ref(0)
    
    const getCurrentSize = () => {
        if(!element.value) return 0;

        const rect = element.value.getBoundingClientRect()

        if(horizontal) {
            return rect.width;
        } else { 
            return rect.height;
        }
    }

    const handleSizeChange = ()  => {
        const newSize = getCurrentSize();

        currentSize.value = newSize;
        emitSizeChange(currentSize.value);
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