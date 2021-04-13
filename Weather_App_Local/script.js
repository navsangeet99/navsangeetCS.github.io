$(document).ready(function(){
  
  //GET location of our device with latitude and longitude by calling navigator
  navigator.geolocation.getCurrentPosition(success, error);
  
  function success(pos){ //if teh request is success and we get the data
    var lat = pos.coords.latitude; //latitude
    var long = pos.coords.longitude; //get longitude
    weather(lat, long); //send tht lat and long to our weather function
    
  }
  
  function error(){
    console.log("error");
  }
  
  function weather(lat, long){ //(lat, long)
    var URL = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${long}`; 
    /*lat=${lat}$lon=${long} ` put url in this`
  'https://fcc-weather-api.glitch.me/api/current? lat=53.70&lon=-1.24'*/
    
    
    $.getJSON(URL, function(data){
     console.log(data); 
      updateDOM(data);
        
    }); //make request to URL and do the stuff in function
  }
    
    //weather(); //take it out because it is called in our success function 
    
  function updateDOM(data){ 
    var city= data.name;
    var temp= Math.round(data.main.temp); //to round the temp to a whole number w/o decimal
    var desc= data.weather[0].description;
   var icon= data.weather[0].icon;
    var visi= data.visibility;
    var windSpeed= data.wind.speed;
    var humid= data.main.humidity;
    var feel= Math.round(data.main.feels_like);
    
   $("#city").html(city); //put city that we got back from the requesy and put in the html of our page 
    $("#temp").html(temp);//same for our temp
    $("#descrip").html(desc);
    $("#icon").attr("src",icon); //want to change our icon to the data we got back 
    $("#visi").html("Visibility: " + visi);
    $("#windspeed").html("Wind Speed: " + windSpeed);
    $("#humid").html("Humidity: "+ humid);
    $("#feels").html("Feels like: "+ feel);
    
}
});
