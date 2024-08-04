require('dotenv').config();
const http = require('http');
const url = require('url');
const axios = require('axios');
const querystring = require('querystring');

const apiKey = process.env.{
    "request": {
        "type": "City",
        "query": "San Francisco, United States of America",
        "language": "en",
        "unit": "m"
    },
    "location": {
        "name": "San Francisco",
        "country": "United States of America",
        "region": "California",
        "lat": "37.775",
        "lon": "-122.418",
        "timezone_id": "America/Los_Angeles",
        "localtime": "2019-09-03 05:35",
        "localtime_epoch": 1567488900,
        "utc_offset": "-7.0"
    },
    "current": {
        "observation_time": "12:35 PM",
        "temparature": 16,
        "weather_code": 122,
        "weather_icons": [
            "https://assets.weatherstack.com/images/symbol.png"
        ],
        "weather_descriptions": [
            "Overcast"
        ],
    "wind_speed": 17,
    "wind_degree": 260,
    "wind_dir": "W",
    "pressure": 1016,
    "precip": 0,
    "humidity": 87,
    "cloudcover": 100,
    "feelslike": 16,
    "uv_index": 0,
    "visibility": 16
    }
};

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <form action="/weather" method="post">
                <label for="city">Enter city:</label>
                <input type="text" id="city" name="city">
                <button type="submit">Get Weather</button>
            </form>
        `);
    } else if (req.method === 'POST' && req.url === '/weather') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { city } = querystring.parse(body);
            const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

            try {
                const response = await axios.get(apiUrl);
                const weatherData = response.data;

                if (weatherData.success === false) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`<p>Error: ${weatherData.error.info}</p><a href="/">Search again</a>`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                        <h1>Weather in ${weatherData.location.name}</h1>
                        <p>Temperature: ${weatherData.current.temperature}°C</p>
                        <p>Weather Descriptions: ${weatherData.current.weather_descriptions.join(', ')}</p>
                        <p>Humidity: ${weatherData.current.humidity}%</p>
                        <p>Wind Speed: ${weatherData.current.wind_speed} km/h</p>
                        <a href="/">Search again</a>
                    `);
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<p>Error fetching weather data. Please try again later.</p><a href="/">Search again</a>`);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Weather Information Service is running at http://localhost:${port}`);
});
