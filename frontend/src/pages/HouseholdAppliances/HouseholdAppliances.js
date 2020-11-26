import React, { useEffect, useState } from 'react'
import PageHeader from '../../Components/PageHeader';
import InsertHouseholdApplianceForm from './InsertHouseholdApplianceForm';
import UpdateHouseholdApplianceForm from './UpdateHouseholdApplianceForm';
import House from "@material-ui/icons/House";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core'; 
import useTable from '../../Components/useTable';
import HouseholdAppliancesService from "../../services/householdAppliancesService";
import Controls from "../../Components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import Popup from "../../Components/Popup";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import Notification from '../../Components/Notification';
import ConfirmDialog from '../../Components/ConfirmDialog';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    {id: 'serialNumber', label: 'Serial Number'},
    {id: 'brand', label: 'Brand'},
    {id: 'model', label: 'Model'},
    {id: 'dateBought', label: 'Date Bought'},
    {id: 'status', label: 'Status'},
    {id: 'actions', label: 'Actions', disableSorting : true}
]

export default function HouseholdAppliances() {

    const retrieveHouseholdAppliances = async() => {
        await HouseholdAppliancesService.getAll()
            .then(response => {
                setRecords(response.data);                
            })
            .catch(e => {
                console.log(e);
            });
    };
    const [records, setRecords] = useState([])

    useEffect(() => {
        retrieveHouseholdAppliances();
    }, [])

    const createHouseholdAppliances = async(data) => {
        await HouseholdAppliancesService.create(data)
            .then(response => {
                retrieveHouseholdAppliances()
            })
            .catch(e => {
                console.log(e);
            });
    };

    const updateHouseholdAppliances=async(data)=>{
        await HouseholdAppliancesService.update(data.id, data)
        .then(response=>{
            retrieveHouseholdAppliances()
        }).catch(error=>{
          console.log(error);
        })
    }

    const deleteHouseholdAppliances=async(data)=>{
        await HouseholdAppliancesService.remove(data)
        .then(response=>{
            retrieveHouseholdAppliances()
        }).catch(error=>{
          console.log(error);
        })
    }

    const classes = useStyles();
    
    const [filterFn, setFilterFn] = useState({fn: items => { return items;}})
    const [openPopup, setOpenPopup] = useState(false)
    const [openPopup2, setOpenPopup2] = useState(false)
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title: '', subTitle: ''})
    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if(target.value==="")
                    return items;
                else
                    return items.filter(
                        x => x.serialNumber.toLowerCase().includes(target.value) || 
                        x.brand.toLowerCase().includes(target.value) ||
                        x.model.toLowerCase().includes(target.value) ||
                        x.dateBought.toLowerCase().includes(target.value) ||
                        x.status.toLowerCase().includes(target.value)
                    )
            }
        })
    }


    const addOrEdit = (householdAppliance, resetForm) => {

        if(householdAppliance.id === 0) {
            createHouseholdAppliances(householdAppliance);
        } else {
            updateHouseholdAppliances(householdAppliance);
        }
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setOpenPopup2(false)
        setNotify({
            isOpen: true,
            message: 'Submitted Successfully',
            type: 'success'
        })
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup2(true)
    }

    const onDelete = id => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen : false
        })

        deleteHouseholdAppliances(id);
        setNotify({
            isOpen: true,
            message: 'Deleted Successfully',
            type: 'error'
        })
    }

    return (
        <>
            <PageHeader
                title="Household Appliances"
                subTitle="Management System"
                icon={<House fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                
                <Toolbar>
                    <Controls.Input
                        label="Search Household Appliances"
                        className = {classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <Controls.Button
                        text="Add New"
                        variant = "outlined"
                        startIcon = {<AddIcon />}
                        className = {classes.newButton}
                        onClick = {() => setOpenPopup(true)}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item =>
                                (<TableRow key={item.id}>
                                    <TableCell>{item.serialNumber}</TableCell>
                                    <TableCell>{item.brand}</TableCell>
                                    <TableCell>{item.model}</TableCell>
                                    <TableCell>{item.dateBought}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick = {() => {openInPopup(item)}}    
                                        >
                                            <EditOutlinedIcon fontSize="small" />
                                        </Controls.ActionButton>
                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick = {() => { 
                                                setConfirmDialog({
                                                    isOpen:true,
                                                    title:'Are you sure to delete this record?',
                                                    subTitle:"You can't undo this operation",
                                                    onConfirm: () => { onDelete(item.id) }
                                                })
                                            }}    
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </Controls.ActionButton>

                                    </TableCell>
                                </TableRow>)
                                )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title = "Add New Household Appliance Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <InsertHouseholdApplianceForm
                    recordForEdit = {recordForEdit}
                    addOrEdit = {addOrEdit}
                    records = {records}
                />
            </Popup>
            <Popup
                title = "Update Existing Household Appliance Form"
                openPopup={openPopup2}
                setOpenPopup={setOpenPopup2}
            >
                <UpdateHouseholdApplianceForm
                    recordForEdit = {recordForEdit}
                    addOrEdit = {addOrEdit}
                    records = {records}
                />
            </Popup>
            <Notification 
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog 
                confirmDialog = {confirmDialog}
                setConfirmDialog = {setConfirmDialog}
            />
        </>
    )
}