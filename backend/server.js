const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { Storage } = require("@google-cloud/storage");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEY_FILE,
});

const bucketName = process.env.GCLOUD_BUCKET_NAME;

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/submit-prd", async (req, res) => {
  const prdData = {
    document_version: req.body.documentVersion,
    product_name: req.body.productName,
    document_owner: req.body.documentOwner,
    developer: req.body.developer,
    stakeholder: req.body.stakeholder,
    document_stage: "draft", // Assuming a default value for document_stage
    context: req.body.projectOverview,
    darci: {
      decider: [req.body.darciRoles.decider],
      accountable: [req.body.darciRoles.accountable],
      responsible: [req.body.darciRoles.responsible],
      consulted: [req.body.darciRoles.consulted],
      informed: [req.body.darciRoles.informed]
    },
    timeline: {
      start_date: req.body.startDate,
      end_date: req.body.endDate,
      pic: "Project Manager" // Assuming a default value for pic
    }
  };

  console.log("Received PRD Data:", prdData);

  const fileName = `prd-${Date.now()}.json`;

  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: 'application/json',
      },
    });

    stream.on('error', (err) => {
      console.error("Error uploading PRD data:", err);
      res.status(500).json({ message: "Error uploading PRD data." });
    });

    stream.on('finish', async () => {
      console.log(`File uploaded successfully: ${fileName}`);

      // Call the Flask endpoint to process the PRD
      try {
        const response = await axios.post('http://localhost:5001/generate-prd', prdData);
        console.log("PRD processed by LLM:", response.data);

        // Send the generated PRD JSON back to the frontend
        res.json({ message: "PRD data submitted and uploaded to cloud storage.", prd: response.data });
      } catch (error) {
        console.error("Error processing PRD with LLM:", error);
        res.status(500).json({ message: "Error processing PRD with LLM." });
      }
    });

    stream.end(JSON.stringify(prdData, null, 2));
  } catch (error) {
    console.error("Error uploading PRD data:", error);
    res.status(500).json({ message: "Error uploading PRD data." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});