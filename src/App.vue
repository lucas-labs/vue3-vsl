<template>
    <header>hello!</header>

    <virtual-scroller :data-key="'id'" :data-sources="users" @tobottom="bottom">
        <template #header>
            <div style="height: 120px; background-color: aquamarine;">
                header
            </div>
            
        </template>

        <template v-slot="{item, index}">
            <div style="min-height: 66px; margin: 8px; background-color: azure;">
                #{{index}} - {{item.id}} - {{item.username}}
            </div>
        </template>
    </virtual-scroller>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import VirtualScroller from './components/VirtualScroller.vue';
    import { generateUsername, generateUniqueId } from './demo/common/utils';

    const users = ref<{ id: number | string, username: string }[]>([]);

    const createUsers = (size: number) => {
        for(let i = 0; i < size; i++) {
            users.value.push({
                id: generateUniqueId('usr'),
                username: generateUsername()
            });
        }
    }

    const bottom = () => {
        console.log('bottom!')
    }

    createUsers(3000);
</script>

<style></style>
