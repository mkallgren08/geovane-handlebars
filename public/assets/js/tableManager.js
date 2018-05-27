const tableManager = {
    // CREATES A ROW FOR THE TABLE
    createRow: function (data, j) {
        //console.log('Row data: ' + JSON.stringify(data, null, 2));
        let mainTableBody = $('#directionsTextBody');
        let newRow = $("<tr>");
        newRow.attr({
            class: "directionsText-row",
            id: "row" + j
        });

        // FINDS THE NUMBER OF <th> TAGS IN THE TABLE HEADER AND USES THAT NUMBER 
        // TO CREATE CELLS IN EACH ROW
        let tableCellNum = $("#directions-header-row").find(".directions-header").length;

        let testOutput = $("#directions-header-row").html()

        //console.log("the array of table header children is: " )
        //console.log(testOutput)
        //console.log("Number of children in header row: " + tableCellNum)
        //console.log(tableCellNum)

        for (let i = 0; i < tableCellNum; i++) {
            let newCell = this.createCell(data, j, i);
            //console.log("Created new cell")
            newRow.append(newCell);
            //console.log("Appending new cell")
        }

        mainTableBody.append(newRow)

    },
    // CREATES A CELL FOR THE TABLE
    createCell: function (data, j, i) {
        //console.log("Cell data: " + JSON.stringify(data, null, 2));
        let newCell = $('<td>');
        newCell.attr({
            class: "directionsText-cell",
        });

        let text = $("<p>");

        // Checks if data is found
        if (!data) {
            text.text("Data not found!")
            newCell.append(text)
            return newCell
        } else {
            switch (i) {
                // Set the directions
                case 0:
                    newCell.attr({
                        id: "row" + j + "-directions",
                    });

                    text.html(data.instructions)
                    newCell.append(text)

                    break;

                // Set the distance (km) - add a miles version in the future
                case 1:
                    newCell.attr({
                        id: "row" + j + "-distance",
                    });

                    text.text(data.distance.text)
                    newCell.append(text)

                    break;

                // Sets the intial weather (blank at first!)
                case 2:
                    newCell.attr({
                        id: "row" + j + "-weather",
                        class: "empty-weather"
                    });

                    //adds a loading symbol
                    newCell.append(this.insertLoadIcon())

                    break;
                // Sets the intial weather icon (blank at first!)
                case 3:
                    newCell.attr({
                        id: "row" + j + "-weatherIcon",
                        class: "empty-weatherIcon"
                    });

                    //adds a loading symbol
                    newCell.append(this.insertLoadIcon())

                    break;
                // Time display
                case 4:
                    newCell.attr({
                        id: "row" + j + "-time",
                    });

                    text.text(data.duration.text)
                    newCell.append(text)

                    break;
                case 5:
                    newCell.attr({
                        id: "row" + j + "-totalTime",
                    });

                    text.text("filler")
                    newCell.append(text)

                    break;
            }
            return newCell
        }
    },
    updateCell: function (targetRow, targetCell, data) {



    },
    updateWeatherCells: function (targetRow, data) {
        //console.log("Data that is throwing the process right now: " + JSON.stringify(data, null,2))
        //console.log("Weather Results: " + JSON.stringify(data,null,2))
        //console.log("Target row: " + targetRow)

        //UPDATE THE WEATHER CELL
        let weatherCellID = "#" + targetRow + "-weather"
        let weatherIconCellID = "#" + targetRow + "-weatherIcon"

        let Cell1 = $(weatherCellID);
        Cell1.empty();
        if (Cell1.attr('class') === "full-weather") {
            Cell1.switchClass('full-weather', 'empty-weather')
        };

        let tableWeather = data.weather[0].main
        Cell1.text(tableWeather)
        Cell1.switchClass('empty-weather', 'full-weather')

        //ADD A WEATHER ICON
        let Cell2 = $(weatherIconCellID)
        Cell2.empty();
        if (Cell2.attr('class') === "full-weatherIcon") {
            Cell2.switchClass('full-weatherIcon', 'empty-weatherIcon')
        };


        let iconcode = data.weather[0].icon
        let iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png"

        let newIcon = $("<img>");
        newIcon.attr({
            src: iconURL,
            alt: data.weather[0].description
        });

        Cell2.append(newIcon);
        Cell2.switchClass('empty-weatherIcon', 'full-weatherIcon');



    },
    clearTable: function () {
        $('#directionsTextBody').empty();
    },
    logHeaders: function () {
        let tableHeaders = $("#directions-header-row").children();

        console.log("tableHeaders: " + JSON.stringify(tableHeaders, null, 2));
    },
    insertLoadIcon: function () {
        let img = $('<img>');
        img.attr({
            alt: "Loading icon",
            src: "./assets/images/loading-icon.gif",
            style: "width: 30px; height: 30px",
            class: "loading-icon"
        });

        return img;
    },
    makeMarkedLocation: function (i, steps, totaltime) {
        let location = {};
        let lat = steps[i].start_location.lat()
        //console.log(lat)
        location.lat = lat;

        let lng = steps[i].start_location.lng()
        //console.log(lng)
        location.lng = lng;

        location.number = i;

        location.marker = true;

        location.time = totaltime;

        return location;
    },
    makeUnMarkedLocation: function (i, steps, totaltime) {
        let location = {};
        let lat = steps[i].start_location.lat()
        //console.log(lat)
        location.lat = lat;

        let lng = steps[i].start_location.lng()
        //console.log(lng)
        location.lng = lng;

        location.number = i;

        location.marker = false;

        location.time = totaltime;

        return location;
    }
};