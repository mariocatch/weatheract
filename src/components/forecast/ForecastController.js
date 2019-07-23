import React, { Component } from 'react';
import ForecastList from './ForecastList';

const condition = id => {
  if (id >= 200 && id < 300) return 'thunderstorm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id === 800) return 'clear';
  if (id > 800) return 'cloudy';

  return 'unknown';
};

class ForecastController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forecast: {
        city: {},
        dates: {}
      }
    };
  }

  formattedDate(time) {
    const date = new Date(time * 1000);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  componentDidMount() {
    fetch(
      'https://cors-anywhere.herokuapp.com/https://samples.openweathermap.org/data/2.5/forecast/hourly?zip=94040&appid=06fac84e7834a80aa600d399404a3ffd'
    )
      .then(resp => resp.json())
      .then(json => {
        const forecast = {
          city: json.city,
          dates: json.list.reduce((map, obj) => {
            const key = this.formattedDate(obj.dt);
            const item = {
              hour: {
                time: obj.dt_txt.split(' ')[1],
                temperature: obj.main.temp,
                condition: condition(obj.weather[0].id)
              }
            };
            if (Object.keys(map).indexOf(key) === -1) {
              map[key] = new Array(item);
            } else {
              map[key].push(item);
            }
            return map;
          }, {})
        };

        this.setState({ forecast: forecast });
      });
  }

  render() {
    return <ForecastList forecast={this.state.forecast} />;
  }
}

export default ForecastController;
