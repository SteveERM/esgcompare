document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    loadProjects();
    loadCriteria();
    loadRespondents();
});

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
