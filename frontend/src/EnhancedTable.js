import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import {Modal, TextField, Button} from '@material-ui/core';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { format } from "date-fns";
import * as moment from 'moment'
import { Grid, } from '@material-ui/core';
import axios from 'axios';

import { baseUrl, usesStyles } from './CommonReusedMaterials';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'serialNumber', numeric: false, disablePadding: false, label: 'Serial Number' },
  { id: 'brand', numeric: true, disablePadding: false, label: 'Brand' },
  { id: 'model', numeric: true, disablePadding: false, label: 'Model' },
  { id: 'dateBought', numeric: true, disablePadding: false, label: 'Date Bought' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: true, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{backgroundColor:'LightGray'}}>
      <TableRow>
        {/* <TableCell padding="checkbox">
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          /> */}
        {/* </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  // numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  // onSelectAllClick: PropTypes.func.isRequired,
  // order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  // orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  
  const { numSelected } = props;

  const styleUses = usesStyles();

  return (
    <Toolbar
      className={clsx(styleUses.root, {
        [styleUses.highlight]: numSelected > 0,
      })}
    >
      {/* {numSelected > 0 ? (
        <Typography className={styleUses.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : ( */}
        <Typography className={styleUses.title} variant="h6" id="tableTitle" component="div">
          Household Appliances
        </Typography>
      {/* )} */}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : ( */}

      {/* )} */}
    </Toolbar>
  );
};

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

