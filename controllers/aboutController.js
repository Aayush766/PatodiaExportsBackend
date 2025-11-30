// controllers/aboutController.js
const About = require('../models/aboutModel');
const cloudinary = require('cloudinary').v2;

// Get current About (single document)
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne({});
    if (!about) {
      // If not exist, create with default values so you always have something
      about = await About.create({});
    }
    res.status(200).json(about);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create or update About (single document)
exports.upsertAbout = async (req, res) => {
  try {
    let about = await About.findOne({});
    const isNew = !about;

    const {
      sectionTitle,
      mainTitle,
      shortDescription,
      visionTitle,
      visionDescription,
      missionTitle,
      missionDescription,
      detailParagraphs,
      stats,
    } = req.body;

    const updateData = {};

    if (sectionTitle !== undefined) updateData.sectionTitle = sectionTitle;
    if (mainTitle !== undefined) updateData.mainTitle = mainTitle;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (visionTitle !== undefined) updateData.visionTitle = visionTitle;
    if (visionDescription !== undefined) updateData.visionDescription = visionDescription;
    if (missionTitle !== undefined) updateData.missionTitle = missionTitle;
    if (missionDescription !== undefined) updateData.missionDescription = missionDescription;

    // detailParagraphs + stats come as JSON strings from form-data
    if (detailParagraphs !== undefined) {
      try {
        updateData.detailParagraphs = JSON.parse(detailParagraphs);
      } catch (err) {
        console.error('Invalid detailParagraphs JSON');
      }
    }

    if (stats !== undefined) {
      try {
        updateData.stats = JSON.parse(stats);
      } catch (err) {
        console.error('Invalid stats JSON');
      }
    }

    // Image handling
    if (req.file) {
      updateData.imageSrc = req.file.path;
      updateData.imagePublicId = req.file.filename;

      if (about && about.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(about.imagePublicId);
        } catch (err) {
          console.error('Error deleting old Cloudinary image:', err.message);
        }
      }
    }

    if (isNew) {
      about = new About(updateData);
    } else {
      Object.assign(about, updateData);
    }

    const saved = await about.save();
    res.status(isNew ? 201 : 200).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// (Optional) delete About doc (usually not needed, but included for full CRUD)
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne({});
    if (!about) {
      return res.status(404).json({ message: 'About data not found' });
    }

    if (about.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(about.imagePublicId);
      } catch (err) {
        console.error('Error deleting Cloudinary image:', err.message);
      }
    }

    await About.deleteOne({ _id: about._id });
    res.status(200).json({ message: 'About data deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
