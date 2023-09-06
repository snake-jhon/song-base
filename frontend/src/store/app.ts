// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    IsShowSnack:false,
    snackText:'',
    type:'',
  }),
  getters:{
    getIsShowSnack:(state) => state.IsShowSnack,  
  },
  actions:{
    showSnack(text:string,type = 'success'){
      this.snackText = text;
      this.type = type;
      this.IsShowSnack = true;
    }
  }
})
