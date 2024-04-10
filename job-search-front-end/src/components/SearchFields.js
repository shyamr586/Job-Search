import { Button, Grid, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

const SearchFields = (props) => {
    const [enteredCategory, setEnteredCategory] = useState("")
    const [enteredMinSalary, setEnteredMinSalary] = useState()
    const categories = [
        "Marketing",
        "Engineer",
        "Assistant"
    ]

    function handleClick(){
        props.setIsLoading(true)
        props.searchJobs(enteredCategory, enteredMinSalary).then(() => props.setIsLoading(false));
    }

  return (
    <div>
    {/* show the search fields that sets the values set by user */}
      <Grid container spacing={2}  height="20vh" display="flex" alignItems="center" justifyContent="center" width="100%" padding="20px">
        <Grid item xs={5}>
        <Select
            fullWidth
            label="Category"
            variant="outlined"
            value={enteredCategory}
            onChange={(e) => setEnteredCategory(e.target.value)}
        >
            {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                    {category}
                </MenuItem>
            ))}
        </Select>
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="Minimum Salary"
            variant="outlined"
            type="number"
            value={enteredMinSalary}
            onChange={(e) => setEnteredMinSalary(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} textAlign={'center'}>
          <Button style={{width:"100%", height:"100%"}} variant="contained" color="primary" onClick={()=>{handleClick()}}>
            Search
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default SearchFields