<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">

                <div class="card-header bg-transparent ps-0 pe-0">
                    <h5 class="float-start mb-0">Álbumes</h5>
                </div>

                <DataTable v-model:filters="filters" :value="albumes.data" paginator :rows="5"
                           :globalFilterFields="['id','nombre','tipo','creador','created_at']" stripedRows dataKey="id" size="small">

                    <template #header>
                        <Toolbar pt:root:class="toolbar-table">
                            <template #start>
                                <IconField>
                                    <InputIcon class="pi pi-search"></InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Buscar" />
                                </IconField>

                                <Button type="button" icon="pi pi-filter-slash" label="Limpiar" class="ml-1" outlined @click="initFilters()" />
                                <Button type="button" icon="pi pi-refresh" class="h-100 ml-1" outlined @click="getAlbumes()" />
                            </template>
                            <template #end>
                                <Button v-if="can('album-create')" icon="pi pi-plus" label="Crear Álbum" @click="$router.push('albumes/create')" class="float-end" />
                            </template>
                        </Toolbar>
                    </template>

                    <template #empty>No se encontraron álbumes.</template>

                    <Column field="id" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="tipo" header="Tipo" sortable>
                        <template #body="slotProps">
                            <span class="badge bg-secondary">{{ slotProps.data.tipo }}</span>
                        </template>
                    </Column>
                    <Column field="artista" header="Artista" sortable></Column>
                    <Column field="num_canciones" header="Canciones" sortable>
                        <template #body="slotProps">
                            <span class="badge bg-info">{{ slotProps.data.num_canciones }}</span>
                        </template>
                    </Column>
                    <Column field="duracion_total" header="Duración" sortable></Column>
                    <Column field="created_at" header="Creado el" sortable></Column>

                    <Column header="Portada">
                        <template #body="slotProps">
                            <img v-if="slotProps.data.portada" :src="slotProps.data.portada" alt="Portada" 
                                 style="height: 40px; width: 40px; object-fit: cover; border-radius: 4px;" />
                            <span v-else class="pi pi-image text-gray-400" style="font-size: 1.5rem;"></span>
                        </template>
                    </Column>

                    <Column class="pe-0 me-0 icon-column-3">
                        <template #body="slotProps">
                            <router-link v-if="can('album-edit')" :to="{ name: 'albumes.edit', params: { id: slotProps.data.id } }">
                                <Button icon="pi pi-pencil" severity="info" size="small" class="mr-1" 
                                        v-tooltip.top="'Editar'" />
                            </router-link>

                            <Button icon="pi pi-trash" severity="danger" v-if="can('album-delete')" 
                                    @click.prevent="deleteAlbum(slotProps.data.id, slotProps.index)" 
                                    size="small" v-tooltip.top="'Eliminar'" />
                        </template>
                    </Column>

                </DataTable>

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que quieres eliminar este álbum?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
                        <Button label="Sí" icon="pi pi-check" class="p-button-danger" @click="confirmDelete" />
                    </template>
                </Dialog>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useAlbumes from "@/composables/albumes";
import { useAbility } from '@casl/vue';
import {FilterMatchMode} from "@primevue/core/api";

const { albumes, getAlbumes, deleteAlbum: eliminarAlbum } = useAlbumes();
const { can } = useAbility();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const deleteDialog = ref(false);
const albumIdToDelete = ref(null);
const indexToDelete = ref(null);

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const deleteAlbum = (id, index) => {
    albumIdToDelete.value = id;
    indexToDelete.value = index;
    deleteDialog.value = true;
};

const confirmDelete = () => {
    eliminarAlbum(albumIdToDelete.value)
        .then(() => {
            deleteDialog.value = false;
            albumIdToDelete.value = null;
            indexToDelete.value = null;
        })
        .catch(error => {
            console.error("Error al eliminar el álbum:", error);
        });
};

onMounted(() => {
    getAlbumes();
});
</script>