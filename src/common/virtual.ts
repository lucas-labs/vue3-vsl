import { LEADING_BUFFER, type CalcType, type DirectionType, type VirtualOptions, type VirtualListRange, type ItemIdType } from "./types";

export class VirtualListManager {
    // Size Data
    sizes: Map<ItemIdType, number>;
    firstRangeTotalSize: number;
    firstRangeAverageSize: number;
    lastCalcIndex: number;
    fixedSizeValue: number;
    calcType: CalcType;

    // Scroll Data
    offset: number;
    direction: DirectionType;

    // Range Data
    range: VirtualListRange;

    constructor(
        public param: VirtualOptions,
        public onRangeChangeCallback: (range: VirtualListRange) => void
    ) {
        this.reset(false, false);
    }

    /** resets the object back to its initial state */
    reset(resetParams = true, resetCallback = true) {
        this.sizes = new Map<ItemIdType, number>();
        this.firstRangeTotalSize = 0;
        this.firstRangeAverageSize = 0;
        this.lastCalcIndex = 0;
        this.fixedSizeValue = 0;
        this.calcType = 'INIT';
        this.offset = 0;
        this.direction = '';
        this.range = {};

        if(resetParams) {
            this.param = undefined;
        }

        if(resetCallback) {
            this.onRangeChangeCallback = undefined;
        }

        if (this.param) {
            this.checkRange(0, this.param.keeps - 1);
        }
    }

    /* returns current render range */
    getRange() {
        return { ...this.range } as VirtualListRange;
    }

    isBehind() {
        return this.direction === 'BEHIND';
    }

    isFront() {
        return this.direction === 'FRONT';
    }

    /* returns start index offset */
    getOffset(start: number) {
        return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize;
    }

    updateParam<Opts extends VirtualOptions, Key extends keyof Opts>(
        key: Key,
        value: Opts[Key]
    ) {
        if (this.param && key in this.param) {
            // if uniqueIds change, find out deleted id and remove from size map
            if (key === 'uniqueIds') {
                this.sizes.forEach((v, key) => {
                    if (!(value as unknown as ItemIdType[]).includes(key)) {
                        this.sizes.delete(key);
                    }
                });
            }
            this.param[key as keyof VirtualOptions] = value as any;
        }
    }

    // save each size map by id
    saveSize(id: ItemIdType, size: number) {
        this.updateParam('uniqueIds', []);
        this.sizes.set(id, size);

        // we assume size type is fixed at the beginning and remember first size value
        // if there is no size value different from this at next comming saving
        // we think it's a fixed size list, otherwise is dynamic size list
        if (this.calcType === 'INIT') {
            this.fixedSizeValue = size;
            this.calcType = 'FIXED';
        } else if (this.calcType === 'FIXED' && this.fixedSizeValue !== size) {
            this.calcType = 'DYNAMIC';
            // it's no use at all
            delete this.fixedSizeValue;
        }

        // calculate the average size only in the first range
        if (this.calcType !== 'FIXED' && typeof this.firstRangeTotalSize !== 'undefined') {
            if (this.sizes.size < Math.min(this.param.keeps, this.param.uniqueIds.length)) {
                this.firstRangeTotalSize = [...this.sizes.values()].reduce(
                    (acc, val) => acc + val,
                    0
                );
                this.firstRangeAverageSize = Math.round(
                    this.firstRangeTotalSize / this.sizes.size
                );
            } else {
                // it's done using
                delete this.firstRangeTotalSize;
            }
        }
    }

    handleDataSourcesChange() {
        let start = this.range.start;

        if (this.isFront()) {
            start = start - LEADING_BUFFER;
        } else if (this.isBehind()) {
            start = start + LEADING_BUFFER;
        }

        start = Math.max(start, 0);

        this.updateRange(this.range.start, this.getEndByStart(start));
    }

    // when slot size change, we also need force update
    handleSlotSizeChange() {
        this.handleDataSourcesChange();
    }

    // calculating range on scroll
    handleScroll(offset: number) {
        this.direction = offset < this.offset ? 'FRONT' : 'BEHIND';
        this.offset = offset;

        if (!this.param) {
            return;
        }

        if (this.direction === 'FRONT') {
            this.handleFront();
        } else if (this.direction === 'BEHIND') {
            this.handleBehind();
        }
    }

    // ----------- public method end -----------

