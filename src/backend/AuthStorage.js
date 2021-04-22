import Storage from "./LocalStorage";
const KEY = "authentication"

const getAuthInfo = async () => {
    try{
        const data = await Storage.getAllDataForKey(KEY)
        // console.log("user-data")
        // console.log(data)
        if (data.length > 0){
            return data[0]
        }
    }catch(e){console.error(e)}
}

const saveAuthInfo = async (data) => {
    try{
        await Storage.save({key: KEY, id: data._id, data: data})
    }catch(e){console.error(e)}
}

const deleteAuthInfo = async () => {
    try{
        await Storage.clearMapForKey(KEY)
    }catch(e){console.error(e)}
}

export {
    getAuthInfo,
    saveAuthInfo,
    deleteAuthInfo
}