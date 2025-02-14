<script setup>
import { useLayout } from '../composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>
<!-- layout-footer -->

<template>
    <section class="footer">
        <div class="contenidoFooter">   
            <img src="/images/logo.svg">
            <p>© Copyright Sonata 2025</p>
        </div>
    </section>
</template>
<style lang="scss" scoped>
.footer{
    background-color: black;
    
}


.contenidoFooter{
    display: flex;
    justify-content: flex-start;
    align-items: center;
   
}

.contenidoFooter p{
    font-size: 16px;
    color: white;
}


.contenidoFooter img{
   width: 120px; 
   background-image: cover;
}

</style>
