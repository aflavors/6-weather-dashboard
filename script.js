// Initial array of locations
var locations = ["Charlotte,NorthCarolina", "Bujumbura,Burundi"];
var APIKey = "5ac6ffcaa85c9e2fcacb6fac2c601688";
// URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + APIKey;

var cltQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=Charlotte,NorthCarolina&appid=" + APIKey;
// Test AJAX Call
$.ajax({
  url: cltQueryURL,
  method: "GET"
}).then(function(response) {
    console.log(response);
    console.log(response.name)
});
//Test display locations
function renderLocationButtons() {
    $("#search-location-button-list").empty();
    locations.forEach(function(location){
        var newLocationButton = $("<button>");
        newLocationButton.text(location);
        newLocationButton.addClass("location-button");
        newLocationButton.addClass("btn");
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

    renderLocationButtons();
})