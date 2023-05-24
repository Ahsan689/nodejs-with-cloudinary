import express from "express";
import { uploadToCloudinary,multerUploads } from "./multer.js";
import bodyParser from "body-parser";
// import { resolve } from "path";

import { cloudinary } from "./config/cloudinaryConfig.js";
const app = express();
const { urlencoded, json } = bodyParser;

app.use(urlencoded({ extended: false }));
app.use(json());
// app.use("*", cloudinary);

// ? FOR DELETING IMAGE FROM CLOUDINARY
// cloudinary.uploader.destroy('zombie', function(result) { console.log(result) });

app.post("/upload", multerUploads, async (req, res) => {
  console.log("uplooad execute");
  try {
    console.log(req.file,"req.file -- fileBuffer..");
    if (req.file) {
      const uploadedUrl = await uploadToCloudinary(req);
      console.log(uploadedUrl,"file comes from cloudinary..");

      return res.status(200).json({
        messge: "Your image has been uploded successfully to cloudinary",
        data: {
          uploadedUrl,
        }})
    }
  } catch (error) {
      console.error(`err:: ${error}`);
  }
});

app.delete("/upload", async (req,res) =>{
  await cloudinary.uploader.destroy(`DEV/hkee0hdpmnbdp26xdqgd`,{ invalidate: true, resource_type: "image" }, (error, resp) => { 
    console.log(`deleted.. ${error} ${JSON.stringify(resp)}`) 
    res.status(200).json({msg: JSON.stringify(resp)})

  })
});
app.use(() => (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      return res.status(418).send(err.code);
  }
});
app.listen(5000, () => console.log(`server started on PORT: 5000 `));
