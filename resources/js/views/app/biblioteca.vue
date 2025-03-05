<template>
    <div class="biblioteca-top">
        <h1>Tu Biblioteca</h1>

        <i 
            class="pi pi-plus" 
            style="font-size: 2rem"
            @mouseover="isHovered = true"
            @mouseleave="isHovered = false"
            @click="visible = true; resetFormulario()"
        ></i>
    </div>



    <Dialog class="crearLista-modal" v-model:visible="visible" modal header="Crea una lista">
        <form @submit.prevent="enviarFormulario">
            <div class="row">
                <div class="config-imagenes col-md-4">
                    <!-- Imagen de perfil -->
                    <div class="imagen-crear-lista">
                        <img :src="PreviewImagenLista || '/images/placeholder1.jpg'" class="estilo_imagen">
                        <input type="file" @change="manejarImagenLista" accept="image/*" ref="archivoImagen" class="añadir_archivo" required>  
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="flex items-center gap-4 mb-4">
                        <FloatLabel variant="on">
                            <InputText class="crearLista-input" id="username"  v-model="listaData.nombre" required />
                            <label for="username">Nombre de la lista</label>
                        </FloatLabel>
                    </div>
                    <div class="flex items-center gap-4 mb-8">
                        <FloatLabel variant="on">
                            <Textarea class="crearLista-input" id="config-descripcion" rows="5" cols="30" style="resize: none" v-model="listaData.descripcion"  />
                            <label for="descripcion">Descripción</label>
                        </FloatLabel>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Guardar" @click="enviarFormulario" :disabled="!esFormularioValido"></Button>
            </div>
        </form>
    </Dialog>
</template>

<script setup>
    import { ref, reactive, computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import { authStore } from "@/store/auth.js";

    const visible = ref(false);
    const userPropio = authStore().user;
    const isHovered = ref(false);    
    const PreviewImagenLista = ref(null); 

    const imagenDataPerfil = reactive({ portada: null });

    const listaData = reactive({
        nombre: '',
        descripcion: '',
        portada: null,
        duracion_total: '00:00:00' 
    });



    const manejarImagenLista = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (PreviewImagenLista.value) {
                URL.revokeObjectURL(PreviewImagenLista.value);
            }
            listaData.portada = file;  
            PreviewImagenLista.value = URL.createObjectURL(file);
        }
    };


    const resetFormulario = () => {
        listaData.nombre = '';
        listaData.descripcion = '';
        listaData.portada = null;
        listaData.duracion_total = '00:00:00';
        PreviewImagenLista.value = null;
    };



    const esFormularioValido = computed(() => {
        return listaData.nombre.trim() !== '' && listaData.portada;
    });


    const enviarFormulario = async () => {
        try {
            const listaFormData = new FormData();
            listaFormData.append('nombre', listaData.nombre);
            listaFormData.append('portada', listaData.portada);
            listaFormData.append('duracion_total', listaData.duracion_total);

            if (listaData.descripcion.trim() !== '') {
                listaFormData.append('descripcion', listaData.descripcion);
            }

            await axios.post('/api/listas', listaFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Lista creada exitosamente');

            visible.value = false;  
            resetFormulario();     
        } catch (error) {
            console.error('Error:', error.response?.data);
        }
    };




</script>


<style scoped>

    .row {
        --bs-gutter-x: 1.5rem;
        --bs-gutter-y: 0;
        margin-right: calc(0* var(--bs-gutter-x)) !important; 
        margin-left: calc(0* var(--bs-gutter-x)) !important;
    }

    h2 {
        color: white;
        font-size: 2.3rem;
    }

    .biblioteca-top {
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: white;
    }

    .pi-plus {
        color: white;
        margin: 20px;
    }

    .pi:hover {
        cursor: pointer;
    }

</style>


<style>

    /* --- Modal --- */


    .crearLista-modal {
        background-color: #200834 !important;
        border: 1px solid purple !important;
        width: 550px !important;
        color: white !important;
    }

    .crearLista-input{
        background-color: #200834 !important;
        border: 1px solid #A855F7 !important;
        color: white !important;
    }

    #config-descripcion {
        height: 180px;
        width: 280px;
    }

    .crearLista-modal label {
        color: #F472B6 !important;
        background: transparent !important;
    }

    .crearLista-modal Button {
        background-color: #A855F7 !important;
        border: none !important;
        color: white !important;
    }

    .crearLista-imagene {
        display: flex;
        flex-direction: column;
    }

    .imagen-crear-lista{
        position: relative;
        width: 130px;
        height: 130px;
        border: 2px dashed #f472b5;
        overflow: hidden;
        flex-shrink: 0;
    }

    .estilo_imagen {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
    }

    .añadir_archivo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
</style>