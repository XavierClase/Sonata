<template>
    <div class="show"></div>
    <div class="grid">
        <div class="col-12">
            <div class="card">

                <div class="card-header bg-transparent ps-0 pe-0">
                    <h5 class="float-start mb-0">Canciones</h5>
                </div>

                <DataTable v-model:filters="filters" :value="canciones.data" paginator :rows="5"
                           :globalFilterFields="['id','nombre','reproducciones','autor','duracion','created_at']" stripedRows dataKey="id" size="small">

                    <template #header>
                        <Toolbar pt:root:class="toolbar-table">
                            <template #start>
                                <IconField>
                                    <InputIcon class="pi pi-search"></InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Buscar" />
                                </IconField>

                                <Button type="button" icon="pi pi-filter-slash" label="Limpiar" class="ml-1" outlined @click="initFilters()" />
                                <Button type="button" icon="pi pi-refresh" class="h-100 ml-1" outlined @click="getCanciones()" />
                            </template>
                            <template #end>
                                <Button v-if="can('cancion-create')" icon="pi pi-plus" label="Crear Canción" @click="$router.push('canciones/create')" class="float-end" />
                            </template>
                        </Toolbar>
                    </template>

                    <template #empty>No se encontraron canciones.</template>

                    <Column field="id" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="autor" header="Autor" sortable></Column>
                    <Column field="reproducciones" header="Reproducciones" sortable>
                        <template #body="slotProps">
                            <span class="badge bg-info">{{ slotProps.data.reproducciones }}</span>
                        </template>
                    </Column>
                    <Column field="duracion" header="Duración" sortable></Column>
                    <Column field="orden" header="orden" sortable></Column>
                    <Column field="album_id" header="Álbum" sortable>
                        <template #body="slotProps">
                            <span v-if="slotProps.data.album_id">{{ slotProps.data.album_id }}</span>
                            <span v-else class="text-muted">Sin álbum</span>
                        </template>
                    </Column>
                    <Column field="created_at" header="Creado el" sortable></Column>
                    <Column field="updated_at" header="Actualizado el" sortable></Column>
                    <Column header="Portada">
                        <template #body="slotProps">
                            <img v-if="slotProps.data.portada" :src="slotProps.data.portada" alt="Portada" 
                                 style="height: 40px; width: 40px; object-fit: cover; border-radius: 4px;" />
                            <span v-else class="pi pi-image text-gray-400" style="font-size: 1.5rem;"></span>
                        </template>
                    </Column>
                    <Column header="Audio">
                        <template #body="slotProps">
                            <audio v-if="slotProps.data.archivo" controls class="w-100" style="height: 30px;">
                                <source :src="slotProps.data.archivo" type="audio/mpeg">
                                Tu navegador no soporta audio HTML5.
                            </audio>
                            <span v-else class="text-muted">Sin archivo</span>
                        </template>
                    </Column>

                    <Column class="pe-0 me-0 icon-column-3">
                        <template #body="slotProps">

                            <router-link v-if="can('cancion-edit')" :to="{ name: 'canciones.edit', params: { id: slotProps.data.id } }">
                                <Button icon="pi pi-pencil" severity="info" size="small" class="mr-1" 
                                        v-tooltip.top="'Editar'" />
                            </router-link>

                            <Button icon="pi pi-trash" severity="danger" v-if="can('cancion-delete')" 
                                    @click.prevent="deleteCancion(slotProps.data.id, slotProps.index)" 
                                    size="small" v-tooltip.top="'Eliminar'" />
                        </template>
                    </Column>

                </DataTable>

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true" appendTo=".show">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que quieres eliminar esta canción?</span>
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
import useCanciones from "@/composables/cancionesAdmin";
import { useAbility } from '@casl/vue';
import { FilterMatchMode } from "@primevue/core/api";

const { canciones, getCanciones, deleteCancion: eliminarCancion } = useCanciones();
const { can } = useAbility();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const deleteDialog = ref(false);
const cancionIdToDelete = ref(null);
const indexToDelete = ref(null);

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const deleteCancion = (id, index) => {
    cancionIdToDelete.value = id;
    indexToDelete.value = index;
    deleteDialog.value = true;
};

const confirmDelete = () => {
    eliminarCancion(cancionIdToDelete.value)
        .then(() => {
            deleteDialog.value = false;
            cancionIdToDelete.value = null;
            indexToDelete.value = null;
        })
        .catch(error => {
            console.error("Error al eliminar la canción:", error);
        });
};

onMounted(() => {
    getCanciones();
});
</script>