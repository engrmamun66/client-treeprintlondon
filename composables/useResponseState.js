const Response = {
    isRentMy: function(response){
        const baseURL = response.config.baseURL;
        const is_rentmy = baseURL.indexOf('rentmy') > -1;
        return is_rentmy;
    },
    /**
     * 
     * @param {tt} >> tt = success | warning | error | system
     * @returns Boolean
     */
    isOk: function (response, {toaster = true, delay = 0, tt=null, smsg='', emsg=''}={}) { 
        try {
            /* -------------------------------------------------------------------------- */
            /*                            For Laravel Response                            */
            /* -------------------------------------------------------------------------- */
            const is_rentmy = Response.isRentMy(response);
            if (is_rentmy){
                /* -------------------------------------------------------------------------- */
                /*                             For RentMy Response                            */
                /* -------------------------------------------------------------------------- */
                if(toaster){
                    if (response.status == 200) {
                        if (response.data.status == 'OK') {
                            if(response.data.result?.message){
                                let message = response.data?.result?.message;
                                if(message){
                                    if (typeof message == 'string') {
                                        H.delay(() => Toaster[ tt || 'success' ](smsg || message), delay);
                                    } else if (Array.isArray(message)) {
                                        H.delay(() => Toaster[ tt || 'success' ](smsg || message?.join(', ')), delay);
                                    }
                                }
                            }                        
                        }
                        else if (response.data.status == 'NOK') {
                            {
                                let message = response.data?.result?.message;
                                if(message){
                                    if (typeof message == 'string') {
                                        H.delay(() => Toaster[ tt || 'error' ](emsg || message), delay);
                                    } else if (Array.isArray(message)) {
                                        H.delay(() => Toaster[ tt || 'error' ](emsg || message?.join(', ')), delay);
                                    }
                                }
                            }
                            {
                                let message = response.data?.result?.error;
                                if(message){
                                    if (typeof message == 'string') {
                                        H.delay(() => Toaster[ tt || 'error' ](emsg || message), delay);
                                    } else if (Array.isArray(message)) {
                                        H.delay(() => Toaster[ tt || 'error' ](emsg || message?.join(', ')), delay);
                                    }
                                }
                            }
                        }
                    }
                }
                return response.status == 200 && response.data.status == 'OK';
            } else {
                /* -------------------------------------------------------------------------- */
                /*                            For Laravel Response                            */
                /* -------------------------------------------------------------------------- */
                if (response.status == 200) {
                    if (response.data.success === true && (response.data.data || response.data.message) && toaster) {
                        if (typeof response.data.data == 'string') {
                            H.delay(() => Toaster[ tt || 'success' ](response.data.data), delay)
                        }
                        if (typeof response.data.message == 'string') {
                            H.delay(() => Toaster[ tt || 'success' ](smsg || response.data.message), delay)
                        }
                        if (typeof response.data.data == 'object' && Array.isArray(response.data.data)) {
                            response.data.data.forEach(msg => {
                                if(typeof msg === 'string')
                                H.delay(() => Toaster[ tt || 'success' ](smsg || msg), delay);
                            })
                        }
                    }
                    else if (response.data.message && toaster) {
                        if (typeof response.data.message == 'string') {
                            H.delay(() => Toaster[ tt || 'warning' ](emsg || response.data.message), delay)
                        }
                        if (typeof response.data.message == 'object' && Array.isArray(response.data.data)) {
                            response.data.message.forEach(msg => {
                                if(typeof msg === 'string')
                                H.delay(() => Toaster[ tt || 'warning' ](emsg || msg), delay);
                            })
                        }
                    }
                }
                return [200, 201].includes(response.status) && response.data.success === true;
            }
            /* -------------------------------------------------------------------------- */
            /*                              CakePHP response                              */
            /* -------------------------------------------------------------------------- */
            // code...

        } catch (error) {
            console.warn(error)
        }
    },
    parseData: function (response, skipCondition=false) {
        if(Response.isRentMy(response)){
            if(skipCondition) return response.data.result;
            // limit : "20" page_no : "1" total : 5 total_inventory : 5
            let is_paginate_response = ('data' in response.data.result) && ('limit' in response.data.result) && ('total' in response.data.result);
            if(response.data.result?.data && !is_paginate_response){
                return response.data.result?.data;
            } else {
                return response.data.result;
            }
        } else {
            // limit : 15 page_no : 1 status : 200 success : true total : 1
            let is_paginate_response = ('limit' in response.data) && ('page_no' in response.data) && ('total' in response.data);
            if(response.data?.data && !is_paginate_response){
                return response.data?.data;
            } else {
                return response.data;
            }
        }
    }
}



export { Response }

export default function () {
    return useState('response', () => ({
        pendings: {},
        endPoints: {},
    }))
}

