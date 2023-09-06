<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h1 class="text-h4 font-weight-bold">Song Base</h1>

      <div class="py-8" />

      <v-row class="d-flex align-center justify-center">
        <v-col cols="12">
          <v-btn
            color="primary"
            min-width="228"
            size="x-large"
            @click="openUploadModal"
            variant="flat"
          >
            <v-icon icon="mdi-tray-arrow-up" size="large" start />

            Upload A Song
          </v-btn>
        </v-col>
        <v-col cols="12">
          <div
            style="max-width: 20%; margin: auto auto; align-items: center"
            class="d-flex justify-center"
          >
            <v-divider></v-divider>
            <span class="mx-3">OR</span>
            <v-divider></v-divider>
          </div>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="primary"
            min-width="228"
            size="x-large"
            variant="flat"
            @click="$router.push({name:'Songs'})"
          >
            <v-icon icon="mdi-tray-arrow-down" size="large" start />

            Download Songs
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
    <v-dialog eager v-model="dialog" persistent width="1024">
      <v-card>
        <v-card-title class="mt-2">
          <span class="text-h5">Upload Song</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="name" label="Song Title" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="description" label="Song Description"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-card class="rounded-lg d-flex justify-center" style="border: 2px grey dashed;">
                  <form v-show="!song" action="/" id="my-form" class="dropzone pa-5">
                  </form>
                  <div v-if="song">
                    <v-card class="ma-5 bg-primary text-center" width="200" height="150">
                      <div class="mt-3 text-h6">
                        {{ song.name }}
                      </div>
                      <div class="mt-3">
                        {{ fileSize }} Mb
                      </div>
                      <v-btn class="mt-3 text-black" @click="song = null" >
                        Remove
                      </v-btn>
                    </v-card>
                  </div>
                </v-card>
               
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="uploadSong">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Dropzone from "dropzone";
import { onMounted } from "vue";
import { computed } from "vue";
import axios from 'axios';
import { useAppStore } from "@/store/app";
let myDropzone: any = null;

const store = useAppStore();

const dialog = ref(false);

const name = ref<any>('');
const description = ref<any>('');
const song = ref<any>(null);

const fileSize = computed(() => (song.value.size / (1024*1024)).toFixed(2) ?? null)

const openUploadModal = () => {
  dialog.value = true;
  if (!myDropzone) {
    myDropzone = new Dropzone("#my-form",{
      autoProcessQueue: false,
      dictDefaultMessage: "Upload your song here",
      addedfile: (file:any) => {
        song.value= file;
        console.log("my-file",song.value);
  }
    });
    
  }
};

const uploadSong =() =>{
  const form = new FormData();
  form.append('name',name.value);
  form.append('description',description.value);
  form.append('file',song.value);

  axios.post('http://localhost:4000/upload',form).then((res:any) =>{
    store.showSnack(res.data.message);close();
  }).catch((err) => {console.log(err); store.showSnack(err,'error')})

}

const close = () =>{
  dialog.value = false;
  song.value =null;
  name.value = null;
  description.value = null;

}

</script>