export default function EnhancedTable() {
  const styleUses = usesStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('dateBought');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setData]= React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = rows.map((n) => n.serialNumber);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, serialNumber) => {
    const selectedIndex = selected.indexOf(serialNumber);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, serialNumber);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (serialNumber) => selected.indexOf(serialNumber) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const [modalEdit, setModalEdit]= React.useState(false);

  const [modalDelete, setModalDelete]= React.useState(false);
  // const [age, setAge] = React.useState('');
  const [householdApplianceSet, setHouseholdAppliance] = React.useState({
    brand: "",
    model: "",
    serialNumber: "",
    dateBought: "",
    status: "",
    id: ""
  })

  const [errors, setErrors] = useState({
    brand: "",
    model: "",
    serialNumber: ""
  });
  
  const handleChange= (event) =>{
    const name = event.target.name;

    // setErrors({
    //   // brand: '',
    //   // model: '',
    //   // serialNumber: ''
    //   ...errors,
    //   [name]: event.target.value
    // });

    if(event.target.name == "brand" && event.target.value === '') {
      setDisable(event.target.value === '');
      // setErrors({brand: 'Brand is required!!!'})
    } else if(event.target.name == "model" && event.target.value === '') {
      setDisable(event.target.value === '');
      // setErrors({model: 'Model is required!!!'})
    } else if(event.target.name == "serialNumber" && event.target.value === '') {
      setDisable(event.target.value === '');
      // setErrors({serialNumber: 'Serial Number is required!!!'})
    } else {
      setDisable(false);
    }

    // if((event.target.name == "brand" && event.target.value !== '') && (event.target.name == "model" && event.target.value !== '') && (event.target.name == "serialNumber" && event.target.value !== '')) {
    //   setDisable(false);
    // }

    setHouseholdAppliance({
      ...householdApplianceSet,
      [name]: event.target.value
    });
  }
  
  // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // const handleChange2 = (event) => {
  //   setAge(event.target.value);
  // };

  const restHttpGetAll=async() => {
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data);
    })
    .catch(error=>{
      console.log(error);
    })
  }

  React.useEffect(() => {
    restHttpGetAll();
  }, [])

  const createModalBox=(row)=>{
    setHouseholdAppliance(row);
    setModalInsert(!modalInsert);
  }

  const updateModalBox=(row)=>{
    setHouseholdAppliance(row);
    setModalEdit(!modalEdit);
  }

  const deleteModalBox=(row)=>{
    setHouseholdAppliance(row);
    setModalDelete(!modalDelete);
  }

  const setModalEditing=()=>{
    setModalEdit(!modalEdit);
  }

  const setModalDeleting=()=>{
    setModalDelete(!modalDelete);
  }

  const setModalCreating=()=>{
    setModalInsert(!modalInsert);
  }

  const restHttpPut=async()=>{
    await axios.put(baseUrl+"/"+householdApplianceSet.id, householdApplianceSet)
    .then(response=>{
      var rowData= rows;
      rowData.map(householdAppliance=>{
        if(householdAppliance.id===householdApplianceSet.id){
          householdAppliance.brand=householdApplianceSet.brand;
          householdAppliance.model=householdApplianceSet.model;
          householdAppliance.serialNumber=householdApplianceSet.serialNumber;
          householdAppliance.dateBought=householdApplianceSet.dateBought;
          householdAppliance.status=householdApplianceSet.status;
        }
      });
      setData(rowData);
      setModalEditing();
    }).catch(error=>{
      console.log(error);
    })
  }

  const restHttpDelete=async()=>{
    await axios.delete(baseUrl+"/"+householdApplianceSet.id)
    .then(response=>{
      setData(rows.filter(householdAppliance=>householdAppliance.id!==householdApplianceSet.id));
      setModalDeleting();
    }).catch(error=>{
      console.log(error);
    })
  }

  const bodyEdit=(
    <div className={styleUses.modal}>
      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}> */}
      <h3>Edit existing Household Appliance</h3>
      <TextField className={styleUses.inputMaterial} label="Brand" name="brand" onChange={handleChange} value={householdApplianceSet&&householdApplianceSet.brand}/>
      <br />
      <TextField className={styleUses.inputMaterial} label="Model" name="model" onChange={handleChange} value={householdApplianceSet&&householdApplianceSet.model}/>          
      <br />
      <TextField className={styleUses.inputMaterial} label="Serial Number" name="serialNumber" onChange={handleChange} value={householdApplianceSet&&householdApplianceSet.serialNumber}/>
      <br />
      <TextField className={styleUses.inputMaterial} type="date" label="Date Bought" name="dateBought" onChange={handleChange} value={householdApplianceSet&&householdApplianceSet.dateBought}/>
        {/* <KeyboardDatePicker
            margin="normal"
            id="dateBought"
            label="Date Bought"
            format="yyyy-MM-dd"
            value={householdApplianceSet&&householdApplianceSet.dateBought}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'Date Bought',
            }}
        />
      </MuiPickersUtilsProvider> */}

      <br />
      {/* <FormControl className={styleUses.inputMaterial}>
      <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="Date Bought"
          id="dateBought"
          value={householdApplianceSet&&householdApplianceSet.status}
          onChange={handleChange2}
        >
          <MenuItem value={"New"}>New</MenuItem>
          <MenuItem value={"Old"}>Old</MenuItem>
          <MenuItem value={"Unused"}>Unused</MenuItem>
          <MenuItem value={"Sold"}>Sold</MenuItem>
        </Select>
      </FormControl> */}

      <FormControl className={styleUses.inputMaterial}>
        <InputLabel htmlFor="status">Status</InputLabel>
        <Select
          native
          value={householdApplianceSet.status}
          onChange={handleChange}
          inputProps={{
            name: 'status',
            id: 'status',
          }}
        >
          <option aria-label="None" value="" />
          <option value={"New"}>New</option>
          <option value={"Old"}>Old</option>
          <option value={"Unused"}>Unused</option>
          <option value={"Sold"}>Sold</option>
        </Select>
      </FormControl>

      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>restHttpPut()}>Update</Button>
        <Button onClick={()=>setModalEditing()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyDelete=(
    <div className={styleUses.modal}>
      <p>Are you sure you want to remove this Household Appliance? <b>{householdApplianceSet && householdApplianceSet.brand}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>restHttpDelete()}>Remove</Button>
        <Button onClick={()=>setModalDeleting()}>Cancel</Button>
      </div>
    </div>
  )

  const [modalInsert, setModalInsert]= useState(false);

  // const handleSubmit = e => {
  //   // e.preventDefault();
  //   const name = e.target.name;

  //   console.log("Test");

  //   setErrors({
  //     // brand: '',
  //     // model: '',
  //     // serialNumber: ''
  //     ...errors,
  //     [name]: e.target.value
  //   });

  //   setHouseholdAppliance({
  //     ...householdApplianceSet,
  //     [name]: e.target.value
  //   });

  //   if(e.target.name == "brand" && e.target.value == "") {
  //     setErrors({brand: 'Brand is required!!!'})
  //   }

  //   if(e.target.name == "model" && e.target.value == "") {
  //     setErrors({model: 'Model is required!!!'})
  //   }

  //   if(e.target.name == "serialNumber" && e.target.value == "") {
  //     setErrors({serialNumber: 'Serial Number is required!!!'})
  //   }


  //   // if (e.brand = ""){
  //   //   errors.brand = true;
  //   //   // restHttpPost();
  //   //   //   resetForm();
  //   // }
  // }




  // const handleChange2= (event) =>{
  //   const name = event.target.name;
  //   setErrors({
  //     // brand: '',
  //     // model: '',
  //     // serialNumber: ''
  //     ...errors,
  //     [name]: event.target.value
  //   });

  //   setHouseholdAppliance({
  //     ...householdApplianceSet,
  //     [name]: event.target.value
  //   });

  //   if(event.target.name == "brand" && event.target.value == "") {
  //     setErrors({brand: 'Brand is required!!!'})
  //   }

  //   if(event.target.name == "model" && event.target.value == "") {
  //     setErrors({model: 'Model is required!!!'})
  //   }

  //   if(event.target.name == "serialNumber" && event.target.value == "") {
  //     setErrors({serialNumber: 'Serial Number is required!!!'})
  //   }

  //   console.log(event.target.name);

  //   // if(event.target.value == "") {
  //   //   setErrors({brand: 'Brand is required!!!'})
  //   //   setErrors({model: 'Model is required!!!'})
  //   // }

    

  // }

  // const [inputVal, setInputVal] = useState('')
  const [disable, setDisable] = useState(true);


  const modalBodyInsert=(
    <div className={styleUses.modal}>
        <h3>Create new Household Appliance</h3>
        <TextField 
            className={styleUses.inputMaterial} 
            label="Brand" 
            name="brand"
            onChange={handleChange}
            // onChange={handleChange}
            required
            // error={Boolean(errors?.brand)}
            // helperText={(errors?.brand)}
            // value={inputVal} onChange={e => setInputVal(e.target.value)}
        />
        <br />
        <TextField 
            className={styleUses.inputMaterial} 
            label="Model" 
            name="model" 
            onChange={handleChange}
            required
            // error={Boolean(errors?.model)}
            // helperText={(errors?.model)}
        />          
        <br />
        <TextField 
            className={styleUses.inputMaterial} 
            label="Serial Number" 
            name="serialNumber"
            onChange={handleChange}
            required
            // error={Boolean(errors?.serialNumber)}
            // helperText={(errors?.serialNumber)}
        />
        {/* <TextField name="email" helperText={errors.email ? intl.formatMessage({ id: errors.email.message }) : ''} error={errors.email ? true : false} /> */}
        <br /><br />
        <div align="right">
            <Button color="primary" disabled={disable} onClick={()=>restHttpPost()}>Create</Button>
            <Button onClick={()=>setModalCreating()}>Cancel</Button>
        </div>
    </div>
  )
  const restHttpPost=async()=>{
    await axios.post(baseUrl, householdApplianceSet)
    .then(response=>{

        setData(rows.concat(response.data));
        // console.log(rows.concat(response.data.dateBought));

        // var formattedDate = format(response.data.dateBought, "MMMM do, yyyy H:mma");
        // console.log(formattedDate);
        // console.log(response.data);
        setModalCreating();
        // window.location.reload();
    }).catch(error=>{
        console.log(error);
    })
  }

  const [modalSearch, setModalSearch]= React.useState(false);

  const searchModalBox=()=>{
    setModalSearch(!modalSearch);
  }

  const restHttpSearch=async()=>{
    await axios.get(baseUrl + "/search", { params: householdApplianceSet })
    .then(response=>{
      setData(response.data);
      searchModalBox();
      // console.log(response.data)
    }).catch(error=>{
      console.log(error);
    })
  }

  const modalBodySearch=(
    <div className={styleUses.modal}>
      <h3>Search Filter</h3>
      <TextField className={styleUses.inputMaterial} label="Brand" name="brand" onChange={handleChange}/>
      <br />
      <TextField className={styleUses.inputMaterial} label="Model" name="model" onChange={handleChange}/>          
      <br />
      <TextField className={styleUses.inputMaterial} label="Serial Number" name="serialNumber" onChange={handleChange}/>
      <br />
      <TextField className={styleUses.inputMaterial} label="Date Bought" name="dateBought" onChange={handleChange}/>
      <br />
      <TextField className={styleUses.inputMaterial} label="Status" name="status" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>restHttpSearch()}>Search</Button>
        <Button onClick={()=>searchModalBox()}>Cancel</Button>
      </div>
    </div>
  )

  return (
    <div className={styleUses.root2}>
      <Paper className={styleUses.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />    
        <Tooltip title="Create new Household appliance">          
          <IconButton aria-label="add" className={styleUses.addButton} onClick={(event) => createModalBox(rows)}>
            <AddIcon />
          </IconButton>
        </Tooltip> 

        <Tooltip title="Search filter">
          <IconButton aria-label="search filter" onClick={()=>searchModalBox()}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>   

        <Tooltip title="Refresh the table listing">          
          <IconButton aria-label="add" className={styleUses.addButton} onClick={()=>restHttpGetAll()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip> 

        <TableContainer>
          <Table
            className={styleUses.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={styleUses}
              // numSelected={selected.length}
              // order={order}
              // orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  // const isItemSelected = isSelected(row.serialNumber);
                  // const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.serialNumber)}
                      // role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.serialNumber}
                      // selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell> */}
                      {/* <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.serialNumber}
                      </TableCell> */}
                      <TableCell align="left">{row.serialNumber}</TableCell>
                      <TableCell align="right">{row.brand}</TableCell>
                      <TableCell align="right">{row.model}</TableCell>
                      <TableCell align="right">{row.dateBought}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right">
                      
                        <div>
                        
                          <Tooltip title="Update Household Appliance">
                              <IconButton aria-label="update" onClick={(event) => updateModalBox(row)}>
                              
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          <Tooltip title="Remove Household Appliance">
                            <IconButton aria-label="delete" onClick={(event) => deleteModalBox(row)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> 

    <Modal
    open={modalEdit}
    onClose={setModalEditing}>
      {bodyEdit}
    </Modal>

    <Modal
        open={modalDelete}
        onClose={setModalDeleting}>
          {bodyDelete}
        </Modal>

        <Modal
          open={modalInsert}
          onClose={setModalInsert}>
          {modalBodyInsert}
        </Modal>

        <Modal
          open={modalSearch}
          onClose={searchModalBox}>
          {modalBodySearch}
        </Modal>
    </div>
  );
}