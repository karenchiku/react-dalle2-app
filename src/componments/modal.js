import { useState, useRef } from "react"


const Modal = ({setModalOpen, setSelectedImage, selectedImage, generateVariations}) => {
    const [error, setError] = useState(null)
    const ref = useRef(null)

    console.log('Modal selectedImage', selectedImage)
    console.log('Modal', )


    const closeModal = () => {
        setModalOpen(false)
        setSelectedImage(null)
    }

    const checkSize = () => {
        if(ref.current.width == ref.current.height ) {
            console.log(ref.current.width, ref.current.height)
            setError('Please select an image smaller than 256x256')
        }else {
            generateVariations()
        }
    }

    return (
        <div className ="modal">
            <div className="close-icon" onClick={closeModal}>X</div>
            <div>
                {selectedImage && <img ref = {ref} src={URL.createObjectURL(selectedImage)} alt="selected image" />}
            </div>
            <p>Size: {selectedImage.size/1024/1024}MB </p>
            <p>{error||"Image must be squar and size < 4MB"}</p>
            {!error && <button onClick={checkSize}>Generate</button>}
        </div>
    )
}

export default Modal