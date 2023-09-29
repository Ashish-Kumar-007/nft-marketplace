const axios = require("axios");

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET; // Your API secret for generating the signature
const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

const UploadImage = async (image) => {
  try {
    // Construct the signature
    const signature = require("crypto")
      .createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", image); // Replace 'image' with the actual file path or a Readable Stream

    // Define the Cloudinary upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Add the additional parameters to the form data
    formData.append("timestamp", timestamp);
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    // Make the Axios POST request to Cloudinary
    const response = await axios.post(uploadUrl, formData);

    // Log the image URL and return the response
    console.log("image url:", response.data.url);
    return response?.data?.url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
};


export default UploadImage;
