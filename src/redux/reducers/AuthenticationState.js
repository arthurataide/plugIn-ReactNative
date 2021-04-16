import { USER_AUTH } from '../Constants';

const authenticationState = (state = false, action) => {
    switch (action.type) {
        case USER_AUTH : 
            return action.payload
    }
    return state
}

export default authenticationState