    handleFront() {
        const overs = this.getScrollOvers();

        console.log('handleFront', overs, this.range.start, overs > this.range.start);
        // should not change range if start doesn't exceed overs
        if (overs > this.range.start) {
            return;
        }

        // move up start by a buffer length, and make sure its safety
        const start = Math.max(overs - this.param.buffer, 0);
        this.checkRange(start, this.getEndByStart(start));
    }

    handleBehind() {
        const overs = this.getScrollOvers();
        
        console.log('handleBehind', overs, this.range.start, overs < this.range.start + this.param.buffer);
        // range should not change if scroll overs within buffer
        if (overs < this.range.start + this.param.buffer) {
            return;
        }

        this.checkRange(overs, this.getEndByStart(overs));
    }

    // return the pass overs according to current scroll offset
    getScrollOvers() {
        // if slot header exist, we need subtract its size
        const offset = this.offset - this.param.slotHeaderSize;
        if (offset <= 0) {
            return 0;
        }

        // if is fixed type, that can be easily
        if (this.isFixedType()) {
            return Math.floor(offset / this.fixedSizeValue);
        }

        let low = 0;
        let middle = 0;
        let middleOffset = 0;
        let high = this.param.uniqueIds.length;

        while (low <= high) {
            // this.__bsearchCalls++
            middle = low + Math.floor((high - low) / 2);
            middleOffset = this.getIndexOffset(middle);

            if (middleOffset === offset) {
                return middle;
            } else if (middleOffset < offset) {
                low = middle + 1;
            } else if (middleOffset > offset) {
                high = middle - 1;
            }
        }

        return low > 0 ? --low : 0;
    }

    /**
     * Returns a scroll offset from given index.
     * TODO: can efficiency be improved more here?
     * although the call frequency is very high,
     * its only a superposition of numbers
     */
    getIndexOffset(givenIndex: number) {
        if (!givenIndex) {
            return 0;
        }

        let offset = 0;
        let indexSize = 0;
        for (let index = 0; index < givenIndex; index++) {
            indexSize = this.sizes.get(this.param.uniqueIds[index]);
            offset =
                offset + (typeof indexSize === 'number' ? indexSize : this.getEstimateSize());
        }

        // remember last calculate index
        this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
        this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());

        return offset;
    }

    // is fixed size type
    isFixedType() {
        return this.calcType === 'FIXED';
    }

    // return the real last index
    getLastIndex() {
        return this.param.uniqueIds.length - 1;
    }

    // in some conditions range is broke, we need correct it
    // and then decide whether we need to update next range
    checkRange(start: number, end: number) {
        const keeps = this.param.keeps;
        const total = this.param.uniqueIds.length;

        // datas less than keeps, render all
        if (total <= keeps) {
            start = 0;
            end = this.getLastIndex();
        } else if (end - start < keeps - 1) {
            // if range length is less than keeps, corrent it base on end
            start = end - keeps + 1;
        }

        if (this.range.start !== start) {
            this.updateRange(start, end);
        }
    }

    // setting to a new range and rerender
    updateRange(start: number, end: number) {
        console.log('update range', start, end);
        this.range.start = start;
        this.range.end = end;
        this.range.padFront = this.getPadFront();
        this.range.padBehind = this.getPadBehind();
        this.onRangeChangeCallback(this.getRange());
    }

    // return end base on start
    getEndByStart(start: number) {
        const theoryEnd = start + this.param.keeps - 1;
        const truelyEnd = Math.min(theoryEnd, this.getLastIndex());
        return truelyEnd;
    }

    // return total front offset
    getPadFront() {
        if (this.isFixedType()) {
            return this.fixedSizeValue * this.range.start;
        } else {
            return this.getIndexOffset(this.range.start);
        }
    }

    // return total behind offset
    getPadBehind() {
        const end = this.range.end;
        const lastIndex = this.getLastIndex();

        if (this.isFixedType()) {
            return (lastIndex - end) * this.fixedSizeValue;
        }

        // if it's all calculated, return the exactly offset
        if (this.lastCalcIndex === lastIndex) {
            return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
        } else {
            // if not, use a estimated value
            return (lastIndex - end) * this.getEstimateSize();
        }
    }

    // get the item estimate size
    getEstimateSize() {
        return this.isFixedType()
            ? this.fixedSizeValue
            : this.firstRangeAverageSize || this.param.estimateSize;
    }
}
