const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ArtisticUnleashed', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ImageModel = mongoose.model('images', {
  filename: String,
  createdAt: { type: Date, default: Date.now },
});

async function fetchLatestElement() {
  try {
    latestElement = await ImageModel.findOne().sort({ createdAt: -1 });

    if (latestElement) {
      console.log('Most recently added element:', latestElement);

      // Access and use the filename property
      const filename = latestElement.filename;
      console.log('Filename:', filename);

      // Now you can use filename or any other property outside the block
    } else {
      console.log('No latestElement available.');
    }
  } catch (error) {
    console.error('Error fetching latest element:', error);
  }
}

// Call the function to initiate the process
fetchLatestElement();



