import axios from "axios";
import { useState } from "react";

export const Draw = () => {
  const [imageURL, setImageURL] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false)
  const REST_API_KEY = import.meta.env.VITE_KAKAO_KEY;

  const generatePic = () => {
    setLoading(true)
    axios.post(
      'https://api.kakaobrain.com/v2/inference/karlo/t2i',
      {
        version: 'v2.1',
        prompt: prompt,
        height: 600,
        width: 768,
      },
      {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      setImageURL(response.data.images[0].image);
      setLoading(false)
    }).catch(error => {
      console.error('Error fetching image:', error);
    });
  };

  return (
    <>
      <div className="drawContainer">
        Making an Image with prompt
        <input onChange={(e) => setPrompt(e.target.value)} placeholder="Type anything you want to make an image" />
        <button onClick={generatePic}>Generate Image</button>
        <div className="loading">
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
        </div>
        {imageURL ? <img src={imageURL} alt="Generated" /> : null}
      </div>
    </>
  );
};
