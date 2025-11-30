// models/aboutModel.js
const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  isDefaultHighlight: { type: Boolean, default: false },
  iconKey: { type: String, default: '' }, // e.g. 'users', 'shoppingBag', etc.
});

const aboutSchema = new mongoose.Schema(
  {
    // Small heading like "About Us"
    sectionTitle: {
      type: String,
      default: 'About Us',
    },
    // Main big title
    mainTitle: {
      type: String,
      default: 'Making Every Fabric Count',
    },
    // Short description (above "Show More")
    shortDescription: {
      type: String,
      default:
        'A Leading International Sourcing, Marketing Company Deals In Yarns, Fabrics, Garments, Fibers, Polyester Chips Textile Grade.',
    },

    // Paragraphs shown in Show More section
    detailParagraphs: {
      type: [String],
      default: [
        'Patodia Exports is a certified, leading yarn and fabric global sourcing company based in Delhi, India.',
        'With 35 years of experience as reliable commission agents and merchants, we have close relations with Indian Spinners.',
        'Our mission is to be the most customer-centric company, connecting yarn businesses with the right sourcing and selling partners.',
        'We provide high-quality, competitively priced products, ensuring timely delivery and high inspection standards.',
      ],
    },

    // Vision card
    visionTitle: {
      type: String,
      default: 'Our Vision',
    },
    visionDescription: {
      type: String,
      default:
        'We prioritize customer satisfaction daily partnering closely, sharing market insights, providing technical support, and delivering the best offers with transparent, on-time communication and long-term relationships.',
    },

    // Mission card
    missionTitle: {
      type: String,
      default: 'Our Mission',
    },
    missionDescription: {
      type: String,
      default:
        'We strive to deliver products that are not only well-made but also environmentally responsible and durable.',
    },

    // Image
    imageSrc: {
      type: String,
      default:
        'https://res.cloudinary.com/dqfppkbgd/image/upload/v1760637364/woman_eyba8f.svg',
    },
    imagePublicId: {
      type: String,
      default: '',
    },

    // Stats cards
    stats: {
      type: [statSchema],
      default: [
        { label: 'Clients', value: '100+', isDefaultHighlight: false, iconKey: 'users' },
        { label: 'Product', value: '11+', isDefaultHighlight: false, iconKey: 'shoppingBag' },
        { label: 'Top Brand', value: '1', isDefaultHighlight: true, iconKey: 'award' },
        { label: 'Worker', value: '22+', isDefaultHighlight: false, iconKey: 'userCheck' },
      ],
    },
  },
  { timestamps: true }
);

const About = mongoose.model('About', aboutSchema);
module.exports = About;
