import React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../redux/mapStateToProps';
import mapDispatchToProps from '../redux/mapDispatchToProps';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

function TableRow(props) {
        // console.log("TableRow",props.element);
        

    function deleteItem(toDo){
        // console.log("deleteItem",toDo);
        let toDoData = {
            toDo: { toDo
            }
        }        
        props.deleteToDo(toDoData)
        .then(()=>{
            props.updateTableView();
        })
    }
    let dateFormatted= props.element.toDoListDate && (new Date(props.element.toDoListDate)).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'})


    return (
        <tr key={props.element.toDoListId}>       
            <td>{(props.index + 1)}</td> 
            <td>{props.element.toDoListId}</td> 
            <td>{props.element.toDoListName}</td> 
            <td><ProgressBar value={props.element.toDoListStatus}/> </td> 
            <td>{dateFormatted}</td> 
            <td>{props.element.toDoListDate&& <Timer data={{ date: props.element.toDoListDate }} onClick={()=>{EditItem(props.element.toDoListId)}}/>}</td>    
            <td ><img src="img/edit.png" alt="Editieren" className="delEditImage" onClick={()=>{props.editToDoItem(props.element)}}/></td>
            <td ><img src="img/del.png" alt="Löschen" className="delEditImage" onClick={()=>{deleteItem(props.element.toDoListId)}}/></td>       
        </tr>
    );
}

export default connect(mapStateToProps,mapDispatchToProps) (TableRow);