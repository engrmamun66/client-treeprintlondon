/**
 * All state is exported from here
 * State call example ► State('statename') 
 */
const State = (statename) => {
    switch (statename) {
        case 'auth':
            return useAuthState('auth').value
            break;
        case 'common':
            return useCommonState('common').value
            break; 
        case 'toaster':
            return useToasterState('toaster').value
            break; 
        case 'menu':
            return useMenuState('menu').value
            break;
        case 'response':
            return useResponseState('response').value
            break;
        case 'message':
            return useMessageState('message').value
            break;
        case 'rentmy':
            return useRentmyState('rentmy').value
            break;
        default:
            console.warn('composables/__index.js :: ' + statename + ' not found')
            break;
    }
}
export { State }
