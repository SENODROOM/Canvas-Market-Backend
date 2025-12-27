const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const WebSocket = require('ws');

const app = express();
const port = 1000;

app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve your static files
app.use(express.static('public'));

// WebSocket server
const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    // Send the latest element to the connected client when they join
    sendLatestElement(ws);

    // Handle WebSocket messages (if needed)
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });
});

app.get('/', async (req, res) => {
    try {
        // Fetch the latest element
        const latestElement = await fetchLatestElement();

        // Render the HTML file with the latestElement data
        const htmlContent = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
        const renderedHtml = htmlContent.replace('{{latestElement}}', JSON.stringify(latestElement));

        // Send the rendered HTML to the client
        res.send(renderedHtml);
    } catch (error) {
        console.error('Error rendering HTML:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/sell', upload.single('image'), (req, res) => {
    try {
        // Your existing code for handling image upload

        // Send a success response
        res.send('Image uploaded successfully!');

        // Notify all connected clients about the update
        broadcastLatestElement();
    } catch (error) {
        // Log the error for debugging
        console.error('Error uploading image:', error);

        // Send an error response
        res.status(500).send('Internal Server Error');
    }
});

mongoose.connect('mongodb://localhost:27017/ArtisticUnleashed', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ImageModel = mongoose.model('Image', {
    filename: String,
    createdAt: { type: Date, default: Date.now },
});

async function fetchLatestElement() {
    try {
        // Return the fetched element
        return await ImageModel.findOne().sort({ createdAt: -1 });
    } catch (error) {
        console.error('Error fetching latest element:', error);
        throw error;
    }
}

function sendLatestElement(ws) {
    fetchLatestElement()
        .then((latestElement) => {
            ws.send(JSON.stringify({ latestElement }));
        })
        .catch((error) => {
            console.error('Error sending latest element:', error);
        });
}

function broadcastLatestElement() {
    fetchLatestElement()
        .then((latestElement) => {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ latestElement }));
                }
            });
        })
        .catch((error) => {
            console.error('Error broadcasting latest element:', error);
        });
}

// Use setInterval to periodically update the latest element on the page
setInterval(broadcastLatestElement, 1000);





// Code for reading database throught Get.jsx

// Define a schema for your data
const ProductSchema = new mongoose.Schema({
    fname: String,
    femail: String,
    fmsg: String,
    fimg: String,
  });
  
  // Create a model based on the schema
const Products = mongoose.model('Products', ProductSchema);

  app.get('/api/Products', async (req, res) => {
    try {
      const data = await Products.find();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  });

