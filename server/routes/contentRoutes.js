const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ✅ Import all the necessary models
const Hero = require("../models/heroModel");
const About = require("../models/aboutModel");
const Faq = require("../models/faqModel");
const Product = require("../models/productModel");
const Testimonial = require("../models/testimonialsModel");
const Contact = require("../models/contactModel");
const Query = require("../models/queryModel");

// --- ✅ ACTION: CREATE MULTER CONFIG FOR HERO IMAGE ---
const heroUploadDir = "public/uploads/hero";
// This line checks if the directory does NOT exist. If it's missing, it creates it.
if (!fs.existsSync(heroUploadDir)) {
  fs.mkdirSync(heroUploadDir, { recursive: true });
}
const heroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, heroUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, "hero-" + Date.now() + path.extname(file.originalname));
  },
});
// .single() because the hero section only has one image
const uploadHero = multer({ storage: heroStorage }).single("heroImage"); // 'heroImage' is the field name from the frontend

const productsUploadDir = "public/uploads/products";
if (!fs.existsSync(productsUploadDir)) {
  fs.mkdirSync(productsUploadDir, { recursive: true });
}
const productsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, "product-" + Date.now() + path.extname(file.originalname));
  },
});
const uploadProducts = multer({ storage: productsStorage }).array(
  "productImages",
  10
);

// This is the "get all" route for the dashboard
router.get("/", async (req, res) => {
  try {
    // Fetch the first document from each collection in parallel for efficiency
    const [hero, about, faq, products, testimonials, contact, query] =
      await Promise.all([
        Hero.findOne(),
        About.findOne(),
        Faq.findOne(),
        Product.find({}),
        Testimonial.findOne(),
        Contact.findOne(),
        Query.findOne(),
      ]);

    // Send all the data back in one object
    res.json({ hero, about, faq, products, testimonials, contact, query });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- POST Route: To create or update the hero data ---
router.post("/hero", uploadHero, async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const updateData = { title, subtitle };

    if (req.file) {
      updateData.imageUrl = `uploads/hero/${req.file.filename}`;
    }
    const updatedHero = await Hero.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });
    res.status(200).json(updatedHero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- POST Route: To create or update the about data ---
router.post("/about", async (req, res) => {
  try {
    const aboutDataFromClient = req.body;
    const updateAbout = await About.findOneAndUpdate({}, aboutDataFromClient, {
      new: true,
      upsert: true,
    });
    res.status(200).json(updateAbout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ✅ ACTION: DELETE OLD /PRODUCTS ROUTE AND ADD NEW CRUD ROUTES ---

router.post("/products", uploadProducts, async (req, res) => {
  try {
    const imageUrls = req.files.map(
      (file) => `uploads/products/${file.filename}`
    );
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      images: imageUrls,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

router.put("/products/:id", uploadProducts, async (req, res) => {
  try {
    const newImageUrls = req.files.map(
      (file) => `uploads/products/${file.filename}`
    );
    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === "string") {
      existingImages = [existingImages];
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        images: [...existingImages, ...newImageUrls],
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// DELETE /api/content/products/:id - Delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optional: Also delete the image files from the server
    product.images.forEach((imgUrl) => {
      const imagePath = path.join(__dirname, "../public", imgUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error(`Failed to delete image: ${imgUrl}`, err);
        });
      }
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    // ✅ FIX: Expect the array directly from the request body
    const testimonialItems = req.body;

    const updatedTestimonials = await Testimonial.findOneAndUpdate(
      {},
      { items: testimonialItems }, // The backend does the wrapping
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json(updatedTestimonials);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// ✅ Route for user - add ONE testimonial
router.post("/testimonials/add", async (req, res) => {
  try {
    const newTestimonial = req.body; // { author, quote, location, rating, ... }

    const updatedTestimonials = await Testimonial.findOneAndUpdate(
      {},
      { $push: { items: newTestimonial } }, // <-- append instead of overwrite
      { new: true, upsert: true }
    );

    res.status(200).json(updatedTestimonials);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const contactFromClient = req.body;

    const updatedContact = await Contact.findOneAndUpdate(
      {},
      contactFromClient,
      { new: true, upsert: true }
    );
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/faq", async (req, res) => {
  try {
    const faqFromClient = req.body;

    const updatedFaq = await Faq.findOneAndUpdate(
      {},
      { items: faqFromClient },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedFaq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/query", async (req, res) => {
  try {
    const queryFromClient = req.body;
    const updatedQuery = await Query.findOneAndUpdate(
      {},
      { items: queryFromClient },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/query/add", async (req, res) => {
  try {
    const newQuery = req.body;
    const updatedQuery = await Query.findOneAndUpdate(
      {},
      { $push: { items: newQuery } },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
