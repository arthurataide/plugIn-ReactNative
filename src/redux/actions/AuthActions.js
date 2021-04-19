import { SET_USER_AUTH, GET_USER_AUTH, CLEAR_USER_AUTH  } from '../Constants'

export const setAuth = (payload) => {
    return {
        type: SET_USER_AUTH,
        payload
    }
}
// export const getAuth = (payload) => {
//     return {
//         type: GET_USER_AUTH,
//         payload
//     }
// }
export const deleteAuth = () => {
    return {
        type: CLEAR_USER_AUTH,
    }
}