import { CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';

const JobList = (props) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  //scroll to top when list changes on search
  useEffect(() => {
    if (props.searched){
      const container = containerRef.current;
      if (container) {
        container.scrollTop = 0;
      }
    }
    props.setSearched(false)
  }, [props.jobs]);

  const handleClick = (index) => {
    props.setSelectedJobIndex(index);
    props.changeCurrJob(index);
  };
  

  function handleScroll() {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight && !props.isLoadingMoreData) {
        props.setPage(prev=>prev+1)
      }
    }
  }

  return (
    <List ref={containerRef} style={{height: "80vh", maxWidth: "100%", overflow: 'auto', margin:0, padding: 0}}>
        {props.jobs.map((job, i) => (
            <ListItem button key={i} onClick={() => handleClick(i)} style={{ 
              backgroundColor: props.selectedJobIndex === i? 'lightblue' : 'inherit' ,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Example box-shadow
              borderRadius: '4px', // Optional: Add border-radius for rounded corners
              }}>
              <ListItemText primary={job.title} secondary={job.company_name}/>
            </ListItem>
        ))}
        {props.isLoadingMoreData && (
          <ListItem key="loading" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="body1" style={{ marginRight: "8px", padding: "10px" }}>Fetching data...</Typography>
          <CircularProgress size={24} />
        </ListItem>
        )}
    </List>
  );
};

export default JobList;
