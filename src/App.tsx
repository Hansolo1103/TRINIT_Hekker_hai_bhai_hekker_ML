
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import  { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [captureImage, setCaptureImage] = useState(true);
  const [captureButtonName, setCaptureButtonName] = useState<string>("Capture Image");
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement)?.files;
      if (files) {
        setImage(files[0]);
      }
    };
    input.click();
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setImageURL(imageUrl);
      }
    }
  };

  const retakeImage = () => {

    setCaptureImage(true);
    setCaptureButtonName("Capture Image");

    // Stop the video stream
    const stream = videoRef.current?.srcObject as MediaStream;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => {
      track.stop();
    });

    // Clear the video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Get a new video stream
    getVideo();
  };

  return (
    <>
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "grid", my: 30, mx: 30 }}>
            <Box >
              {image ? (
                <img
                  src={image ? URL.createObjectURL(image) : ""}
                  alt=""
                  width="300"
                  height="300"
                />
              ) : (
                <AccountCircleIcon sx={{ width: 300, height: 300 }} />
              )}
            </Box>

            <Button
              sx={{ my: 2 }}
              variant="outlined"
              href="#outlined-buttons"
              onClick={() => {
                uploadImage();
              }}
            >
              <CloudUploadIcon sx={{ mr: 2 }} /> Upload Image
            </Button>
          </Box>
          <Box sx={{ display: "grid", my: 30, mx: 30 }}>
          <Box >
              {captureImage ? (
                <video ref={videoRef} width="300" height="225" autoPlay playsInline></video>
              ) : (
                <img src={imageURL} alt="" width="300" height="225" />
              )}
            </Box>
            <Button
              sx={{ my: 2 }}
              variant="outlined"
              href="#outlined-buttons"
              onClick={() => {
                if (captureImage) {
                  takePhoto();
                } else {
                  retakeImage();
                }
                setCaptureImage(!captureImage);
                setCaptureButtonName(!captureImage ? "Click Image" : "Retake Image");
              }}
            >
              <CameraAltIcon sx={{ mr: 2 }} /> {captureButtonName}
            </Button>
          </Box>
        </Box>
      </div>
    </>
  );
}
