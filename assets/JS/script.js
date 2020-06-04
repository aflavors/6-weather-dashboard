// Initial array of locations
var locations = [];
var APIKey = "5ac6ffcaa85c9e2fcacb6fac2c601688";
var currentDay = moment().format('LL');

//Display Searched Locations
function renderLocationButtons() {
    $("#search-location-button-list").empty();
    locations.forEach(function(location){
        var newLocationButton = $("<button>");
        newLocationButton.text(location);
        newLocationButton.addClass("location-button btn btn-block btn-outline-secondary btn-group-vertical");
        $("#search-location-button-list").append(newLocationButton);

        for(var i=0; i < locations.length; i++){
            localStorage.setItem("searchedLocation", JSON.stringify(locations));
        }
    })
    
}
//Display Locations in localStorage
function renderSearchedLocations() {
    var lastSearchedLocation = localStorage.getItem("searchedLocation");
    if (lastSearchedLocation) {
        var displayButtons = JSON.parse(lastSearchedLocation);
    } else {
        var displayButtons = []
    }
    displayButtons.forEach(function(location){
        var newLocationButton = $("<button>");
        newLocationButton.text(location);
        newLocationButton.addClass("location-button btn btn-block btn-outline-secondary btn-group-vertical");
        $("#search-location-button-list").append(newLocationButton);
    });
}
//Run Functions
renderLocationButtons();
renderSearchedLocations();

//Add Location to Array and Render on List
$("#search-location-button").on("click", function(event){
    event.preventDefault();
    var locationInput = $("#search-location-input").val().trim();
    locations.push(locationInput);
    
// Render Updated List of Locations
    renderLocationButtons();
})

//Display Location Information
$(document).on("click", ".location-button", function(){
    $("#location-weather-view").empty();
    $("#location-forecast-view").empty();
    $("#five-day-div").show();
    
    var locationInputText = $(this).text();
    var locationQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + locationInputText + "&appid=" + APIKey;
    $.ajax({ // Current Weather API
        url: locationQueryURL,
        method: "GET"
    }).then(function(response){
        var locationName = $("<h1>");
        var iconImg = $("<img>");
        var currentDate = $("<p>");
        var temperature = $("<p>");
        var humidity = $("<p>");
        var windSpeed = $("<p>");
        var uvIndex = $("<p>");
        // Convert temperature to Farenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(locationName).text(response.name);
        $("#location-weather-view").append(locationName);
        $(iconImg).attr("src","http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
        $("#location-weather-view").append(iconImg);
        $(currentDate).text(currentDay); //Figure out Local Time
        $("#location-weather-view").append(currentDate);
        $(temperature).text("Temperature (F): " + tempF.toFixed(2));
        $("#location-weather-view").append(temperature);
        $(humidity).text("Humidity: " + response.main.humidity + "%");
        $("#location-weather-view").append(humidity);
        $(windSpeed).text("Wind Speed: " + response.wind.speed + " MPH");
        $("#location-weather-view").append(windSpeed);
        
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        // One Call API for UVI + 5-Day
        var locationQueryOneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

        $.ajax({
            url: locationQueryOneCall,
            method: "GET"
        }).then(function(response) {
            $(uvIndex).text("UV Index: " + response.current.uvi)
            $("#location-weather-view").append(uvIndex);
            // UV Index Scale Style
            if(response.current.uvi <= 3){
                $(uvIndex).addClass("btn-success");
            }
            if(response.current.uvi > 3 && response.current.uvi < 5){
                $(uvIndex).addClass("btn btn-warning");
            }
            else if(response.current.uvi > 5){
                $(uvIndex).addClass("btn btn-danger");
            }

            let forecastDates = [moment().add(1,'days').format('LL'), moment().add(2,'days').format('LL'), moment().add(3,'days').format('LL'), moment().add(4,'days').format('LL'), moment().add(5,'days').format('LL')];

            let forecastIcons = [response.daily[1].weather[0].icon, response.daily[2].weather[0].icon, response.daily[3].weather[0].icon, response.daily[4].weather[0].icon, response.daily[5].weather[0].icon];

            let forecastTemps = [response.daily[1].temp.day, response.daily[2].temp.day, response.daily[3].temp.day, response.daily[4].temp.day, response.daily[5].temp.day];

            let forecastHumidityPercents = [response.daily[1].humidity, response.daily[2].humidity, response.daily[3].humidity, response.daily[4].humidity, response.daily[5].humidity];

            for(let i=0; i < 5; i++){
                
                let newForecastCard = $("<div>");
                newForecastCard.addClass("card card-body col-lg-3");
                newForecastCard.attr("style", "width:12rem;");
                $("#location-forecast-view").append(newForecastCard);
                
                let forecastDate = $("<p>");
                forecastDate.text(forecastDates[i]);
                $(newForecastCard).append(forecastDate);

                let forecastIcon = $("<img>");
                forecastIcon.addClass("card-img-top");
                forecastIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastIcons[i] + "@2x.png");
                $(newForecastCard).append(forecastIcon);

                let forecastTemp = $("<p>");
                let forecastTempF = (forecastTemps[i] - 273.15) * 1.80 + 32;
                forecastTemp.text("Temperature (F): " + forecastTempF.toFixed(2));
                $(newForecastCard).append(forecastTemp);

                let forecastHumidityPercent = $("<p>");
                forecastHumidityPercent.text("Humidity: " + forecastHumidityPercents[i] + "%");
                $(newForecastCard).append(forecastHumidityPercent);
            }
        });
    })
})