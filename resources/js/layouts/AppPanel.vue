
<template>
    <section class="">
        <h1 class="">Panel Artista</h1>
        <ul class="layout-menu">
            <template v-for="(item, i) in model" :key="item">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </ul>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import {useAbility} from '@casl/vue'
import { authStore } from "../store/auth";

const {can} = useAbility();
const auth = authStore();
//const user = computed(() => auth.user.value)
//console.log(auth.user);
const model = ref([
    {
        items: [
            { 
                label: 'Estadísticas', 
                icon: 'pi pi-fw pi-chart-bar', 
                to: '/artist/statistics', 
                permision: ''
            },
            { 
                label: 'Subir Música', 
                icon: 'pi pi-fw pi-upload', 
                to: '/artist/upload', 
                permision: '' 
            },
            { 
                label: 'Modificar Música', 
                icon: 'pi pi-fw pi-pencil', 
                to: '/artist/edit', 
                permision: '' 
            }
        ]
    }
]);
</script>


<style lang="scss" scoped>


</style>
