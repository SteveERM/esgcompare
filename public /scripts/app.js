document.addEventListener('DOMContentLoaded', () => {
    setBuildDate(); // Set the build date on the screen
    loadProjects();
});

function setBuildDate() {
    const buildDate = new Date().toISOString();
    document.getElementById('build_date').innerText = `Build Date: ${buildDate}`;
}

async function loadProjects() {
    try {
        const response = await fetch('/projects');
        const projects = await response.json();
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

    try {
        const response = await fetch('/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ project, priority })
        });
        if (response.ok) {
            loadProjects();
        } else {
            console.error('Error adding project:', await response.text());
        }
    } catch (error) {
        console.error('Error adding project:', error);
    }
}
