// Initial array of locations
var locations = ["Charlotte,NorthCarolina", "Bujumbura,Burundi"];
var APIKey = "5ac6ffcaa85c9e2fcacb6fac2c601688";
var currentDay = moment().format('LL');
// URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + APIKey;

var cltQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=Charlotte,NorthCarolina&appid=" + APIKey;

// Test AJAX Call
$.ajax({
  url: cltQueryURL,
  method: "GET"
}).then(function(response) {
    console.log(response);
    let lat = response.city.coord.lat;
    let lon = response.city.coord.lon;

    // Test Additional One Call with Response Lat/Lon
    var cltQueryURLOneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    $.ajax({
        url: cltQueryURLOneCall,
        method: "GET"
      }).then(function(response) {
          console.log(response);
          console.log(response.current.uvi) // UV Index
          console.log(response.daily);
      });
});
//Test display locations
function renderLocationButtons() {
    $("#search-location-button-list").empty();
    locations.forEach(function(location){
        var newLocationButton = $("<button>");
        newLocationButton.text(location);
        newLocationButton.addClass("location-button");
        newLocationButton.addClass("btn btn-block");
        newLocationButton.addClass("btn-outline-secondary");
        newLocationButton.addClass("btn-group-vertical");
        $("#search-location-button-list").append(newLocationButton);
    })
}
renderLocationButtons();

//Add Location to Array and Render on List
$("#search-location-button").on("click", function(event){
    event.preventDefault();
    var locationInput = $("#search-location-input").val().trim();
    locations.push(locationInput);
    console.log(locations);
// Render Updated List of Locations
    renderLocationButtons();
})

//Display Location Information
$(document).on("click", ".location-button", function(){
    $("#location-weather-view").empty();
    var locationInputText = $(this).text();
    var locationQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + locationInputText + "&appid=" + APIKey;
    $.ajax({ // Current Weather API
        url: locationQueryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var locationName = $("<h1>");
        var iconImg = $("<img>");
        var currentDate = $("<p>");
        var temperature = $("<p>");
        var uvIndex = $("<p>");
        // Convert temperature to Farenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        //Add 5 day forecast
        $(locationName).text(response.name);
        $("#location-weather-view").append(locationName);
        $(iconImg).attr("src","http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
        $("#location-weather-view").append(iconImg);
        $(currentDate).text(currentDay); //Figure out Local Time
        $("#location-weather-view").append(currentDate);
        $(temperature).text("Temperature (F): " + tempF.toFixed(2));
        $("#location-weather-view").append(temperature);
        

        let lat = response.coord.lat;
        let lon = response.coord.lon;

        // One Call API for UVI + 5-Day
        var locationQueryOneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

        $.ajax({
            url: locationQueryOneCall,
            method: "GET"
        }).then(function(response) {
            console.log(response.current.uvi) // UV Index
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
        });
    })
})