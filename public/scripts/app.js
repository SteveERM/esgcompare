document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    loadProjects();
    loadCriteria();
    loadRespondents();
    createChart();
});

let resultsChart;

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.style.backgroundColor = "#777";
}

// Load projects, criteria, and respondents
async function loadProjects() {
    try {
        const response = await fetch('/projects');
        const projects = await response.json();
        const projectsBody = document.getElementById('projects_body');
        projectsBody.innerHTML = '';
        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td contenteditable="true">${project.Project}</td>
                <td contenteditable="true">${project.Priority}</td>
            `;
            projectsBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function loadCriteria() {
    try {
        const response = await fetch('/criteria');
        const criteria = await response.json();
        const criteriaBody = document.getElementById('criteria_body');
        criteriaBody.innerHTML = '';
        criteria.forEach(criterion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td contenteditable="true">${criterion.Name}</td>
                <td contenteditable="true">${criterion.Weight}</td>
            `;
            criteriaBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading criteria:', error);
    }
}

async function loadRespondents() {
    try {
        const response = await fetch('/respondents');
        const respondents = await response.json();
        const respondentsBody = document.getElementById('respondents_body');
        respondentsBody.innerHTML = '';
        respondents.forEach(respondent => {
            const row = document.createElement('tr');
            row.innerHTML = `<td contenteditable="true">${respondent.Name}</td>`;
            respondentsBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading respondents:', error);
    }
}

// Add new row functions
function addCriteriaRow() {
    const criteriaBody = document.getElementById('criteria_body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
    `;
    criteriaBody.appendChild(row);
}

function addRespondentRow() {
    const respondentsBody = document.getElementById('respondents_body');
    const row = document.createElement('tr');
    row.innerHTML = `<td contenteditable="true"></td>`;
    respondentsBody.appendChild(row);
}

// Commit changes
async function commitProjects() {
    const rows = document.querySelectorAll('#projects_body tr');
    const projects = Array.from(rows).map(row => {
        return {
            Project: row.cells[0].innerText,
            Priority: row.cells[1].innerText
        };
    });

    try {
        const response = await fetch('/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projects })
        });
        if (response.ok) {
            console.log('Projects updated successfully');
            loadProjects();
        } else {
            console.error('Error updating projects:', await response.text());
        }
    } catch (error) {
        console.error('Error updating projects:', error);
    }
}

async function commitCriteria() {
    const rows = document.querySelectorAll('#criteria_body tr');
    const criteria = Array.from(rows).map(row => {
        return {
            Name: row.cells[0].innerText,
            Weight: row.cells[1].innerText
        };
    });

    try {
        const response = await fetch('/criteria', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ criteria })
        });
        if (response.ok) {
            console.log('Criteria updated successfully');
            loadCriteria();
        } else {
            console.error('Error updating criteria:', await response.text());
        }
    } catch (error) {
        console.error('Error updating criteria:', error);
    }
}

async function commitRespondents() {
    const rows = document.querySelectorAll('#respondents_body tr');
    const respondents = Array.from(rows).map(row => {
        return { Name: row.cells[0].innerText };
    });

    try {
        const response = await fetch('/respondents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ respondents })
        });
        if (response.ok) {
            console.log('Respondents updated successfully');
            loadRespondents();
        } else {
            console.error('Error updating respondents:', await response.text());
        }
    } catch (error) {
        console.error('Error updating respondents:', error);
    }
}

async function submitAssessment() {
    // Logic to collect and submit the pairwise assessment data
    console.log('Submitting assessment...');
}

function createChart() {
    const ctx = document.getElementById('results_chart').getContext('2d');
    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Project Prioritization Results'
                }
            }
        }
    });
}

function displayResults(projects, respondents) {
    // Sample data for demonstration purposes
    const data = {
        labels: projects.map(p => p.Project),
        datasets: [
            {
                label: 'Criteria 1',
                data: projects.map(p => Math.random() * 100),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Criteria 2',
                data: projects.map(p => Math.random() * 100),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    resultsChart.data = data;
    resultsChart.update();
}

function adjustPriorities() {
    const priority1 = document.getElementById('priority_criteria1').value;
    const priority2 = document.getElementById('priority_criteria2').value;

    console.log('Adjusting priorities:', priority1, priority2);

    // Update chart data and refresh
    if (resultsChart) {
        resultsChart.data.datasets.forEach((dataset, index) => {
            if (index === 0) {
                dataset.data = dataset.data.map(value => value * (priority1 / 100));
            } else if (index === 1) {
                dataset.data = dataset.data.map(value => value * (priority2 / 100));
            }
        });
        resultsChart.update();
    }
}
