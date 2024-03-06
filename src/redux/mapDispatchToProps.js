import { LOAD,SETCONFIG, LOGIN, LOGOUT,LOADCAT,SETCAT } from './actionTypeStrings';
import { BASE_URL } from '../assets/baseURL'

const mapDispatchToProps = dispatch => {
  return {
    login:(user)=>{
      // console.log("login",toDo);
      let userJson = JSON.stringify({ action: "LOGIN", user: user });
      let url = `${BASE_URL}/toDoData.php`;

      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: userJson
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(userData => {
        // console.log("userData",userData); // Rückantwort vom Server mit der message
        dispatch({
          type: LOGIN,
          payload: userData
        });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
    },
    setConfig:(config)=>{
      // console.log("setConfig",config);
      dispatch({
        type: SETCONFIG,
        payload: config
      })
    },
    addToDo: (toDo) => {
      // console.log("addToDo",toDo);      
      const toDoJson = JSON.stringify({ action: "ADD", toDo: toDo });
      const url = `${BASE_URL}/toDoData.php`;
    
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: toDoJson,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data =>{
        // console.log("Antwort ADD", data);
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
      });
    },
    updateToDoTable: (toDo) => {
        const toDoJson = JSON.stringify({ action: "LOADCUSTOM", toDo: toDo });
        const url = `${BASE_URL}/toDoData.php`;    
        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: toDoJson,
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data =>{
          dispatch({
            type: LOAD,
            payload: data.data, // Nur die Daten, nicht die Gesamtanzahl
            totalCount: data.total // Die Gesamtanzahl der Datensätze
          });
        })
        .catch(error => {
          console.error("There was a problem with the fetch operation:", error);
          throw error; 
        });
      },
    deleteToDo:(toDo)=>{
      // console.log("deleteToDo",toDo);
      let toDoJson = JSON.stringify({ action: "DEL", toDo: toDo });
      let url = `${BASE_URL}/toDoData.php`;

      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: toDoJson
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(toDoData => {
        // console.log("toDoData",toDoData); // Rückantwort vom Server mit der message
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
    },
    editToDo: (toDo) => {
      // console.log("editToDo",toDo);
      const toDoJson = JSON.stringify({ action: "EDIT", toDo: toDo });
      const url = `${BASE_URL}/toDoData.php`;
    
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: toDoJson,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
      });
    },
    logout:(user)=>{
      // console.log("logout",user);
      const toDoJson = JSON.stringify({ action: "LOGOUT", user: user});
      const url = `${BASE_URL}/toDoData.php`;
    
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: toDoJson,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(toDoData => {
        // console.log("toDoData",toDoData); // Rückantwort vom Server mit der message
        dispatch({
          type: LOGOUT
        });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
      });
      
    },
    loadCategories: () => {
      // console.log("loadCategories");
      const toDoJson = JSON.stringify({ action: "LOADCAT" });
      const url = `${BASE_URL}/toDoData.php`;
    
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: toDoJson
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(categories => {
        // console.log("categories",categories); // Rückantwort vom Server mit der message
        dispatch({
                    type: LOADCAT,
                    payload: categories
                  });
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
    },
    setCategorie:(cat)=>{
      // console.log("setCategorie",cat);
      dispatch({
        type: SETCAT,
        payload: cat
      });
    }
  };
};

export default mapDispatchToProps;
