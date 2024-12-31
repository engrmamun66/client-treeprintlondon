import { AuthEndpoints } from './Auth';
import { FrontendEndpoints } from './Frontend'; 


/**
 * This file will help to show 
 * loader or loading... text bease on current API calling
 */

export const AllDeveloperDefinedEndPoints = {
    Auth: {...AuthEndpoints},
    Frontend: {...FrontendEndpoints},

}

/**
     * Check any API is calling or not
     * @param endPoints
     * @example 'Site:2' 
     * @example 'Site:2,3 '
     * @example 'Site:2,3|Company:3' etc...
     * @return Boolean
     * @Note Call this H.isPendingAnyApi('User:1,2|Auth:40')
    */
function isPendingAnyApi(endPoints){
    try {
        // return true
        if(!endPoints) return false
        let END_POINTS = State('response').endPoints
        let groups = endPoints?.split('|')
        let groupEndpoints = Object.keys(END_POINTS)
        let isMatched = false
        groups?.forEach(group => {
            let [prefix, keys] = group?.split(':')
            keys = keys.split(',')?.map(String)
            keys?.forEach(key => {
                let path = AllDeveloperDefinedEndPoints?.[prefix]?.[String(key)];
                if (!path?.endsWith('$')) {
                    path += '$';
                }
                let pattern = new RegExp(path);
                let is__matched = groupEndpoints?.some(end_point => {                   
                    // console.log({
                    //     [`endpoints_of_${prefix}`]: AllDeveloperDefinedEndPoints?.[prefix],
                    //     prefix,
                    //     keys,
                    //     key,
                    //     path,
                    //     end_point, 
                    //     pattern, 
                    // });                    
                    return pattern.test(end_point) === true;
                })
                if(is__matched == true){
                isMatched = true
                }
            }) 
        })
        return isMatched
        
        } catch (error) {
        return console.error(error);
    }
}

export default isPendingAnyApi