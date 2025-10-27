"use client";

import React, { useState, useRef, useCallback } from "react";
import AvatarEditor from "react-avatar-editor";
import Webcam from "react-webcam";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Camera, Upload, Image as ImageIcon, X, RotateCw } from "lucide-react";
import { Slider } from "./slider";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

type UploadSource = "gallery" | "files" | "camera" | null;
type UploadStep = "select-source" | "capture" | "crop";

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isUploading = false,
}) => {
  const [uploadSource, setUploadSource] = useState<UploadSource>(null);
  const [uploadStep, setUploadStep] = useState<UploadStep>("select-source");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const webcamRef = useRef<Webcam>(null);
  const editorRef = useRef<AvatarEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = useCallback(() => {
    setUploadSource(null);
    setUploadStep("select-source");
    setSelectedImage(null);
    setCapturedImage(null);
    setScale(1);
    setRotate(0);
  }, []);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  const handleSourceSelect = (source: UploadSource) => {
    setUploadSource(source);
    if (source === "files") {
      fileInputRef.current?.click();
    } else if (source === "camera") {
      setUploadStep("capture");
    } else if (source === "gallery") {
      // For gallery, we'll use the file input but with capture="environment"
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setUploadStep("crop");
    }
    event.target.value = "";
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setUploadStep("crop");
    }
  }, []);

  const dataURLToFile = (dataURL: string, filename: string): File => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCropAndUpload = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataURL = canvas.toDataURL("image/jpeg", 0.9);
      const croppedFile = dataURLToFile(dataURL, "profile-photo.jpg");
      onUpload(croppedFile);
      handleClose();
    }
  };

  const handleDirectUpload = () => {
    if (selectedImage) {
      onUpload(selectedImage);
      handleClose();
    }
  };

  const renderSelectSource = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Upload Profile Photo</h3>
        <p className="text-sm text-gray-600">Choose how you want to upload your photo</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          onClick={() => handleSourceSelect("gallery")}
          variant="outline"
          className="flex items-center justify-start p-4 h-auto"
        >
          <ImageIcon className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Choose from Gallery</div>
            <div className="text-sm text-gray-500">Select from your device's gallery</div>
          </div>
        </Button>

        <Button
          onClick={() => handleSourceSelect("files")}
          variant="outline"
          className="flex items-center justify-start p-4 h-auto"
        >
          <Upload className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Upload from Files</div>
            <div className="text-sm text-gray-500">Browse and select image file</div>
          </div>
        </Button>

        <Button
          onClick={() => handleSourceSelect("camera")}
          variant="outline"
          className="flex items-center justify-start p-4 h-auto"
        >
          <Camera className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Take Photo</div>
            <div className="text-sm text-gray-500">Use your camera to take a photo</div>
          </div>
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        capture={uploadSource === "gallery" ? "environment" : undefined}
      />
    </div>
  );

  const renderCameraCapture = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Take Photo</h3>
        <p className="text-sm text-gray-600">Position yourself and capture your photo</p>
      </div>

      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user"
          }}
          className="w-full h-80 bg-gray-200 rounded-lg"
        />
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={() => setUploadStep("select-source")} variant="outline">
          Back
        </Button>
        <Button onClick={handleCapture} className="bg-blue-600 hover:bg-blue-700">
          <Camera className="w-4 h-4 mr-2" />
          Capture Photo
        </Button>
      </div>
    </div>
  );

  const renderCropEditor = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Crop Your Photo</h3>
        <p className="text-sm text-gray-600">Adjust the image to fit your profile</p>
      </div>

      <div className="flex justify-center">
        <AvatarEditor
          ref={editorRef}
          image={selectedImage || capturedImage || ""}
          width={200}
          height={200}
          border={50}
          borderRadius={100}
          color={[255, 255, 255, 0.6]}
          scale={scale}
          rotate={rotate}
          className="border rounded-lg"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Zoom</label>
          <Slider
            value={[scale]}
            onValueChange={(value) => setScale(value[0])}
            min={0.5}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rotate</label>
          <Slider
            value={[rotate]}
            onValueChange={(value) => setRotate(value[0])}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={() => setUploadStep(uploadSource === "camera" ? "capture" : "select-source")} variant="outline">
          Back
        </Button>
        <Button onClick={handleDirectUpload} variant="outline">
          Upload Without Crop
        </Button>
        <Button onClick={handleCropAndUpload} className="bg-blue-600 hover:bg-blue-700">
          Crop & Upload
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (uploadStep) {
      case "select-source":
        return renderSelectSource();
      case "capture":
        return renderCameraCapture();
      case "crop":
        return renderCropEditor();
      default:
        return renderSelectSource();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Profile Photo</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadModal;
