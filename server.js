const PORT = 3002
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')

const app = express()
app.use(cors())
app.use(express.json())  //send the json from the frontend to the backend.

require('dotenv').config()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/upload'); // This will save the uploaded files to a folder named 'public'
    },
    filename: (req, file, cb) => {
        console.log('file', file);
        cb(null, Date.now() + '-' + file.originalname); // This will name the file as the current timestamp appended with the original filename
    }
});

const imageFileFilter = (req, file, cb) => {
    // Allowed file types (You can expand this list as per your needs)
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }

    cb(new Error('Only image files are allowed!'));
};

const upload = multer({ 
    storage: storage,
    fileFilter: imageFileFilter
}).single('file');

let filepath 

app.post('/images', async (req, res) => {
    
    const { message } = req.body;
    try{
    const options ={
        
        method: "POST",
        body: JSON.stringify({ 
            prompt: message,
            n:3,
            size: "1024x1024",
        }),
        
        headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
       }
    }
        const response = await fetch("https://api.openai.com/v1/images/generations", options);
        const data = await response.json();
        console.log(data)
        res.send(data.data)
        

    } catch (error) {
        console.log(error)
    }

})

app.post('/upload', async (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).send({ error: err.message });
        } else if (err) {
            return res.status(500).send({ error: err.message });
        }
        console.log(req.file)
        filepath = req.file.path
        res.json({message:"success"})
    })

})

app.post('/variation', async (req, res) => {
    try{
        
        const options ={
            method: "POST",
            body: JSON.stringify({
                image:fs.createReadStream(req.file.path),
                n:2,
                format:"1024*1024"}),
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            }
        }
        const response = await fetch("https://api.openai.com/v1/images/variations", options);
        const data = await response.json();
        res.send(data.data)

    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


