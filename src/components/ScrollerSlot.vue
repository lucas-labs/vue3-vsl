<template>
    <div ref="element" :role="uniqueKey" v-if="$slots.content">
        <slot name="content"></slot>
    </div>
</template>

<script setup lang="ts">
    import { EventType } from '@/common/types';
    import { ref } from 'vue';
    import { useSizeChange, type SizeChangeEmitCallback } from './wrapper.composable';

    const element = ref<HTMLElement>();
    type SlotProps = {
        uniqueKey: string;
        horizontal: boolean;
        tag?: string;
    }

    const props = defineProps<SlotProps>();
    const emit = defineEmits(['sizeChanged'])

    const emitSizeChanged: SizeChangeEmitCallback = (size) => {
        emit('sizeChanged', props.uniqueKey, size, EventType.SLOT);
    }

    useSizeChange(
        element,
        props.horizontal,
        emitSizeChanged
    )
</script>