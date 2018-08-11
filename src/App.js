/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQA-p82X8r2TTgFdZTR7yUxlZIpH9l6kV3LiyhbSpS-oEqH81kyiyaKK3b5WJRteMxe8AZL_Rn3gwQ7vMMgiXv1_LGa0kYxo3v3HUJFpZVuqJnmmeAAb_iJZbuVEzeQG3AKkOQxDGLR1gwhAdeTOHg';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class AlbumCover extends Component {
    render() {
        let track = this.props.track;
        const src = track.album.images[0].url;
        return (<img src={src} style={{ width: 400, height: 400 }} />);
    }
}


class App extends Component {

  constructor() {
      super();
      this.state = {
          text: "",
          tracks: null,
          currentTrack: null,
          tracksLoaded: false
      };
  }

  componentDidMount() {
      this.setState({text: "Hello la famille !"});
      fetch('https://api.spotify.com/v1/me/tracks', {
          method: 'GET',
          headers: {
              Authorization: 'Bearer ' + apiToken,
          },
      })
          .then(response => response.json())
          .then((data) => {
              const randomIndex = getRandomNumber(data.items.length);
              const currentTrack = data.items[randomIndex];

              this.setState({
                  tracks: data.items,
                  tracksLoaded: true,
                  currentTrack: currentTrack,
              });
              console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
          })
  }

    checkAnswer(track) {
        if (track.track.id === this.state.currentTrack.track.id) {
            swal('Bravo !', 'Tu as gagné', 'success').then(this.getNewTrack());
        } else {
            swal('Essaye encore', 'Ce n’est pas la bonne réponse', 'error');
        }
    }

    getNewTrack() {
        const tracks = this.state.tracks;
        const randomIndex = getRandomNumber(tracks.length);
        const currentTrack = tracks[randomIndex];
        this.setState({
            currentTrack: currentTrack,
        })
    }

  render() {

      if (!this.state.tracksLoaded) {
          return (
              <div className="App">
                  <header className="App-header">
                      <img src={loading} className="App-loading" alt="loading"/>
                  </header>
              </div>
          );
      } else {


          const randomIndex1 = getRandomNumber(this.state.tracks.length);
          const randomIndex2 = getRandomNumber(this.state.tracks.length);

          const track0 = this.state.currentTrack;
          const track1 = this.state.tracks[randomIndex1];
          const track2 = this.state.tracks[randomIndex2];

          const tracks = [track0, track1, track2];
          const shuffledTracks = shuffleArray(tracks);

          return (
              <div className="App">
                  <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo"/>
                      <h1 className="App-title">{this.state.text}</h1>
                  </header>
                  <div className="App-images">
                      <AlbumCover track={track0.track}/>
                      <Sound url={track0.track.preview_url} playStatus={Sound.status.PLAYING}/>
                  </div>
                  <div className="App-buttons">
                      {
                          shuffledTracks.map(track => (
                              <Button onClick={() => this.checkAnswer(track)}>{track.track.name}</Button>
                          ))
                      }
                  </div>
              </div>
          );
      }
  }
}

export default App;
