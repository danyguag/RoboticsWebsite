function outreachInit() {
    retrieveAndParseData("news_entries", function(data) {
        setUpDevelopmentOutreach(data);
    });
}