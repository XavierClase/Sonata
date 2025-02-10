<template>
    <div class="container-fluid d-flex justify-content-center align-items-center" id="register-body">
        <div class="row justify-content-center w-100">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm mx-auto">
                    <div class="card-header bg-transparent col-md-10">
                        <img src="/images/logo.svg" alt="">
                        <h1>Registro</h1>
                    </div>
                    <div class="card-body col-md-7">
                        <form @submit.prevent="submitRegister">
                            <div class="">
                                <!-- Email -->
                                <div class="mb-5">
                                    <label for="name" class="form-label">{{ $t('name') }}</label>
                                    <input v-model="registerForm.name" id="name" type="text" class="form-control" autofocus>
                                    <!-- Validation Errors -->
                                    <div class="text-danger mt-1">
                                        <div v-for="message in validationErrors?.name">
                                            {{ message }}
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-5">
                                    <label for="email" class="form-label">{{ $t('email') }}</label>
                                    <input v-model="registerForm.email" id="email" type="email" class="form-control" autocomplete="username">
                                    <!-- Validation Errors -->
                                    <div class="text-danger mt-1">
                                        <div v-for="message in validationErrors?.email">
                                            {{ message }}
                                        </div>
                                    </div>
                                </div>
                                <!-- Password -->
                                <div class="mb-5">
                                    <label for="password" class="form-label">
                                        {{ $t('password') }}
                                    </label>
                                    <input v-model="registerForm.password" id="password" type="password" class="form-control" autocomplete="current-password">
                                    <!-- Validation Errors -->
                                    <div class="text-danger-600 mt-1">
                                        <div v-for="message in validationErrors?.password">
                                            {{ message }}
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <label for="password_confirmation" class="form-label">
                                        {{ $t('confirm_password') }}
                                    </label>
                                    <input v-model="registerForm.password_confirmation" id="password_confirmation" type="password" class="form-control" autocomplete="current-password">
                                    <!-- Validation Errors -->
                                    <div class="text-danger-600 mt-1">
                                        <div v-for="message in validationErrors?.password_confirmation">
                                            {{ message }}
                                        </div>
                                    </div>
                                </div>

                                <div class="form-check">
                                    <label class="form-check-label" for="flexCheckIndeterminate">
                                        {{ $t('¿Quieres ser artista?') }}
                                    </label>
                                    <input class="form-check-input" type="checkbox" name="remember"  id="flexCheckIndeterminate">
                                </div>

                                <!-- Buttons -->
                                <div class="items-center justify-end mt-4" id="button-div">
                                    <button class="btn btn-primary" :class="{ 'opacity-25': processing }" :disabled="processing">
                                        {{ $t('register') }}
                                    </button>
                                    <p> ¿Ya tienes una cuenta? <router-link class="card-link" to="/login">{{ $t('Inicia sesión') }}</router-link> </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>

import useAuth from '@/composables/auth'

const { registerForm, validationErrors, processing, submitRegister } = useAuth();

</script>

<style scoped>
    #register-body {
        height: 100vh;
        background: linear-gradient(#262265, #200834);
    }

    .card {
        display: flex;
        align-items: center;
        background: linear-gradient(
            #633291 10%,
            #A855F7 70%
        ); 

        border-radius: 0;
    }

    .card-header {
        display: flex;
        align-items: center;
        flex-direction: column;
        border-bottom: 1.5px solid white;
        color: white;
        margin-bottom: 30px;
    }
    
    .card-header h1 {
        font-weight: bold;
    }

    .card-body label {
        color: white;
    }
    .card-body input {
        height: 42px;
        background-color: transparent;
        border: 1px solid white;
        border-radius: 0;
        color: rgb(255, 255, 255);
    }
    .card-body input:focus {
        box-shadow: none;
    }

    .form-label {
        margin-bottom: 0px;
    }

    .card-body button {
        height: 47px;
        width: 100%;
        border-radius: 12px;
        background: linear-gradient(135deg, #EC4899, #5B21B6);
        font-weight: bold;
        font-size: 1.5rem;
        border: none;
    }

    #button-div p{
        display: flex;
        gap: 20px;
    }

    .card-link {
        color: #50227a;
    }
    .card-link:hover {
        color: #683399;
        transition: 0.3s;
    }

    .form-check-input {
        height: 15px !important;
    }
</style>
