const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

// Initialize the app first
const app = express();

// Enable CORS for all origins
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "eventUpload.html"));
});

// Configure Multer storage to save files with a unique name in the uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads")); // Specify upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName); // Generate a unique name for the file
    },
});

const upload = multer({ storage });

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File upload route
app.post("/upload", upload.single("poster-upload"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    // Generate a shareable link for the uploaded file
    const fileUrl = `https://image-sharing-app.onrender.com/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
