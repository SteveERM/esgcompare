document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    setBuildDate(); // Set the build date on the screen
    loadProjects();
});

function setBuildDate() {
    const buildDate = new Date().toISOString();
    document.getElementById('build_date').innerText = `Build Date: ${buildDate}`;
}

async function loadProjects() {
    console.log('Loading projects...');
    try {
        const response = await fetch('/projects');
        console.log('Response received:', response);
        const projects = await response.json();
        console.log('Projects:', projects);
        const table = document.getElementById('projects_table');
        table.innerHTML = '<tr><th>Project</th><th>Priority</th></tr>';
        projects.forEach(project => {
            const row = table.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.innerText = project.Project;
            cell2.innerText = project.Priority;
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function addProject() {
    const project = document.getElementById('project_name').value;
    const priority = document.getElementById('project_priority').value;
    const criteriaElements = document.querySelectorAll('.criteria');
    const criteria = Array.from(criteriaElements).map(el => el.value);

    console.log('Adding project:', project, priority, criteria);

    try {
        const response = await fetch('/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ project, priority, criteria })
        });
        if (response.ok) {
            console.log('Project added successfully');
            loadProjects();
        } else {
            console.error('Error adding project:', await response.text());
        }
    } catch (error) {
        console.error('Error adding project:', error);
    }
}

function addCriteria() {
    const criteriaContainer = document.getElementById('criteria_container');
    const newCriteria = document.createElement('div');
    newCriteria.innerHTML = `<input type="text" class="criteria" placeholder="Criteria ${criteriaContainer.children.length + 1}">`;
    criteriaContainer.appendChild(newCriteria);
}

async function addRespondent() {
    const name = document.querySelector('.respondent').value;
    console.log('Adding respondent:', name);

    try {
        const response = await fetch('/respondents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        if (response.ok) {
            console.log('Respondent added successfully');
        } else {
            console.error('Error adding respondent:', await response.text());
        }
    } catch (error) {
        console.error('Error adding respondent:', error);
    }
}

async function rankProjects() {
    console.log('Ranking projects...');
    const response = await fetch('/projects');
    const projects = await response.json();
    const respondents = Array.from(document.querySelectorAll('.respondent')).map(el => el.value);

    // For demonstration, we'll just log the respondents and projects
    console.log('Respondents:', respondents);
    console.log('Projects:', projects);

    // Logic for pairwise ranking and displaying results goes here
    displayResults(projects, respondents);
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

    const config = {
        type: 'bar',
        data: data,
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
    };

    const ctx = document.getElementById('results_chart').getContext('2d');
    new Chart(ctx, config);
}

function adjustPriorities() {
    const priority1 = document.getElementById('priority_criteria1').value;
    const priority2 = document.getElementById('priority_criteria2').value;

    console.log('Adjusting priorities:', priority1, priority2);

    // Update chart data and refresh
    const chart = Chart.getChart('results_chart');
    chart.data.datasets[0].data = chart.data.datasets[0].data.map(value => value * (priority1 / 100));
    chart.data.datasets[1].data = chart.data.datasets[1].data.map(value => value * (priority2 / 100));
    chart.update();
}
