const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(fileUpload());

app.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const uploadedFile = req.files.file;

        // Convert the file data to a Blob object
        const fileBuffer = Buffer.from(uploadedFile.data, 'binary');
        const blob = new Blob([fileBuffer], { type: uploadedFile.mimetype });

        const formData = new FormData();
        formData.append('file', blob, uploadedFile.name);

        const response = await axios.post('http://127.0.0.1:8000/detect_object', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Response:', response.data);
        res.json({
            result: response.data.detected_object,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3002, () => {
    console.log('Server is running on port 3002');
});
