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
    async refreshToken(payload = {}, config = {}) {
        return await Api().post(`${prefix}/refresh`, payload, config)
    },
    async getRentmyToken(config = {}){
        return await Api().get('rentmy-access-token', config)
    },
    async getRentmyStoreTimeZone(config = {}){
        return await RentmyApi().get('timezones', config)
    },
    async getContents(config = {}){
        return await RentmyApi().get('contents', config)
    },
    async emailReset(payload = {}, config = {}) {
        return await Api().post(`${prefix}/forgot-password`, payload, config)
    },
    async passwordReset(payload = {}, config = {}) {
        return await Api().post(`${prefix}/reset-password`, payload, config)
    },
    async enable2FA(payload = {}, config = {}){
        return await Api().post(`${prefix}/generate-2fa-secret`, payload, config)
    },
    async disable2FA(payload = {}, config = {}){
        return await Api().post(`${prefix}/disable-2fa`, payload, config)
    },
    async verify2FAcode(payload = {}, config = {}){
        return await Api().post(`${prefix}/verify-2fa-token`, payload, config)
    },
    async get2FaQrCodeUrl(payload = {}, config = {}){
        return await Api().post(`${prefix}/2fa-qr-code-url`, payload, config)
    },
    async verifyToken(payload = {}, config = {}){
        return await Api().post(`${prefix}/verify-reset-password-token`, payload, config)
    }
  
    
}
