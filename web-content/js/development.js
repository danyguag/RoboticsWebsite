function developmentInit() {
    retrieveAndParseData("development_entries", function(data) {
        setUpDevelopmentOutreach(data);
    });
}