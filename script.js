const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWearher]");
const usercontainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

let currentTab=userTab;
const API_KEY="168771779c71f3d64106d8a88376808a";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickTab){
    notFound.classList.remove("active");
    if(clickTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // if search from wala container is invisible then make it visible
           userInfoContainer.classList.remove("active");
           grantAccessContainer.classList.remove("active");
           searchForm.classList.add("active");
        }
        else{
           // phayle me search wala tab pe tha , aab your weather wala tab visit karna hai
           searchForm.classList.remove("active"); 
           userInfoContainer.classList.remove("active");
           // function for displaying my location weather ,so check local storage first for coordinates ,if we have saved them there
           getfromSessionStorage();
        }
    }
}
userTab.addEventListener('click',()=>{
     switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

// checks if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
       const coordinates= JSON.parse(localCoordinates);
       fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        if (!data.sys) {
            throw data;
        }
        notFound.classList.remove('active');
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchUserWeatherInfo);

    }
}
async function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[datacontryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-clouds]");

    //fetch values from  weatherInfo object and put it in UI elements
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity.toFixed(2)} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all.toFixed(2)} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        grantAccessButton.style.display = 'none';
    }
}
function showPosition(position){
     const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude
     };
     sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName===""){
        return;
    }
    else{
        fetchSearchInfo(cityName);
        searchInput.value="";
    }
});

async function fetchSearchInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data =await response.json();
        if (!data.sys) {
            throw data;
        }
        notFound.classList.remove("active");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
       
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
        errorBtn.addEventListener("click", fetchSearchInfo);

    }

}



