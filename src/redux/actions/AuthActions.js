import { USER_AUTH } from '../Constants'

export const setAuth = (payload) => {
    return {
        type: USER_AUTH,
        payload
    }
}