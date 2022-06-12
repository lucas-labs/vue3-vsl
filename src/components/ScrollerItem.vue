<template>
    <div ref="element" role="listitem">
        <slot :item="source" :id="uniqueKey" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import type { AFunction, AnObject } from '@/common/types';
    import { useSizeChange, type SizeChangeEmitCallback } from './wrapper.composable';
    import type { ItemIdType } from '@/common/types';
    
    const element = ref<HTMLElement>();

    type ItemProps = {
        horizontal: boolean;
        uniqueKey: ItemIdType;
        index?: number;
        tag?: string;
        source?: AnObject;
        component?: AnObject | AFunction;
        slotComponent?: AFunction;
        extraProps?: AnObject;
        scopedSlots?: AnObject;
    }

    const props = defineProps<ItemProps>();
    const emit = defineEmits(['sizeChanged'])

    const emitSizeChanged: SizeChangeEmitCallback = (key, size) => {
        emit('sizeChanged', key, size);
    }

    useSizeChange(
        element,
        props.horizontal,
        props.uniqueKey,
        emitSizeChanged
    );
</script>

<style scoped lang="scss">

</style>