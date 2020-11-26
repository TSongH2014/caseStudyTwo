import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';
import { useForm, Form } from '../../Components/useForm';
import Controls from "../../Components/controls/Controls";
import * as householdAppliancesService from "../../services/householdAppliancesService";

const initialFValues = {
    id: 0,
    serialNumber: '',
    brand: '',
    model: '',
    status: '',
    dateBought: new Date(),
}

export default function HouseholdAppliancesForm(props) {

    const { addOrEdit, recordForEdit, records } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('serialNumber' in fieldValues)
            temp.serialNumber = fieldValues.serialNumber ? "" : "This field is required."
        if ('brand' in fieldValues)
            temp.brand = fieldValues.brand ? "" : "This field is required."
        if ('model' in fieldValues)
            temp.model = fieldValues.model.length != 0 ? "" : "This field is required."
        if ('status' in fieldValues)
            temp.status = fieldValues.status.length != 0 ? "" : "This field is required."

        let data = Array.from(records)

        data.map(
            (item) => {

                if(item.serialNumber === (fieldValues.serialNumber) && item.brand === (fieldValues.brand) && item.model === (fieldValues.model)){
                    temp.serialNumber = "Duplicate Serial Number"
                    temp.brand = "Duplicate Brand"
                    temp.model = "Duplicate Model"
                }
            }
        )
        
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }


    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if(recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                        name="serialNumber"
                        label="Serial Number"
                        value={values.serialNumber}
                        onChange={handleInputChange}
                        error={errors.serialNumber}
                    />
                    <Controls.Input
                        label="Brand"
                        name="brand"
                        value={values.brand}
                        onChange={handleInputChange}
                        error={errors.brand}
                    />
                    <Controls.Input
                        label="Model"
                        name="model"
                        value={values.model}
                        onChange={handleInputChange}
                        error={errors.model}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controls.DatePicker
                        name="dateBought"
                        label="Date Bought"
                        value={values.dateBought}
                        onChange={handleInputChange}
                    />
                    <Controls.Select
                        name="status"
                        label="Status"
                        value={values.status}
                        onChange={handleInputChange}
                        options={householdAppliancesService.getStatusCollection()}
                        error={errors.status}
                    />
                    <div>
                        <Controls.Button
                            type="submit"
                            text="Submit"
                        />
                        <Controls.Button
                            text="Reset"
                            color="default"
                            onClick={resetForm}
                        />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}