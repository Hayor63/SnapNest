import cloudinary from "../src/services/cloudinary"; // Import from the correct path

const testUpload = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://upload.wikimedia.org/wikipedia/commons/0/01/Charvet_shirt.jpg"
    );
    console.log("✅ Cloudinary Test Upload Successful:", result.secure_url);
  } catch (error) {
    console.error("❌ Cloudinary Test Upload Failed:", error);
  }
};

// Run the test
testUpload();
