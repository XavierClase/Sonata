<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Crear Lista de Reproducción</h5>
                </div>

                <form @submit.prevent="submitForm" class="p-fluid">
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="nombre">Nombre</label>
                                <InputText id="nombre" v-model="form.nombre" :class="{'p-invalid': errors.nombre}" />
                                <small class="p-error" v-if="errors.nombre">{{ errors.nombre[0] }}</small>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="field">
                                <label for="descripcion">Descripción</label>
                                <Textarea id="descripcion" v-model="form.descripcion" rows="3" />
                                <small class="p-error" v-if="errors.descripcion">{{ errors.descripcion[0] }}</small>
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="portada">Portada</label>
                                <div class="flex flex-column">
                                    <div v-if="previewImage" class="mb-2">
                                        <img :src="previewImage" alt="Vista previa" style="max-width: 200px; max-height: 200px;" />
                                    </div>
                                    <FileUpload
                                        mode="basic"
                                        name="portada"
                                        accept="image/*"
                                        :maxFileSize="2000000"
                                        @select="onImageSelect"
                                        @error="onError"
                                        :auto="false"
                                        chooseLabel="Seleccionar imagen"
                                        class="mt-2"
                                    />
                                    <small class="p-error" v-if="errors.portada">{{ errors.portada[0] }}</small>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 flex justify-content-end">
                            <Button type="button" label="Cancelar" class="p-button-secondary mr-2" @click="$router.push('/admin/listas')" />
                            <Button type="submit" label="Guardar" :loading="loading" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useListas from "../../../composables/listas";

const router = useRouter();
const { storeLista, errors: listaErrors, loading } = useListas();
const errors = ref({});
const previewImage = ref(null);

const form = ref({
    nombre: '',
    descripcion: '',
    duracion_total: '00:00:00',
    portada: null
});

const onImageSelect = (event) => {
    form.value.portada = event.files[0];
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.value = e.target.result;
    };
    reader.readAsDataURL(event.files[0]);
    

    event.files = [];
};

const onError = (event) => {
    if (event.type === 'max-file-size') {
        errors.value.portada = ['El archivo excede el tamaño máximo permitido (2MB)'];
    }
};

const submitForm = async () => {
    try {
        errors.value = {};
        await storeLista(form.value);
        router.push("/admin/listas");
    } catch (e) {
        errors.value = listaErrors.value;
    }
};

onMounted(() => {
    
});
</script>