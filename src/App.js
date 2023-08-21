import { useState } from 'react'
import Modal from './componments/modal'

const App = () => {
  const supriselist = [
    'create a traditional Chinese black and white brush painting which has Capture a landscape of towering mountains shrouded in mist and clouds, with a river snaking its way through the valleys below.',
    'create a traditional Chinese black and white brush painting which has Illustrate a flock of wild geese flying against a backdrop of a setting sun, representing transitions and the change of seasons.',
    'create a traditional Chinese black and white brush painting which has Depict a bamboo forest with the shadows of the tall bamboo canes casting intricate patterns on the ground as they sway in the wind.'
  ]
  const [prompt, setPrompt] = useState(null);
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const supriseMe = () => {
    setImages(null);
    const randonValue = supriselist[Math.floor(Math.random() * supriselist.length)];
    setPrompt(randonValue);
  }

  const generateImages = async () => {
    setImages(null);

    if (prompt === null) {
      setError('Please enter a description');
    }else{
      setError(null)
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: prompt
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
      const response = await fetch('http://localhost:3002/images', options)
      const data = await response.json()
      setImages(data)


    } catch (err) {
      console.log(err)
    }
  }

  const uploadImage = async (e) => {
    // console.log(e.target.files[0])

    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setSelectedImage(e.target.files[0])
    setModalOpen(true)
    e.target.value = null;

    const options = {
      method: "POST",
      body: formData
    }

    try {
      const response = await fetch('http://localhost:3002/upload', options)
    } catch (err) {
      console.log(err)
    }

  }

  const generateVariations = async () => {

    setImages(null);
    if(selectedImage === null) {
      setError('Error Must upload an image')
      setModalOpen(false)
    }
    try {
      const options = {
        method: "POST"
      }
      const response = await fetch('http://localhost:3002/variation', options)
      const data = await response.json()
      setImages(data)
      setError(null)
      setModalOpen(false)

    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="app">
      <section className="search-section">
        <p>Start with a detailed description
          <span className="suprise" onClick={supriseMe}>Suprise me</span>
        </p>
        <div className="input-container">
          <input placeholder="An matisse style shark on the telephon" value={prompt} onChange={(e) => { setPrompt(e.target.values) }}></input>
          <button onClick={generateImages}>Generate</button>
        </div>
        <p className='extra-info'>Or,
          <span>
            <label htmlFor='files'> upload an images </label>
            <input type="file" accetp='image/*' id="files" hidden onChange={uploadImage}></input>
          </span>
          to edit.
        </p>
        <p>{error}</p>
      { modalOpen &&
       <div className="overlay">
          <Modal 
            setModalOpen = {setModalOpen} 
            setSelectedImage = {setSelectedImage} 
            selectedImage = {selectedImage}
            generateVariations ={generateVariations}
            />
        </div>
        
      }
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={image.description}>
          </img>
        ))}
      </section>
    </div>
  );
}

export default App;
