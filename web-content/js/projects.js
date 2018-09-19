function projectsInit() {
    retrieveAndParseData("project_entries", function(data) {
        setUpProjects(data);
    });
}