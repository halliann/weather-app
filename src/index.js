// imports
import { SavedAreas } from './savedAreas.js';

// API info
const apiKey = 'b6ccca9010db8c2538605686e6b10f4e';

// search bar & form
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
// burger menu
const burgerBtn = document.getElementById('ham-btn');
const unList = document.getElementById('saved-areas-list');
const closeBtn = document.getElementById('close-btn');

// results display
const backgroundVideo = document.querySelector('.background-video');
const cardContents = document.querySelector('.card-contents');
const weatherDisplay = document.getElementById('weather-display');
const cityNameDisplay = document.getElementById('city-name');
const tempDisplay = document.getElementById('temp-display');
const iconDisplay = document.getElementById('icon-display');
const descDisplay = document.getElementById('desc-display');
const videoCred = document.getElementById('video-cred');
// favorite buttons
const saveBtn = document.querySelector('.save-btn');
const savedBtn = document.getElementById('saved-btn');
// timestamp
const timestamp = document.getElementById('timestamp-display');
const refreshBtn = document.getElementById('refresh-btn');

let savedList = [];

searchBtn.addEventListener('click', async event => {
    event.preventDefault();

    let city = cityInput.value;

    if(city === '') {
        alert('Please enter city.');
    } else {
        console.log(`Fetching weather data for ${city}.`);
        lastSearchedCity = city;
        getWeatherData(city);
        cardContents.classList.add('active');
        displayTime();
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    let response = await fetch(apiUrl);
    let data = await response.json();
    console.log(data);

    if(response.ok) {
        try {
            displayWeather(data);
        }
        catch(error) {
            console.error(error);
        }
    } 
};

// display weather data
function displayWeather(data) {
    let city = data.name;
    let temp = data.main.temp;
    let icon = data.weather[0].icon;
    let description = data.weather[0].description;

    cityNameDisplay.textContent = `${city}`;
    saveBtn.style.display = 'block';
    tempDisplay.textContent = `${Math.round(temp)}°F`;
    iconDisplay.src = `https://openweathermap.org/img/wn/${icon}.png`;
    descDisplay.textContent = description;
    
    console.log(city, temp, icon, description);

    if(savedList.includes(city)) {
        savedBtn.classList.add('fa-solid');
        cityNameDisplay.classList.add('saved-city');
    } else {
        savedBtn.classList.remove('fa-solid');
        cityNameDisplay.classList.remove('saved-city')
    }

    // changing background video display based on weather id
    function backgroundSelector(icon) {
        let sunnyIds = ['01d'];
        let cloudyIds = ['02d', '03d', '04d'];
        let rainyIds = ['09d', '10d', '50d'];
        let stormyIds = ['11d'];
        let snowIds = ['13d'];
        let nightClearIds = ['01n'];
        let nightCloudyIds = ['02n', '03n', '04n', '09n', '10n', '50n', '11n', '13n'];

        if(sunnyIds.includes(icon)) {
            backgroundVideo.src = '/resources/backgroundVideos/sun.mp4';
            videoCred.textContent = 
                'Video by Gusat Silviu: https://www.pexels.com/video/landscape-field-summer-sun-7861797/';
        } else if(cloudyIds.includes(icon)) {
            backgroundVideo.src = '/resources/backgroundVideos/cloudy.mp4';
            videoCred.textContent = 
                'Video by Magda Ehlers from Pexels: https://www.pexels.com/video/wild-grass-with-pink-flowers-in-full-bloom-3843103/';
        } else if(rainyIds.includes(icon)) {
            backgroundVideo.src = '/resources/backgroundVideos/rain.mp4';
            videoCred.textContent = 
                'Video by Brett Sayles: https://www.pexels.com/video/rainy-day-2059694/';
        } else if(stormyIds.includes(icon)) {
            backgroundVideo.src = '/resources/backgroundVideos/storm.mp4';
            videoCred.textContent = 
                'Video by Matias Luge: https://www.pexels.com/video/heavy-rain-falling-over-a-german-village-during-a-thunderstorm-13948020/';
        } else if(snowIds.includes(icon)) {
            backgroundVideo.src = '/resources/backgroundVideos/snow.mp4';
            videoCred.textContent = 
                'Video by Pixabay: https://www.pexels.com/video/video-of-snowfall-854881/';
        } else if(nightClearIds.includes(icon)) {
            backgroundVideo.src = '/resources/backgroundVideos/clearNight.mp4';
            videoCred.textContent = 
                'Video by Dmitry Varennikov: https://www.pexels.com/video/star-gazing-on-a-clear-starry-night-5382333/';
        } else if(nightCloudyIds.includes(icon)) {
            backgroundVideo.src = '/resources/backgroundVideos/cloudyNightSky.mp4';
            videoCred.textContent = 'Video by Mark Edwin Hedia: https://www.pexels.com/video/dark-clouds-formation-covering-the-moon-3654535/';
        } else  {
            backgroundVideo.src = '/resources/backgroundVideos/default.mp4';
        } 
    };

    backgroundSelector(icon);
};

// saving & unsaving cities
function saveOnClick() {
    saveBtn.addEventListener('click', () => {
        savedBtn.classList.toggle('fa-solid');
        cityNameDisplay.classList.toggle('saved-city');
    
        const city = cityNameDisplay.textContent;

        if(cityNameDisplay.classList.contains('saved-city')) {
                savedList.push(city);
                addSavedToMenu(city);
        } else {
            savedList = savedList.filter(savedCity => savedCity !== city);
            removeFromSavedMenu(city);
        }

        console.log('Saved cities:', savedList);
    });
};

saveOnClick();

function addSavedToMenu(city) {
    let newListItem = document.createElement('li');
    newListItem.textContent = city;
    unList.appendChild(newListItem);

    newListItem.addEventListener('click', () => {
        cityInput.value = city;
        getWeatherData(city);
        lastSearchedCity = city;
        cardContents.classList.add('active');
        displayTime();
    });

};

function removeFromSavedMenu(city) {
    let listItems = unList.getElementsByTagName('li');
    for(let item of listItems) {
        if(item.textContent === city) {
            unList.removeChild(item);
            break;
        }
    }
};

// timestamp
function displayTime() {
    const now = new Date();
    const currentDateTime = now.toLocaleString();
    timestamp.textContent = currentDateTime;
    refreshBtn.style.display = 'block';
};

// refresh search
let lastSearchedCity = '';

refreshBtn.addEventListener('click', () => {
    if(lastSearchedCity !== '') {
        console.log(`Refreshing weather data for ${lastSearchedCity}.`);
        getWeatherData(lastSearchedCity);
        displayTime();
    } else {
        alert('No city searched yet!');
    }
});

// menu display
burgerBtn.addEventListener('click', () => {
    burgerBtn.style.display = 'none';
    document.getElementById('saved-list-menu').style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    document.getElementById('saved-list-menu').style.display = 'none';
    burgerBtn.style.display = 'block';
});