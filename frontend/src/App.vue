<template>
  <v-snackbar
      v-model="store.getIsShowSnack"
      
    >
      <span class="mr-3"><v-icon :color="store.type">mdi-{{store.type=='success'?'check':'alert-circle'}}</v-icon></span> {{store.snackText }}

      <template v-slot:actions>
        <v-btn
          color="error"
          variant="text"
          @click="store.IsShowSnack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from './store/app';

  const store = useAppStore();
</script>
