<template>
    <v-container>
        <div class="text-h4 font-weight-bold my-3">
            All Songs
        </div>
        <v-row>
            <v-col v-for="(el,idx) in data" :key="idx" cols="3">
                <v-card
            color="#385F73"
            theme="dark"
          >
            <v-card-title class="text-h5 mt-1">
              {{ el.Name }}
            </v-card-title>

            <v-card-subtitle>{{ el.Description }}</v-card-subtitle>

            <v-card-actions>
              <v-btn @click="download(el.Url)" prepend-icon="mdi-tray-arrow-down"  variant="text">
                Download
              </v-btn>
            </v-card-actions>
          </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue';
import fileDownload from 'js-file-download';
const store = useAppStore();

interface song{
  Name:string,
  Description:string,
  Url:string
}

const data = ref<Array<song>|null>(null);

onMounted(() =>{
  getSongs();
})
const getSongs =() =>{
  axios.get('http://localhost:4000/songs').then((res:any) =>{
   data.value = res.data;
  }).catch((err) => {console.log(err); store.showSnack(err,'error')})

}

const download =(name:string) =>{
  axios.post(`http://localhost:4000/download/${name}`,{
    headers:{
      'Content-Type': 'audio/mpeg',
    },
    responseType: 'arraybuffer',
  },).then((res:any) =>{
   store.showSnack('Song downloaded');
   const blob = new Blob([res.data], {
        type: 'audio/wav'
    })
    const url = URL.createObjectURL(blob);

    fetch(url)
        .then(res => res.blob())
        .then(blob => fileDownload(blob, name))
        .catch(e => console.log('ERROR DOWNLOADING AUDIO FILE'));
  }).catch((err) => {console.log(err); store.showSnack(err,'error')})

}
</script>