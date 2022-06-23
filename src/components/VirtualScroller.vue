<template>
    <div ref="element" role="list-container" @scroll="onScroll" :class="$props.class">
        <ScrollerSlot
            :unique-key="SlotType.HEADER"
            :horizontal="isHorizontal"
            @size-changed="onSlotResize"
        >
            <template #content v-if="$slots.header">
                <slot name="header"></slot>
            </template>
        </ScrollerSlot>

        <div
            role="group"
            :style="{
                padding: isHorizontal
                    ? `0px ${range.padBehind}px 0px ${range.padFront}px`
                    : `${range.padFront}px 0px ${range.padBehind}px`
            }"
        >
            <ScrollerItem
                v-for="(n, i) in range.end - range.start + 1"
                :key="i"
                :horizontal="isHorizontal"
                :uniqueKey="
                    typeof dataKey === 'function'
                        ? dataKey(dataSources[range.start + i])
                        : dataSources[range.start + i][dataKey]
                "
                :source="dataSources[range.start + i]"
                @size-changed="onChildResize"
            >
                <slot :item="dataSources[range.start + i]" :index="range.start + i"></slot>
            </ScrollerItem>
        </div>

        <ScrollerSlot :unique-key="SlotType.FOOTER" :horizontal="isHorizontal">
            <template #content v-if="$slots.footer">
                <slot name="footer"></slot>
            </template>
        </ScrollerSlot>

        <div
            ref="shepherd"
            :style="{
                width: isHorizontal ? '0px' : '100%',
                height: isHorizontal ? '100%' : '0px'
            }"
        ></div>
    </div>
</template>

