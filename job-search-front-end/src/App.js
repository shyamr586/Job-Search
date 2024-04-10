import React, { useEffect, useState } from 'react';
import { Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery, useTheme, Typography, CircularProgress, ThemeProvider } from '@mui/material';
import axios from 'axios';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import SearchFields from './components/SearchFields';

import './App.css';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [currJob, setCurrJob] = useState({});
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("All");
  const [minSalary, setMinSalary] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0)
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [searched, setSearched] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //getting data on first render
  useEffect(() => {
    const getData = async () => {
      try {
        const url = `http://localhost:3000/jobs/search/${page}/${encodeURIComponent(title)}/${minSalary}`;
        const response = await axios.get(url);
        setJobs(response.data);
        setCurrJob(response.data[0]);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getData();
  }, []);

  //getting data when the list is scrolled to the bottom and added to list to make endless scroll
  useEffect(() => {
    setIsLoadingMoreData(true);
    const fetchMoreItems = async () => {
      try {
        const url = `http://localhost:3000/jobs/search/${page}/${encodeURIComponent(title)}/${minSalary}`;
        const response = await axios.get(url);
        setJobs(prev => [...prev, ...response.data]);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchMoreItems().then(()=> setIsLoadingMoreData(false));
  }, [page]);

  //function to change the details displayed on the right column
  function changeCurrJob(i) {
    setCurrJob(jobs[i]);
    if (isMobile) {
      setShowJobDetail(true);
    }
  }

  const handleCloseJobDetail = () => {
    setShowJobDetail(false);
  };

  // search function which gets job from entered criterias
  const searchJobs = async (title,minSalary) => {
    setSearched(true)
    try {
      const url = `http://localhost:3000/jobs/search/1/${encodeURIComponent(title) ? title : "All"}${minSalary ? "/" + minSalary : ""}`;
      const response = await axios.get(url);
      setJobs(response.data);
      if (response.data){
        setCurrJob(response.data[0])
        setSelectedJobIndex(0)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SearchFields title={title} padding= "0" minSalary={minSalary} searchJobs={searchJobs} setIsLoading={setIsLoading}/>
      <Grid container spacing={3} style={{ height: '80vh', overflow: 'hidden', overflowX: "hidden", bottom: 0, position: 'absolute' }} className="container">
        
        {/* conditional rendering that shows only when there is a valid list of elements or else shows error message */}
        {currJob ?(<Grid item xs={12} sm={4} style={{ overflowY: 'auto', padding: '0px 8px 0px 30px', height: "100%"}} className="job-list">
          <JobList
            jobs={jobs}
            changeCurrJob={changeCurrJob}
            setPage={setPage}
            isLoadingMoreData={isLoadingMoreData}
            selectedJobIndex = {selectedJobIndex}
            setSelectedJobIndex = {setSelectedJobIndex}
            searched={searched}
            setSearched={setSearched}
          />
        </Grid>):(<Typography sx={{margin: "10px auto"}}>
          {isMobile && (isLoading?"Fetching data...":"Oops! There seems to be no results for your search criteria!")}
        </Typography>)
        }
        {isMobile && isLoading && (<CircularProgress />)}

        {/* for mobile view, show the right column as a pop up instead  */}
        {isMobile && currJob &&(
          <Dialog open={showJobDetail} onClose={handleCloseJobDetail} fullScreen>
            <DialogTitle>
                <Typography variant="h5">{currJob.title}</Typography>
                <Typography variant="subtitle1">{currJob.company_name}</Typography>
                <Typography variant="body2" color="textSecondary">{currJob.location}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <JobDetail job={currJob} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseJobDetail} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        )}

        {!isMobile && (
          <Grid item xs={12} sm={8} style={{ overflowY: 'auto', maxHeight: '100%', maxWidth: "100%", paddingTop: 0 }} className="job-detail">
            <JobDetail job={currJob} isLoading={isLoading}/>
          </Grid>
        )}

      </Grid>

    </ThemeProvider>
  );
};

export default App;
