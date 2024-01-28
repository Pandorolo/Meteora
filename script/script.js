// Script for Meteora index page

// Declare the API key and the default locality
const myApiKey = "PML8RXBQ9394KZZPYMP6UEGW3";
let locality = "Roma";

// Ask data through VisualCrossing API's and send the data to manageData
function askData(loc) {
    locality = loc;
    $.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + locality + '/next7days?unitGroup=metric&include=days&key=' + myApiKey, manageData);
}

// Create 7 day cards
function manageData(data) {
    console.log(data);

    // Change the label based on location
    var localityLabel = document.getElementById("welcome-text");
    localityLabel.innerText = "Weather forecast for " + locality + ":";

    var daySection = document.getElementById("days");
    var hourlyTableSection = document.getElementById("hourly-table");

    // If the HTML inside the table is not empty
    // delete it
    if (daySection.innerHTML !== "" || hourlyTableSection.innerHTML !== "") {
        daySection.innerHTML = "";
        hourlyTableSection.innerHTML = "";
    }

    for (i = 0; i < 7; i++) {
        var date = data.days[i].datetime;
        var temp = data.days[i].temp;
        var tempmax = data.days[i].tempmax;
        var tempmin = data.days[i].tempmin;
        var icon = data.days[i].icon;

        createDayCard(i, date, temp, tempmax, tempmin, icon);
    }
}

// Create day card
function createDayCard(index, date, temp, tempmax, tempmin, icon) {
    // Find the section and create a div
    var section = document.getElementById("days");
    var day = document.createElement("div");
    day.setAttribute("class", "day-card");
    day.setAttribute("id", "day" + index);

    // Set the background image to the corrisponding icon
    day.style.backgroundImage = "url(src/" + icon + ".jpg)";

    // Create the date header and format it
    // based on the english date system
    var _date = document.createElement("h3");
    _date.setAttribute("class", "day-card-date");
    _date.textContent =  new Date(date).toLocaleDateString('en-EN', {weekday: 'short', day: 'numeric', month: 'short'});

    // Create the avarage temperature header through the day
    var _temp = document.createElement("h1");
    _temp.setAttribute("class", "day-card-avg-temp");
    _temp.textContent = temp;
    
    // Create the min/max temperatures paragraph
    var _minmax = document.createElement("p");
    _minmax.setAttribute("class", "day-card-minmax");
    _minmax.textContent = "H:" + tempmax + "°" + " / " + "L:" + tempmin + "°";

    // When clicked, call another API to get the hourly summary of the day
    // and send it to createHourlyTable
    day.onclick = function () {
        console.log(date);
        $.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + locality + '/' + date + 'T00:00:00?unitGroup=metric&key=' + myApiKey, createHourlyTable);
    }

    // Append the elements
    day.appendChild(_date);
    day.appendChild(_temp);
    day.appendChild(_minmax);
    section.appendChild(day);
}

// Create the hourly-summary table
function createHourlyTable(data) {
    console.log(data);

    // Locate the element
    var table = document.getElementById("hourly-table");
    var hours = data.days[0].hours;

    // If the HTML inside the table is not empty
    // delete it
    if (table.innerHTML !== "") {
        table.innerHTML = "";
    }

    // Create the legend row
    var legend = table.insertRow();
    legend.setAttribute("class", "table-legend");
    legend.insertCell().appendChild(document.createTextNode("Hour"));
    legend.insertCell().appendChild(document.createTextNode("Conditions"));
    legend.insertCell().appendChild(document.createTextNode("Temp (°C)"));
    legend.insertCell().appendChild(document.createTextNode("Feels like (°C)"));
    legend.insertCell().appendChild(document.createTextNode("Prec (mm)"));
    legend.insertCell().appendChild(document.createTextNode("Visibility (km)"));
    legend.insertCell().appendChild(document.createTextNode("Humidity %"));
    legend.insertCell().appendChild(document.createTextNode("Wind dir"));

    // For every hour create a row
    // Numbers are fixed to have just one decimal for clarity purposes 
    for (var i = 0; i < 24; i++) {
        // Insert a row in the table
        var row = table.insertRow();

        row.insertCell().appendChild(document.createTextNode(i.toString().padStart(2, "0") + ":00"));
        row.insertCell().appendChild(document.createTextNode(hours[i].conditions));
        row.insertCell().appendChild(document.createTextNode(hours[i].temp.toFixed(1) + "°"));
        row.insertCell().appendChild(document.createTextNode(hours[i].feelslike.toFixed(1) + "°"));
        row.insertCell().appendChild(document.createTextNode(hours[i].precip));
        row.insertCell().appendChild(document.createTextNode(Math.floor(hours[i].visibility)));
        row.insertCell().appendChild(document.createTextNode(hours[i].humidity.toFixed(1) + "%"));

        // Create the wind direction icon and rotate it
        var windDir = row.insertCell().appendChild(document.createElement("img"));
        windDir.src = "src/arrow.png";
        windDir.style.transform = "rotate(" + hours[i].winddir + "deg)";

        table.appendChild(row);
    }
}

askData(locality);