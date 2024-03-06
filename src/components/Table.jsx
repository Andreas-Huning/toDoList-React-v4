import React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../redux/mapStateToProps';
import mapDispatchToProps from '../redux/mapDispatchToProps';
import TableRow from './TableRow';


function Table(props) {
    // console.log("Table",props);
    let headlines=["Nr","Id","Aufgaben","Erledigt","Termin","Timer","",""];
    return (
        <table>
            <thead>
                <tr>
                    {
                        headlines.map((ele,index)=>{
                            return <th key={index}>{ele}</th>
                        })                            
                    }
                </tr>
            </thead>
            <tbody>
                <>
                    {
                        props.toDoList.map((ele,index)=>{
                            return <TableRow key={index} element={ele} index={index} updateTableView={props.updateTableView} editToDoItem={props.editToDoItem}/>
                        })                            
                    }
                </>
            </tbody>
        </table>
    );
}

export default connect(mapStateToProps,mapDispatchToProps) (Table);