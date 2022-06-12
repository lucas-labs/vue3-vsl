<template>
    <div ref="element" :role="uniqueKey" v-if="check($slots.content)">
        <slot name="content"></slot>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useSizeChange, type SizeChangeEmitCallback } from './wrapper.composable';

    const element = ref<HTMLElement>();
    type SlotProps = {
        uniqueKey: string;
        horizontal: boolean;
        tag?: string;
    }

    const check = (lala: any) => {
        console.log(lala);
        return lala;
    }

    const props = defineProps<SlotProps>();
    const emit = defineEmits(['sizeChanged'])

    const emitSizeChanged: SizeChangeEmitCallback = (key, size) => {
        emit('sizeChanged', key, size);
    }

    useSizeChange(
        element,
        props.horizontal,
        props.uniqueKey,
        emitSizeChanged
    )
</script>

<style scoped lang="scss">

</style>