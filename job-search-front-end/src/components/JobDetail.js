import { Avatar, Button, Chip, CircularProgress, Divider, Grid, Typography, useMediaQuery, useScrollTrigger, useTheme } from '@mui/material'
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import React, { useEffect, useState } from 'react'

const JobDetail = (props) => {
    const [salaryLabel, setSalaryLabel] = useState(props.job?.salary_range||"")
    const [errMessage, setErrMessage] = useState("")

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    //sets the error msesage if there are no jobs found
    useEffect(() => {
        if (!props.job){
            setErrMessage("Oops! There seems to be no match for your search!")
        } else{
            setErrMessage("")
            // Function to update label based on screen size
                const updateLabel = () => {
                    const screenWidth = window.innerWidth;
                    if (screenWidth <= 800) {
                    // Set label for small screens
                    setSalaryLabel(props.job?.salary_range?.split("-")[0].trim()+"+");
                    } else {
                    // Set label for larger screens
                    setSalaryLabel(props.job?.salary_range);
                    }
                };
        
                // Initial update
                updateLabel();
        
                // Event listener for screen size changes
                window.addEventListener('resize', updateLabel);
        
                // Clean up event listener on component unmount
                return () => {
                    window.removeEventListener('resize', updateLabel);
                };
        }
    }, [props.job]);

  return (
    <>
        {errMessage === "" && !props.isLoading && (<Grid container>
            {/* Job Header */}
              {!isMobile &&(<Grid item xs={12} style = {{position: "sticky", top: 0, backgroundColor: "white", margin: 0, zIndex: 2, paddingLeft: "20px"}}>
                <Typography variant="h5">{props.job?.title}</Typography>
                <Typography variant="subtitle1">{props.job?.company_name}</Typography>
                <Typography variant="body2" color="textSecondary">{props.job?.location}</Typography>
                <Divider style={{ margin: '0' }} />
              </Grid>)}
              
              <Grid item xs={12} style={{ margin:0}}>
                <Grid container spacing={10} style={{ margin: '10px auto', padding: "10px 20px 0px 20px", maxWidth: "100%", textAlign: "center" }}>
                    {props.job?.salary_range &&
                    <Grid item xs={12} sm={4} style={{ padding: "0px 0px 10px 0px", zIndex: 1}}>
                        <Chip sx = {{backgroundColor: "#FFC57D"}}
                        avatar={<Avatar sx = {{backgroundColor: "transparent"}}><AttachMoneyOutlinedIcon/></Avatar>}
                        style={{ whiteSpace: 'nowrap', display: 'inline-flex' }} 
                        label={salaryLabel} />
                    </Grid>
                    }
                    {props.job?.contract_time &&
                        <Grid item xs={12} sm={4} style={{ padding: "0px 0px 10px 0px", zIndex: 1}}>
                        <Chip sx = {{backgroundColor: "#C5E1A5"}}
                        avatar={<Avatar sx = {{backgroundColor: "transparent"}}><ScheduleIcon/></Avatar>}
                        style={{ whiteSpace: 'nowrap', display: 'inline-flex'}} 
                        label={props.job?.contract_time.charAt(0).toUpperCase()+props.job?.contract_time.slice(1).replaceAll("_"," ")} />
                    </Grid>
                    }
                    {props.job?.contract_type &&
                    <Grid item xs={12} sm={4} style={{ padding: "0px 0px 10px 0px", zIndex: 1}}>
                        <Chip sx = {{backgroundColor: "#64B5F6"}}
                        avatar={<Avatar sx = {{backgroundColor: "transparent"}}><WorkHistoryOutlinedIcon/></Avatar>}
                        style={{ whiteSpace: 'nowrap', display: 'inline-flex'}} 
                        label={props.job?.contract_type.charAt(0).toUpperCase()+props.job?.contract_type.slice(1)} />
                    </Grid>
                    }
                </Grid>
                <Typography variant="body1" sx={{padding: isMobile?"10px 20px 0px 0px":"20px", textAlign: 'justify'}}>{props.job?.description}</Typography>
                {props.job?.url &&
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: isMobile&&"30px" }}>
                    <Button variant="contained" href={props.job?.url} target="_blank" style={{margin: "10px auto"}}> Apply Here </Button>
                </Grid>
                }
                
              </Grid>
          </Grid>
        )}
        {/* show laoding message, works when search operation is done */}
        {props.isLoading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography padding="10px"> Loading...</Typography>
                <CircularProgress size={24} />
            </div>)}
        {errMessage !== "" && !props.isLoading &&(
        <Grid container>
            <Grid item xs={12}>
                <Typography>
                    {errMessage}
                </Typography>
            </Grid>
        </Grid>
        )}
    </>
    
  )
}

export default JobDetail