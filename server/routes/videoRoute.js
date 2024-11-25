const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
router.get("/video/:id", (req, res) => {
  const videoId = req.params.id;
  console.log(videoId);

  const videoPath = path.resolve(__dirname, "..", "videos", `${videoId}.mp4`); // Adjust path to your video file
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  const range = req.headers.range;
  if (range) {
    // console.log(range);

    // Parse Range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // Ensure range is valid
    if (start >= fileSize || end >= fileSize) {
      return res.status(416).send("Requested range not satisfiable");
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head); // 206 Partial Content
    file.pipe(res);
  } else {
    // Serve entire file if no range is requested
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
  //   res.status(200).json({ message: "Home page new" });
});

module.exports = router;