<script setup lang="ts">
    import {
        type ItemIdType,
        type DataKeyFunction,
        type ScrollingDirection,
        type VirtualListRange,
        SlotType
    } from '@/common/types';
    import { VirtualListManager } from '@/common/virtual';
    import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue';
    import ScrollerItem from './ScrollerItem.vue';
    import ScrollerSlot from './ScrollerSlot.vue';

    type VirtualScrollerProps = {
        /**
         * The data source for the virtual list.
         * An array containing the data to be displayed.
         */
        dataSources: any[];
        dataKey: string | DataKeyFunction;
        /** Number of items rendered at once. *Defaults to `30`* */
        keeps?: number;
        /** Individual items estimated size. *Defaults to `50` (px)* */
        estimatedSize?: number;
        /**
         * Direction of the scroller.
         * **Options** `vertical` | `horizontal`.
         * *Defaults to `vertical`*
         */
        direction?: ScrollingDirection;
        /** Starting item position. *Defaults to `0` (starts on top)* */
        start?: number;
        /**
         * Starting offset position (jumps n elements).
         * Use this or `start`, not both.
         * *Defaults to `0` (jumps 0 elements: starts on top)*
         */
        offset?: number;
        /** *Defaults to `0`* */
        topThreshold?: number;
        /** *Defaults to `0`* */
        bottomThreshold?: number;
        /** Page Mode. *Defaults to `false`* */
        pageMode?: boolean;

        /*
         * Class list or object
         */
        class?: string | Record<string, boolean>;
    };

    const element = ref<HTMLElement>();
    const shepherd = ref<HTMLElement>();

    const props = withDefaults(defineProps<VirtualScrollerProps>(), {
        keeps: 30,
        estimatedSize: 50,
        direction: 'vertical',
        start: 0,
        offset: 0,
        topThreshold: 0,
        bottomThreshold: 0,
        pageMode: false
    });

    const emit = defineEmits(['resized', 'scroll', 'totop', 'tobottom']);

    const isHorizontal = ref<boolean>(props.direction === 'horizontal');
    const directionKey: 'scrollLeft' | 'scrollTop' = isHorizontal.value
        ? 'scrollLeft'
        : 'scrollTop';
    let virtual: VirtualListManager;
    let range = ref<VirtualListRange>();

    /*
        Watchers
    */
    watch(
        () => props.dataSources.length,
        () => {
            virtual.updateParam('uniqueIds', getUniqueIdFromDataSources());
            virtual.handleDataSourcesChange();
        }
    );

    watch(
        () => props.keeps,
        () => {
            virtual.updateParam('keeps', props.keeps);
            virtual.handleDataSourcesChange();
        }
    );

    watch(
        () => props.keeps,
        () => {
            virtual.updateParam('keeps', props.keeps);
            virtual.handleDataSourcesChange();
        }
    );

    watch(
        () => props.start,
        (newValue) => {
            scrollToIndex(newValue);
        }
    );

    watch(
        () => props.offset,
        (newValue) => {
            scrollToOffset(newValue);
        }
    );

    /*
        Methods
    */

    /** returns current scroll offset */
    const getOffset = () => {
        if (props.pageMode) {
            return document.documentElement[directionKey] || document.body[directionKey];
        } else {
            return element.value ? Math.ceil(element.value[directionKey]) : 0;
        }
    };

    /** returns client viewport size */
    const getClientSize = () => {
        const key = isHorizontal.value ? 'clientWidth' : 'clientHeight';
        if (props.pageMode) {
            return document.documentElement[key] || document.body[key];
        } else {
            return element.value ? Math.ceil(element.value[key]) : 0;
        }
    };

    /** return all scroll size */
    const getScrollSize = () => {
        const key = isHorizontal.value ? 'scrollWidth' : 'scrollHeight';
        if (props.pageMode) {
            return document.documentElement[key] || document.body[key];
        } else {
            return element.value ? Math.ceil(element.value[key]) : 0;
        }
    };

    /** sets current scroll position to a expectant offset */
    const scrollToOffset = (offset: number) => {
        if (props.pageMode) {
            document.body[directionKey] = offset;
            document.documentElement[directionKey] = offset;
        } else {
            if (element.value) {
                element.value[directionKey] = offset;
            }
        }
    };

    /** set current scroll position to a expectant index */
    const scrollToIndex = (index: number) => {
        // scroll to bottom
        if (index >= props.dataSources.length - 1) {
            scrollToBottom();
        } else {
            const offset = virtual.getOffset(index);
            scrollToOffset(offset);
        }
    };

    /** set current scroll position to bottom */
    const scrollToBottom = () => {
        if (shepherd.value) {
            const offset = shepherd.value[isHorizontal.value ? 'offsetLeft' : 'offsetTop'];
            scrollToOffset(offset);

            // check if it's really scrolled to the bottom
            // maybe list doesn't render and calculate to last range
            // so we need retry in next event loop until it really at bottom
            setTimeout(() => {
                if (getOffset() + getClientSize() < getScrollSize()) {
                    scrollToBottom();
                }
            }, 3);
        }
    };

    /**
     * when using page mode we need update slot header size manually
     * taking root offset relative to the browser as slot header size
     */
    const updatePageModeFront = () => {
        if (element.value) {
            const rect = element.value.getBoundingClientRect();
            const { defaultView } = element.value.ownerDocument;
            const offsetFront = isHorizontal.value
                ? rect.left + defaultView.pageXOffset
                : rect.top + defaultView.pageYOffset;
            virtual.updateParam('slotHeaderSize', offsetFront);
        }
    };

    /** event called when each item mounted or size changed */
    const onChildResize = (id: ItemIdType, size: number) => {
        virtual.saveSize(id, size);
        emit('resized', id, size);
    };

    const onSlotResize = (id: ItemIdType, size: number) => {
        if (id === SlotType.HEADER) {
            virtual.updateParam('slotHeaderSize', size);
        } else if (id === SlotType.FOOTER) {
            virtual.updateParam('slotFooterSize', size);
        }
    };

    const onRangeChanged = (newRange: VirtualListRange) => {
        range.value = newRange;
    };

    const onScroll = (evt: any) => {
        const offset = getOffset();
        const clientSize = getClientSize();
        const scrollSize = getScrollSize();

        // iOS scroll-spring-back behavior will make direction mistake
        if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
            return;
        }

        virtual.handleScroll(offset);
        emitEvent(offset, clientSize, scrollSize, evt);
    };

    // emit event in special position
    const emitEvent = (
        offset: number,
        clientSize: number,
        scrollSize: number,
        evt: Event
    ) => {
        emit('scroll', evt, virtual.getRange());

        if (
            virtual.isFront() &&
            !!props.dataSources.length &&
            offset - props.topThreshold <= 0
        ) {
            emit('totop');
        } else if (
            virtual.isBehind() &&
            offset + clientSize + props.bottomThreshold >= scrollSize
        ) {
            emit('tobottom');
        }
    };

    /*
        Lifecycle hooks
    */
    onActivated(() => {
        scrollToOffset(virtual.offset);

        if (props.pageMode) {
            document.addEventListener('scroll', onScroll, {
                passive: false
            });
        }
    });

    onDeactivated(() => {
        if (props.pageMode) {
            document.removeEventListener('scroll', onScroll);
        }
    });

    onMounted(() => {
        if (props.start) {
            scrollToIndex(props.start);
        } else if (props.offset) {
            scrollToOffset(props.offset);
        }

        if (props.pageMode) {
            updatePageModeFront();

            document.addEventListener('scroll', onScroll, {
                passive: false
            });
        }
    });

    onBeforeUnmount(() => {
        virtual.reset();

        if (props.pageMode) {
            document.removeEventListener('scroll', onScroll);
        }
    });

    const getUniqueIdFromDataSources = () => {
        return props.dataSources.map((dataSource) =>
            typeof props.dataKey === 'function'
                ? props.dataKey(dataSource)
                : dataSource[props.dataKey]
        );
    };

    const installVirtual = () => {
        virtual = new VirtualListManager(
            {
                slotHeaderSize: 0,
                slotFooterSize: 0,
                keeps: props.keeps,
                estimatedSize: props.estimatedSize,
                buffer: Math.round(props.keeps / 3), // recommend for a third of keeps
                uniqueIds: getUniqueIdFromDataSources()
            },
            onRangeChanged
        );

        // sync initial range
        range.value = virtual.getRange();
    };

    installVirtual();
</script>

<style scoped lang="css">
    [role='list-container'] {
        overflow: auto;
    }
</style>
