import Auth from '~/apis/Auth';
import { defineStore, acceptHMRUpdate } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    let error = ref({ type: 401, message: {email: [], password: []} })
    let loading = ref(false)
    let emailConfirm = ref(true)
    let passConfirm = ref(true)
    let qrCodeUrl = ref(null)
    async function login(payload = {}) {
        try {
            loading.value = true
            let response = await Auth.login(payload)
            console.log({response});
        } catch (err) {
             
        }
        
    }  
    
    async function logout() {
        try{
                loading.value = true
                let response = await Auth.logout()
                console.log({response});
            }catch(error){ 

            }
    }
        
    function resetCookies() {
        useCookie('access_token').value = null; 
    };

     
   
    return { login, logout }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}