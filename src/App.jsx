import { useState, useRef } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:3000";

function App() {
  const [images, setImages] = useState([]);
  const imagesRef = useRef(null);
  const postToGet = useRef("");

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("post[title]", Date.now().toString());

    if (imagesRef.current && imagesRef.current.files) {
      for (let i = 0; i < imagesRef.current.files.length; i++) {
        formData.append("post[images][]", imagesRef.current.files[i]);
      }
      postData(formData);
    }
  };

  const postData = (formData) => {
    fetch(`${API_URL}/posts`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        getImages(data.id);
      })
      .catch((err) => console.log(err));
  };

  const getImages = (postId) => {
    fetch(`${API_URL}/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setImages(data.images || []);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      {/* upload form */}
      <form style={{ margin: "10px" }}>
        <input
          type="file"
          name="image"
          multiple
          ref={imagesRef}
          style={{ margin: "5px" }}
        />
        <button type="button" onClick={handleUpload}>
          Submit
        </button>
      </form>
      {/* Get images button */}
      <div style={{ margin: "10px" }}>
        <input
          type="number"
          ref={postToGet}
          placeholder="ID to retrieve"
          style={{ margin: "5px" }}
        />
        <button onClick={() => getImages(postToGet.current.value)}>
          Get Images
        </button>
      </div>
      {/* images */}
      <div className="images">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="uploaded"
            style={{ width: "200px", height: "200px", margin: "10px" }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
