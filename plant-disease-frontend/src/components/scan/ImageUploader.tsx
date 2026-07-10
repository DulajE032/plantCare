"use client"

import { useCallback, useState, useRef } from "react"
import { useDropzone } from "react-dropzone"
import imageCompression from "browser-image-compression"
import { Camera, Image as ImageIcon, Trash2, Upload, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  onImageSelected: (file: File) => void
  onImageRemoved: () => void
  status: "idle" | "selected" | "uploading"
}

export function ImageUploader({ onImageSelected, onImageRemoved, status }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    setCompressing(true)

    // Verify file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WEBP).")
      setCompressing(false)
      return
    }

    try {
      // Compression options
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      }

      const compressedFile = await imageCompression(file, options)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(compressedFile)
      setPreview(previewUrl)
      
      // Pass the compressed file up
      onImageSelected(compressedFile)
    } catch (err) {
      console.error("Compression error:", err)
      setError("Failed to process the image. Please try again.")
    } finally {
      setCompressing(false)
    }
  }, [onImageSelected])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0])
    }
  }, [handleFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: status === "uploading" || compressing,
  })

  const removeImage = () => {
    setPreview(null)
    setError(null)
    onImageRemoved()
  }

  const triggerCamera = () => {
    cameraInputRef.current?.click()
  }

  const triggerGallery = () => {
    galleryInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto">
      {/* Hidden native inputs for mobile optimization */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleInputChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Drag-Drop or Preview Area */}
      {preview ? (
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md group">
          <img src={preview} alt="Plant Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="rounded-full shadow-lg h-12 w-12"
              onClick={removeImage}
              disabled={status === "uploading"}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full shadow-lg bg-white text-zinc-900 hover:bg-zinc-150 h-12 px-5 flex items-center gap-2"
              onClick={triggerCamera}
              disabled={status === "uploading"}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retake</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-green-500 bg-green-50/20 dark:bg-green-950/10"
              : "border-zinc-200 dark:border-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10"
          } ${(status === "uploading" || compressing) && "pointer-events-none opacity-50"}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4 flex flex-col items-center">
            <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:text-green-500 transition-colors">
              {compressing ? (
                <RefreshCw className="h-10 w-10 animate-spin text-green-500" />
              ) : (
                <Upload className="h-10 w-10" />
              )}
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                {compressing ? "Processing Image..." : "Drag & drop leaf photo here"}
              </p>
              <p className="text-xs text-zinc-400">Supports JPEG, PNG, WEBP (Max 10MB)</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30 rounded-xl text-red-800 dark:text-red-400 text-sm items-start">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions Selector: Only shown when no image is loaded */}
      {!preview && (
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 h-14 rounded-xl border-zinc-200 dark:border-zinc-800 font-semibold"
            onClick={triggerCamera}
            disabled={status === "uploading" || compressing}
          >
            <Camera className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Take Photo</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 h-14 rounded-xl border-zinc-200 dark:border-zinc-800 font-semibold"
            onClick={triggerGallery}
            disabled={status === "uploading" || compressing}
          >
            <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Gallery</span>
          </Button>
        </div>
      )}
    </div>
  )
}
