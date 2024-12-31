import axios from 'axios'
import { addController, removeController, cancelAllRequests } from '~/utils/requestManager';

function fullURL(config) {
    return JSON.stringify(config?.params || []);
}

function endPoint(config) {
    try {
        return config.url //+ `<${config?.method}>`;
    } catch (error) {
        console.warn('endPoint', {config});
        navigateTo('/login');
        return '/not-found';
    }
}

function createApiHandler({accessToken = true, rentmy=false}={}) {
    let options = {
        baseURL: useRuntimeConfig()?.public?.[rentmy ? 'RENTMY_API_BASE_URL' : 'API_BASE_URL'],
        timeout: 0
    }
    
    if (accessToken){
        if(rentmy){
            options['headers'] = {                
                authorization: "Bearer" + " " +  useCookie('rentmy_access_token').value ,
                Location: useCookie("rentmy_location_id").value,
            }
        }else{
            options['headers'] = { authorization: "Bearer" + " " +  useCookie('access_token').value }
        }
    }
    let api = axios.create(options)
    let loader_timeout = 12000
    api.interceptors.request.use((config) => {
        if(config.formData === true){
            config.headers = { ...config.headers, ...{ "Content-Type": "multipart/form-data" }}
        }
        if (config.url != 'auth/logout') {
            authMethods.logoutIfExpireToken()
        }
        // With EagleEye Network
        if(config.baseURL == 'https://login.eagleeyenetworks.com'){
            delete config.headers?.authorization            
        }
        /* -------------------------------------------------------------- */
        /*           Page Loader Control With API response                */
        /* -------------------------------------------------------------- */
        // let sms_api = fullURL(config)?.match(/^message\/\d+/g)
     
        clearTimeout( State('response').pendings[fullURL(config)] )   
        State('response').endPoints[endPoint(config)] = true //Pusing in endPoints  
        if(config?.noLoader !== true){
            State('response').pendings[fullURL(config)] = setTimeout(() => {
                delete State('response').pendings[fullURL(config)];
                delete State('response').endPoints[endPoint(config)];
            }, loader_timeout);
        }        
   
        return config
    }, (error) => {
        return Promise.reject(error)
    })
    api.interceptors.response.use((response) => {
        /* -------------------------------------------------------------- */
        /*           Page Loader Control With API response                */
        /* -------------------------------------------------------------- */
        setTimeout(() => {
            delete State('response').pendings[fullURL(response.config)];
            delete State('response').endPoints[endPoint(response.config)];
        }, 100);
        return response
    }, (error) => {

        delete State('response').pendings[fullURL(error.config)];
        delete State('response').endPoints[endPoint(error.config)];
        
        return Promise.reject(error);
    })
    return api
}

 
function Api({accessToken=true}={}) {
    return createApiHandler({accessToken})
}

 

export { Api, Api2, RentmyApi }

