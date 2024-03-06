import React, {useState,useEffect} from 'react';
import { connect } from 'react-redux';
import mapDispatchToProps from '../redux/mapDispatchToProps'; 
import mapStateToProps from '../redux/mapStateToProps';

const TablePagination = (props) => {
  const tableConfig = props.tableConfig;
  const [isLastPage, setIsLastPage] = useState(false);

  const handlePreviousPage = () => {
    const newOffset = Math.max(0, tableConfig.offset - tableConfig.limit);
    props.setConfig({
        offset: newOffset
    })
  };

  const handleNextPage = () => {
    const newOffset = tableConfig.offset + tableConfig.limit;
    props.setConfig({
        offset: newOffset
    })
  };
  useEffect(() => {
    setIsLastPage(tableConfig.offset + tableConfig.limit >= props.totalTableRows);
  }, [props.tableConfig, props.totalTableRows]);


  return (
    <div>
      <button onClick={handlePreviousPage} disabled={tableConfig.offset === 0}>
        Vorherige Seite
      </button>

      <button onClick={handleNextPage} disabled={isLastPage}>
        Nächste Seite
      </button>
    </div>
  );
};

export default connect(mapStateToProps,mapDispatchToProps)  (TablePagination);