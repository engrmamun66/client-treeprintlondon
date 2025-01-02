const prefix = 'auth'

export const AuthEndpoints = {
    'login' : `${prefix}/login`,
    'logout' : `${prefix}/logout`,
}

export default {
    async login(payload = {}, config = {}) {
        return await Api({accessToken: false}).post(`${prefix}/login`, payload, config)
    },
    async logout(payload = {}, config = {}) {
        return await Api().post(`${prefix}/logout`, payload, config)
    },   
    
}
