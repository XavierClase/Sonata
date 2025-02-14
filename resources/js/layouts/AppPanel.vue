
<template>
    <section class="">
        <h1 class="h1_panel">Panel Artista</h1>
        <ul class="texto_panel">
            <template v-for="(item, i) in model[0].items" :key="i">
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
            { label: 'Estadísticas', to: '/app/artista/estadisticas', permision: '' },
            { label: 'Subir Música', to: '/app/artista/upload', permision: '' },
            { label: 'Modificar Música', to: '/app/artista/edit', permision: '' }
        ]
    }
]);
</script>


<style lang="scss" scoped>


.h1_panel{
    font-size: 40px;
    background: linear-gradient(to right, #F472B6,  #A855F7);
    background-clip: text; 
    color: transparent; 
    display: inline-block;
}

.texto_panel{
    color: #F472B6;
    font-size: 24px;
}

</style>
