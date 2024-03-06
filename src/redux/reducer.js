import * as ACTIONS from './actionTypeStrings'

const initState = {
    toDoList: [],
    toDoInput:{},
    tableConfig: {
        limit:5,
        offset:0,
        cat:0,
    },
    user:{
        login: false,
        userToken:"",
        message:"",
        userName:""
    },
    categories:[],
    totalTableRows:0
}

const reducer = (state = initState, action) => {

    switch(action.type) {
        // LOGIN
        case ACTIONS.LOGIN:
            // console.log("ACTIONS.LOGIN",action.payload);
            
            if(action.payload['message'] == "Diese Logindaten sind gültig, Token in DB gespeichert"){
                return{
                    ...state,
                    user: {
                        ...state.user,
                            login: true,
                            userToken:action.payload['userToken'],
                            message: action.payload['message'],
                            userName: action.payload['userName']
                    }               
                }
            }else{
                return{
                    ...state,
                    user: {
                            login: false,
                            userToken:"",
                            message: action.payload['message'],
                            userName:""
                    }               
                }
            }
        // LOGOUT
        case ACTIONS.LOGOUT:
            return{
                ...state,
                user:{
                    login: false,
                    userToken:"",
                    message:"",
                    userName:""
                },
                toDoList: [],
                tableConfig: {
                    ...state.tableConfig,
                    limit:5,
                    offset:0
                }
            }
        // ToDoListe aus der DB laden
        case ACTIONS.LOAD:
            return{
                ...state,
                toDoList: action.payload,
                totalTableRows: action.totalCount
            }   
        // Kategorien aus der DB laden
        case ACTIONS.LOADCAT:
            // console.log("ACTIONS.LOADCAT",action.payload);
            return{
                ...state,
                categories:action.payload
            }
        // Kategorie setzen
        case ACTIONS.SETCAT:
            // console.log("ACTIONS.SETCAT",action.payload);
            return{
                ...state,
                tableConfig:{
                    ...state.tableConfig,
                    cat: action.payload,
                    offset:0
                }
            }
        // Tabellenconfig setzen
        case ACTIONS.SETCONFIG:
            // console.log("ACTIONS.SETCONFIG",action.payload);
            const key = Object.keys(action.payload)[0]
            const value = action.payload[key];
            // console.log("ACTIONS.SETCONFIG-key",key);
            if(key === "limit"){
                return {
                    ...state,
                    tableConfig:{
                        ...state.tableConfig,
                        limit: value,
                        offset:0
                    }
                }
            }
            if(key === "offset"){
                return {
                    ...state,
                    tableConfig:{
                        ...state.tableConfig,
                        offset: value
                    }
                }
            }
        default:
            return state  
    }
}

export default reducer