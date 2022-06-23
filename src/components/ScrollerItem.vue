<template>
    <div ref="element" role="list-item" :id="uniqueKey + ''">
        <slot :item="source"  />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { EventType, type AnObject, type ItemIdType } from '../common/types';
    import { useSizeChange, type SizeChangeEmitCallback } from './wrapper.composable';
    
    const element = ref<HTMLElement>();

    type ItemProps = {
        horizontal: boolean;
        uniqueKey: ItemIdType;
        source?: AnObject;
    }

    const props = defineProps<ItemProps>();
    const emit = defineEmits(['sizeChanged'])

    const emitSizeChanged: SizeChangeEmitCallback = (size) => {
        emit('sizeChanged', props.uniqueKey, size, EventType.ITEM);
    }

    useSizeChange(
        element,
        props.horizontal,
        emitSizeChanged
    );
</script>
