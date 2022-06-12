<template>
    <div ref="element" role="container" @scroll="onScroll">
        <ScrollerSlot :unique-key="SLOT_TYPE.HEADER" :horizontal="isHorizontal">
            <template #content v-if="$slots.header">
                <slot name="header"></slot>
            </template>
        </ScrollerSlot>

        <!-- <slot :item="'item lacop'"></slot> -->
        <div role="group" :style="{
            padding: isHorizontal ? `0px ${range.padBehind}px 0px ${range.padFront}px` : `${range.padFront}px 0px ${range.padBehind}px`
        }">
            <div
                v-for="(n, i) in (range.end - range.start + 1)"
                :key="i"
            >
                {{dataSources[range.start + i].id}} - {{dataSources[range.start + i].username}}

            </div>
        </div>
        <!-- <render-list></render-list> -->
        
        <ScrollerSlot :unique-key="SLOT_TYPE.FOOTER" :horizontal="isHorizontal">
            <template #content v-if="$slots.footer">
                <slot name="footer"></slot>
            </template>
        </ScrollerSlot>
    </div>
</template>

<script setup lang="ts" >
    import {
        EVENT_TYPE,
        SLOT_TYPE,
        type AFunction,
        type AnObject,
        type DataComponentFunction,
        type DataKeyFunction,
        type ItemIdType,
        type ScrollingDirection,
        type VirtualListRange
    } from '@/common/types';
    import ScrollerItem from './ScrollerItem.vue';
    import ScrollerSlot from './ScrollerSlot.vue';
    import { h, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, useSlots } from 'vue';
    import { VirtualListManager } from '@/common/virtual';
    

    type VirtualScrollerProps = {
        dataKey: string | DataKeyFunction;
        dataSources: any[];
        dataComponent: AnObject | DataComponentFunction;
        /** Defaults to 30 */
        keeps?: number;
        extraProps?: AnObject;
        /** Defaults to 50 */
        estimateSize?: number;
        /** Defaults to vertical */
        direction?: ScrollingDirection;
        /** Defaults to 0 */
        start?: number;
        /** Defaults to 0 */
        offset?: number;
        /** Defaults to 0 */
        topThreshold?: number;
        /** Defaults to 0 */
        bottomThreshold?: number;
        /** Defaults to false */
        pageMode?: boolean;
        /** Defaults to div */
        rootTag?: string;
        /** Defaults to div */
        wrapTag?: string;
        /** Defaults to '' */
        wrapClass?: string;
        wrapStyle?: AnObject;
        /** Defaults to div */
        itemTag?: string;
        /** Defaults to '' */
        itemClass?: string;
        itemClassAdd?: AFunction;
        itemStyle?: AnObject;
        /** Defaults to div */
        headerTag?: string;
        /** Defaults to '' */
        headerClass?: string;
        headerStyle?: AnObject;
        /** Defaults to div */
        footerTag?: string;
        /** Defaults to '' */
        footerClass?: string;
        footerStyle?: AnObject;
        itemScopedSlots?: AnObject;
    };

    const element = ref<HTMLElement>();
    const shepherd = ref<HTMLElement>();

    const props = withDefaults(defineProps<VirtualScrollerProps>(), {
        keeps: 30,
        estimateSize: 18,
        direction: 'vertical',
        start: 0,
        offset: 0,
        topThreshold: 0,
        bottomThreshold: 0,
        pageMode: false,
        rootTag: 'div',
        wrapTag: 'div',
        wrapClass: '',
        itemTag: 'div',
        itemClass: '',
        headerTag: 'div',
        headerClass: '',
        footerTag: 'div',
        footerClass: ''
    });

    const scopedSlots = useSlots();

    const emit = defineEmits(['resized', 'scroll', 'totop', 'tobottom']);

    const isHorizontal = ref<boolean>(props.direction === 'horizontal');
    const directionKey: 'scrollLeft' | 'scrollTop' = isHorizontal.value
        ? 'scrollLeft'
        : 'scrollTop';
    let virtual: VirtualListManager;
    let range = ref<VirtualListRange>();

    /*
        Methods
    */

    /** returns the size of an item by id */
    const getSize = (id: ItemIdType) => {
        return virtual?.sizes.get(id);
    };

    /** returns the total number of stored (rendered) items */
    const getSizes = () => {
        return virtual.sizes.size;
    };

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

    /** reset all state back to initial */
    const reset = () => {
        virtual.reset();
        scrollToOffset(0);
        installVirtual();
    };

    /** event called when each item mounted or size changed */
    const onItemResized = (id: ItemIdType, size: number) => {
        virtual.saveSize(id, size);
        emit('resized', id, size);
    };

    /** event called when slot mounted or size changed */
    const onSlotResized = (type: string, size: number, hasInit: boolean) => {
        if (type === SLOT_TYPE.HEADER) {
            virtual.updateParam('slotHeaderSize', size);
        } else if (type === SLOT_TYPE.FOOTER) {
            virtual.updateParam('slotFooterSize', size);
        }

        if (hasInit) {
            virtual.handleSlotSizeChange();
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

    // this.$on(EVENT_TYPE.ITEM, this.onItemResized)

    // // listen slot size change
    // if (this.$slots.header || this.$slots.footer) {
    //     this.$on(EVENT_TYPE.SLOT, this.onSlotResized)
    // }
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
        console.log(virtual);
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
                estimateSize: props.estimateSize,
                buffer: Math.round(props.keeps / 3), // recommend for a third of keeps
                uniqueIds: getUniqueIdFromDataSources()
            },
            onRangeChanged
        );

        // sync initial range
        range.value = virtual.getRange();
    };

    installVirtual();

    const renderItems = () => {
        const slots = []
        const { start, end } = range.value;
        const slotComponent = scopedSlots && scopedSlots.item;

        for (let index = start; index <= end; index++) {
            const dataSource = props.dataSources[index]
            if (dataSource) {
                const uniqueKey = typeof props.dataKey === 'function' ? props.dataKey(dataSource) : dataSource[props.dataKey]
                if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
                    slots.push(
                        h(ScrollerItem, {
                            index,
                            tag: props.itemTag,
                            event: EVENT_TYPE.ITEM,
                            horizontal: isHorizontal.value,
                            uniqueKey: uniqueKey,
                            source: dataSource,
                            extraProps: props.extraProps,
                            component: props.dataComponent,
                            slotComponent: slotComponent,
                            scopedSlots: props.itemScopedSlots,
                            style: props.itemStyle,
                            class: `${props.itemClass}${props.itemClassAdd ? ' ' + props.itemClassAdd(index) : ''}`
                        }, scopedSlots.default)
                    )
                } else {
                    console.warn(`Cannot get the data-key '${props.dataKey}' from data-sources.`)
                }
            } else {
                console.warn(`Cannot get the index '${index}' from data-sources.`)
            }
        }

        return slots;
    }

    const renderList = () => {
        console.log('----------------------------------------------------------> rendering');
        const paddingStyle = { padding: isHorizontal.value ? `0px ${range.value.padBehind}px 0px ${range.value.padFront}px` : `${range.value.padFront}px 0px ${range.value.padBehind}px`}
        const wrapperStyle = props.wrapStyle ? Object.assign({}, props.wrapStyle, paddingStyle) : paddingStyle

        return h(props.wrapTag, {
            on: {
                '&scroll': !props.pageMode && onScroll
            },
            class: props.wrapClass,
            attrs: {
                role: 'group'
            },
            style: wrapperStyle
        }, renderItems())
    }
</script>

<style scoped lang="css">
    [role="container"] {
        height: 300px;
        overflow: auto;
        background-color: rgb(235, 239, 255);
        border: solid 2px midnightblue;
    }
</style>
