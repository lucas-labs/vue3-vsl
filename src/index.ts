import type { App } from 'vue';
import { VirtualScroller } from './components';

export default {
    install: (app: App) => {
        app.component('VirtualScroller', VirtualScroller);
    }
}

export { VirtualScroller };
