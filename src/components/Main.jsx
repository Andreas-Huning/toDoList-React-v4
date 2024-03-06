import React,{ useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../redux/mapStateToProps';
import mapDispatchToProps from '../redux/mapDispatchToProps';
import Table from './Table';
import TablePagination from './TablePagination';

function Main(props) {
    // console.log("Main",props);

    // Daten aus dem Formular
    const [toDoFormular, setToDoFormular] = useState({
        toDoListIdForm:null,
        toDoListNameForm:"",
        toDoListStatusForm:0,
        toDoListDateForm:"",
        toDoListCat:"0",
    })
    const [modus, setModus] = useState("Speichern")

    const [loginFormular,setLoginFormular] = useState({
        loginNameForm:"",
        loginPasswortForm:""
    })

    // Formularwerte aus den Inputfeldern setzen
    function handleInputName(e){     
        // console.log("handleInputName",e.target.name, e.target.value);
        setToDoFormular({
            ...toDoFormular,
            [e.target.name]: e.target.value
        })
        if(e.target.name === "toDoListCat" ){
            // console.log("toDoListCat - setCategorie",e.target.value);
            props.setCategorie(e.target.value)
        }
    }

    // Formularwerte aus den Login Inputfeldern setzen
    function handleInputLogin(e){     
        // console.log(e.target.name,e.target.value);
        setLoginFormular({
            ...loginFormular,
            [e.target.name]: e.target.value
        })
        // console.log(loginFormular);
    }

    // Login
    function login(e){
        e.preventDefault();
        // console.log(loginFormular);
        let loginData = {
            user:{
                userEmail: loginFormular.loginNameForm,
                userPassword: loginFormular.loginPasswortForm
            }
        }
        props.login(loginData)
        .then(()=>{
            // console.log("login Rückantwort");
            clearInputField()
            props.loadCategories()
        })
    }
    function logout(){
        // console.log("logout");
        let user={
            userToken: props.user.userToken
        };
        props.logout(user)
    }
    //Speichern / Hinzufügen der Formularwerte in die Datenbank
    function addToDo(e){
        e.preventDefault();
        // console.log(toDoFormular);

        // Eintrag hinzufügen
        if(modus === "Speichern"){
            let toDoData = {
                toDo: {
                    // Anpassen der Eigenschaften entsprechend der Datenstruktur
                    toDoListId: toDoFormular.toDoListIdForm,
                    toDoListName: toDoFormular.toDoListNameForm,
                    toDoListStatus: toDoFormular.toDoListStatusForm,
                    toDoListDate: toDoFormular.toDoListDateForm,
                    toDoListCat: toDoFormular.toDoListCat
                },
                userToken: props.user.userToken
            };
            // console.log(toDoData);
            props.addToDo(toDoData)
            .then(()=>{
                updateTableView();
            });
            // Formular leeren
            clearInputField()
        }// Eintrag hinzufügen END

        // Eintrag bearbeiten
        if(modus === "Update"){
            // console.log("addToDo-Update",e,toDoFormular);
            let toDoData = {
                toDo: {
                    // Anpassen der Eigenschaften entsprechend der Datenstruktur
                    toDoListId: toDoFormular.toDoListIdForm,
                    toDoListName: toDoFormular.toDoListNameForm,
                    toDoListStatus: toDoFormular.toDoListStatusForm,
                    toDoListDate: toDoFormular.toDoListDateForm,
                    toDoListCat: toDoFormular.toDoListCat
                }
            };
            props.editToDo(toDoData)
            .then(()=>{
                updateTableView();
            });
            clearInputField()
        }// Eintrag bearbeiten END
    }

    // Aufgabe zum bearbeiten in das Formular laden und Buttonbeschriftung anpassen 
    function editToDoItem(item){
        // console.log("editToDoItem",item);
        setToDoFormular({        
            toDoListIdForm:     item.toDoListId,
            toDoListNameForm:   item.toDoListName,
            toDoListStatusForm: item.toDoListStatus,
            toDoListDateForm:   item.toDoListDate,
            toDoListCat:        props.tableConfig.cat
        })
        setModus("Update")
    }

    // Formularfelder leeren
    function clearInputField(){
        // console.log("clearInputField");
        setToDoFormular({        
            toDoListIdForm:null,
            toDoListNameForm:"",
            toDoListStatusForm:0,
            toDoListDateForm:"",
            toDoListCat: props.tableConfig.cat
        })
        setModus("Speichern")
        setLoginFormular({
            loginNameForm:"",
            loginPasswortForm:""
        })
    }

    // Ansicht der Tabelle ändern (Anzahl an Reihen und Startpunkt)
    function updateTable(e){
        // console.log("updateTable-Name",e.target.name);
        // console.log("updateTable-Value",e.target.value);
        props.setConfig({
            [e.target.name]: e.target.value
        })
        updateTableView()
    }

    // Tabelle neu aus Datenbank laden
    function updateTableView(){
        // console.log("updateTableView");
        const toDoData = {
            toDo: { ...props.tableConfig
            },
            userToken: props.user.userToken
        }
        // console.log("updateTableView - toDoData",toDoData)
        props.updateToDoTable(toDoData);
    }

    useEffect(()=>{
        if(props.user.login){
        // console.log("useEffect - props.tableConfig",props.tableConfig)
        updateTableView()
        }
      },[props.tableConfig])
    
    return (
            <>
                <h1>To Do Liste</h1>
                {props.user.login ?
                    
                    <div className='container-main'>                        
                        <div className="todo-container">
                            <h2>Aufgabe oder Termin hinzufügen</h2> <span className='logout' onClick={logout}>Logout</span>
                            <form className="formular" onSubmit={(e)=>{addToDo(e)}}>
                                <input type='hidden' value={toDoFormular.toDoListIdForm || ''}/>
                                <input className='inputfield' required type="text" placeholder="Bitte Aufgabe hier eintragen" name="toDoListNameForm" value={toDoFormular.toDoListNameForm} onChange={(e)=>{handleInputName(e)}}/>
                                <input className='inputfield' type="number" min="0" max="100" placeholder='0' name="toDoListStatusForm" value={toDoFormular.toDoListStatusForm} onChange={(e)=>{handleInputName(e)}}/>
                                <input className='inputfield' type="datetime-local"  name="toDoListDateForm" value={toDoFormular.toDoListDateForm || ''} onChange={(e)=>{handleInputName(e)}}/>
                                <select className='inputfield' name="toDoListCat" onChange={(e)=>{handleInputName(e)}}>
                                    <option value="0" key="0">Bitte Kategorie auswählen </option>
                                    {
                                        props.categories.map((cat) => {
                                            return <option  value={cat.toDoCatId} key={cat.toDoCatId}>{cat.toDoCatName}</option>
                                        })
                                    }                              
                                </select>
                                <button disabled={!toDoFormular.toDoListNameForm || !toDoFormular.toDoListCat || toDoFormular.toDoListCat == "0" } >{modus}</button>                    
                            </form>
                            <div>
                                <button disabled={!toDoFormular.toDoListNameForm} onClick={clearInputField}>Felder leeren</button>  
                            </div>   

                        </div> 
                        {props.toDoList.length > 0 &&
                            <>
                                <div className='table-container'>
                                    <h2>Übersicht</h2>
                                    <label>{props.totalTableRows} Einträge gefunden</label>
                                    <TablePagination/>
                                    <Table updateTableView={updateTableView} editToDoItem={editToDoItem}/>
                                </div>  
                            </>
                        }                  
                    </div>
                :
                    <div className='container-main'>
                        <div className="todo-container">
                        <h2>Login</h2>
                        { props.user.message &&
                            <div className='infomation'>{props.user.message}</div>
                        }
                        
                        <form className="formular" onSubmit={(e)=>{login(e)}}>
                                <input type='hidden' value="loginForm"/>
                                <input className='inputfield' required type="text" placeholder="Bitte Name hier eintragen" name="loginNameForm" value={loginFormular.loginNameForm} onChange={(e)=>{handleInputLogin(e)}}/>
                                <input className='inputfield' required type="password" placeholder="Bitte Passwort hier eintragen" name="loginPasswortForm" value={loginFormular.loginPasswortForm} onChange={(e)=>{handleInputLogin(e)}}/>
                                <button disabled={!loginFormular.loginNameForm || !loginFormular.loginPasswortForm} >Anmelden</button>                    
                            </form>
                        </div>
                        
                    </div>
                }
            </>
        
            
        

        
        
    );
}

export default connect(mapStateToProps,mapDispatchToProps) (Main);