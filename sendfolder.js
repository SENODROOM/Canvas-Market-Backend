const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/ArtisticUnleashed', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the MongoDB model for the Image schema
const ImageModel = mongoose.model('images', {
  filename: String,
  createdAt: { type: Date, default: Date.now }, // Add this line for createdAt field
  // Add other fields as needed
});

const sourceFolder = './Images';
const destinationFolder = 'C:/Users/Hafsa Amin/Desktop/test/helloworld/src/Images/UploadedImages';

if (!fs.existsSync(sourceFolder)) {
    fs.mkdirSync(sourceFolder);
}

if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
}

fs.watch(sourceFolder, (eventType, filename) => {
    if (eventType === 'rename' && filename) {
        const sourceFilePath = path.join(sourceFolder, filename);
        const destinationFilePath = path.join(destinationFolder, filename);

        fs.rename(sourceFilePath, destinationFilePath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
            } else {
                console.log(`File moved: ${filename}`);
                
                // Save the filename and current timestamp to MongoDB
                const image = new ImageModel({ filename });
                image.save()
                    .then(() => console.log('File name saved to MongoDB'))
                    .catch(error => console.error('Error saving to MongoDB:', error));
            }
        });
    }
});

console.log(`Watching for changes in the ${sourceFolder} folder...`);

