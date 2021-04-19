import { SET_USER_AUTH, GET_USER_AUTH , CLEAR_USER_AUTH} from '../Constants';

const authenticationState = (state = [], action) => {
    switch (action.type) {
        case SET_USER_AUTH : 
            return [...state, action.payload]
        case CLEAR_USER_AUTH : 
            return state = []
    }
    return state
}

export default authenticationState