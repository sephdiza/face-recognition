import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import React, { useState } from 'react';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
  apiKey: '7b6cf7d7194642caab2dcbf647a2ce0c'
});

const particleOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

function App() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const img = document.getElementById('inputimage');
    const width = Number(img.width);
    const height = Number(img.height);
    return  {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  const onInputChange = (e) => {
    setInput(e.target.value)
    
  }

  const onBtnSubmit = () => {
    setImageUrl(input)
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => displayFaceBox(calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  const onRouteChange = (route) => {
    if (route === 'signout'){
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">
      <Particles     
        className='particles' 
        params={ particleOptions } 
       /> 
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      { route === 'home' 
      ? <div>
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={onInputChange} onBtnSubmit={onBtnSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
       : (
         route === 'signin'
         ? <Signin onRouteChange={onRouteChange}/>
         : <Register onRouteChange={onRouteChange} />
       ) 
      }
    </div>
  );
}

export default App;
