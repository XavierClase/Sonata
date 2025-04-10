<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">

                <div class="card-header bg-transparent ps-0 pe-0">
                    <h5 class="float-start mb-0">Listas de Reproducción</h5>
                </div>

                <DataTable v-model:filters="filters" :value="listas.data" paginator :rows="5"
                           :globalFilterFields="['id','nombre','descripcion','creador','created_at']" stripedRows dataKey="id" size="small">

                    <template #header>
                        <Toolbar pt:root:class="toolbar-table">
                            <template #start>
                                <IconField>
                                    <InputIcon class="pi pi-search"></InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Buscar" />
                                </IconField>

                                <Button type="button" icon="pi pi-filter-slash" label="Limpiar" class="ml-1" outlined @click="initFilters()" />
                                <Button type="button" icon="pi pi-refresh" class="h-100 ml-1" outlined @click="getListas()" />
                            </template>
                            <template #end>
                                <Button v-if="can('lista-create')" icon="pi pi-plus" label="Crear Lista" @click="$router.push('listas/create')" class="float-end" />
                            </template>
                        </Toolbar>
                    </template>

                    <template #empty>No se encontraron listas de reproducción.</template>

                    <Column field="id" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="descripcion" header="Descripción" sortable>
                        <template #body="slotProps">
                            <span>{{ truncateText(slotProps.data.descripcion, 50) }}</span>
                        </template>
                    </Column>
                    <Column field="creador" header="Creador" sortable></Column>
                    <Column field="num_canciones" header="Canciones" sortable>
                        <template #body="slotProps">
                            <span class="badge bg-info">{{ slotProps.data.num_canciones }}</span>
                        </template>
                    </Column>
                    <Column field="duracion_total" header="Duración" sortable></Column>
                    <Column field="created_at" header="Creado el" sortable></Column>
                    <Column field="updated_at" header="Actualizado el" sortable></Column>
                    <Column header="Portada">
                        <template #body="slotProps">
                            <img v-if="slotProps.data.portada" :src="slotProps.data.portada" alt="Portada" 
                                 style="height: 40px; width: 40px; object-fit: cover; border-radius: 4px;" />
                            <span v-else class="pi pi-image text-gray-400" style="font-size: 1.5rem;"></span>
                        </template>
                    </Column>

                    <Column class="pe-0 me-0 icon-column-3">
                        <template #body="slotProps">

                            <router-link v-if="can('lista-edit')" :to="{ name: 'listas.edit', params: { id: slotProps.data.id } }">
                                <Button icon="pi pi-pencil" severity="info" size="small" class="mr-1" 
                                        v-tooltip.top="'Editar'" />
                            </router-link>

                            <Button icon="pi pi-trash" severity="danger" v-if="can('lista-delete')" 
                                    @click.prevent="deleteLista(slotProps.data.id, slotProps.index)" 
                                    size="small" v-tooltip.top="'Eliminar'" />
                        </template>
                    </Column>

                </DataTable>

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que quieres eliminar esta lista de reproducción?</span>
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
import useListas from "@/composables/listasAdmin";
import { useAbility } from '@casl/vue';
import {FilterMatchMode} from "@primevue/core/api";

const { listas, getListas, deleteLista: eliminarLista } = useListas();
const { can } = useAbility();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const deleteDialog = ref(false);
const listaIdToDelete = ref(null);
const indexToDelete = ref(null);

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const deleteLista = (id, index) => {
    listaIdToDelete.value = id;
    indexToDelete.value = index;
    deleteDialog.value = true;
};

const confirmDelete = () => {
    eliminarLista(listaIdToDelete.value)
        .then(() => {
            deleteDialog.value = false;
            listaIdToDelete.value = null;
            indexToDelete.value = null;
        })
        .catch(error => {
            console.error("Error al eliminar la lista:", error);
        });
};

onMounted(() => {
    getListas();
});
</script>