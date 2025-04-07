<template>
    <section class="">
        <h1 class="h1_panel">Panel Artista</h1>
        <ul class="texto_panel">
            <template v-for="(item, i) in Permisos" :key="i">
                <li v-if="!item.separator" class="texto_panel">
                    <router-link :to="item.to" class="texto_panel">
                        {{ item.label }}
                    </router-link>
                </li>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </ul>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAbility } from '@casl/vue';
import { authStore } from "../store/auth";

const { can } = useAbility();
const auth = authStore();

const model = ref([
    {
        items: [
            { 
                label: 'Estadísticas', 
                to: '/app/artista/estadisticas', 
                permission: 'album-create' 
            },
            { 
                label: 'Subir Música', 
                to: '/app/artista/upload', 
                permission: 'album-create' 
            },
            { 
                label: 'Modificar Música', 
                to: '/app/artista/edit', 
                permission: 'album-edit' 
            }
        ]
    }
]);


const Permisos = computed(() => {
    return model.value[0].items.filter(item => {
        return item.separator || (item.permission && can(item.permission));
    });
});
</script>

<style lang="scss" scoped>

.router-link-active {
    font-weight: bold;
}

.h1_panel{
    font-size: 40px;
    background: linear-gradient(to right, #F472B6,  #A855F7);
    background-clip: text; 
    color: transparent; 
    display: inline-block;
    margin-bottom: 30px;
}

.texto_panel{
    display: flex;
    flex-direction: column;
    color: #F472B6;
    font-size: 24px;
    gap: 20px;
}

</style>
