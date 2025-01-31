import config from "@/config";
import React, { useState } from "react";
// import ReactPlayer from "react-player"; // need to uninstall
export const VideoPlayer = ({style}) => {
  const [videoId, setVideoId] = useState("nice");
  const authToken = localStorage.getItem('authToken');
  const newStyle = {...style, ...{width:"640px"}}
  return (
    <div>
      <video

        style={newStyle}
        src={[`${config.apiBaseUrl}/video/${videoId}?authToken=${authToken}`]}
        controls={true}
      />
    </div>
  );
};
