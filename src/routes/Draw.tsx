import React, { useEffect, useState } from "react";
import axios from "axios";

export const Draw = () => {
  const [imageURL, setImageURL] = useState('');

  const REST_API_KEY = 'a1cc0d588fdc21b6976481dad9b2c226';

  const t2i = async (prompt : string, negativePrompt:string) => {
    try {
      const response = await axios.post(
        'https://api.kakaobrain.com/v2/inference/karlo/t2i',
        {
          model: 'v2.1',
          prompt: prompt,
          negative_prompt: negativePrompt,
          height: 1024,
          width: 512
        },
        {
          headers: {
            "Authorization": `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  const handleGenerateImage = async () => {
    const prompt = 'A photo of a cute tiny monster on the beach, daylight';
    const negativePrompt = '';

    const response = await t2i(prompt, negativePrompt);
    if (response && response.images && response.images.length > 0) {
      const imageSrc = response.images[0].image;
      setImageURL(imageSrc);
    } else {
      console.error('No image found in response');
    }
  };

  return (
    <div>
      <button onClick={handleGenerateImage}>Generate Image</button>
      {imageURL && <img src={imageURL} alt="Generated" />}
    </div>
  );
}
