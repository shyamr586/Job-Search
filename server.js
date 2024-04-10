const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors')

const app = express();
const port = 3000;

// Middleware to parse JSON bodies and cors to allow all hosts
app.use(bodyParser.json());
app.use(cors())

// the get method which will be used for loading the jobs
app.get('/jobs/search/:page/:title?/:minSalary?', async (req, res) => {
    //url containing API keys and sorted with latest first, currently searching jobs in gb only
    let url = `https://api.adzuna.com/v1/api/jobs/gb/search/${req.params.page}?app_id=22b68b75&app_key=1e57d912a4cf42d1597a21a37e355734&sort_by=date`
    const { title, minSalary } = req.params;
    //add to the url if it exists
    if (title && title !== 'All') {
        url += `&title_only=${title.toLowerCase()}`;
    } if (minSalary && minSalary!=undefined){
        url+=`&salary_min=${minSalary}`
    }
    let jobs_searched = []
    try {
        const response = await axios.get(url);
        const results = response.data.results;
        for (let i = 0; i < results.length; i++) {
            const job = results[i];
            let currency = "£"
            let salary_range = ""
            if (job.salary_min){
                salary_range+= currency+Math.round(job.salary_min)
            } if (job.salary_max && job.salary_min!=job.salary_max){
                salary_range = job.salary_min?salary_range+=" - "+currency+Math.round(job.salary_max):currency+Math.round(job.salary_max)
            }
            //return these values to be used in the frontend
            jobs_searched.push({
                "company_name": job.company.display_name,
                "location": job.location.display_name,
                "description": job.description,
                "title": job.title,
                "url": job.redirect_url,
                "salary_range": salary_range,
                "contract_type": job.contract_type,
                "contract_time": job.contract_time
            })
        }
        res.json(jobs_searched);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
