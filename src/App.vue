<template>
    <header>hello!</header>

    <virtual-scroller :data-key="'id'" :data-sources="users" :data-component="null" >
        <template v-slot="{item}">
            #{{item.id}} - {{item.username}}
        </template>

        <!-- <template #header>
            heada
        </template> -->

        <!-- <template #footer>
            foota
        </template> -->
    </virtual-scroller>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import VirtualScroller from './components/VirtualScroller.vue';
    import { generateUsername, generateUniqueId } from './demo/common/utils';

    const users = ref<{ id: number, username: string }[]>([]);

    const createUsers = (size: number) => {
        for(let i = 0; i < size; i++) {
            users.value.push({
                id: i,
                username: generateUsername()
            });
        }

        console.log(users.value); 
    }

    createUsers(3000);
</script>

<style></style>
