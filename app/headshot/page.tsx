"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import clsx from "clsx";
import { useApiKey } from "@/components/ApiKeyProvider";

type InputMode = "upload" | "camera";

const STYLES = [
  {
    id: "corporate",
    label: "Corporate",
    description: "Traditional business headshot",
    prompt:
      "Transform this photo into a polished corporate headshot. Professional studio lighting with soft key light, clean neutral gray background, person wearing professional business attire. Sharp focus on face, shallow depth of field. Maintain exact facial features and identity. High-end executive portrait style.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Approachable & professional",
    prompt:
      "Transform this photo into a warm, approachable LinkedIn profile headshot. Soft natural lighting, slightly blurred modern office or outdoor background with warm tones. Friendly, confident expression. Professional but approachable feel. Maintain exact facial features and identity. High resolution portrait.",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Modern & artistic",
    prompt:
      "Transform this photo into a creative professional headshot with dramatic Rembrandt lighting, dark moody background with subtle color gradient. Artistic but still professional. Bold, confident composition. Maintain exact facial features and identity. Editorial portrait quality.",
  },
  {
    id: "startup",
    label: "Startup Casual",
    description: "Relaxed & authentic",
    prompt:
      "Transform this photo into a casual startup-style headshot. Bright, airy natural lighting, minimalist white or light background. Relaxed, genuine expression. Clean and modern feel without being overly formal. Maintain exact facial features and identity. Tech company profile photo style.",
  },
];

export default function HeadshotPage() {
  const { geminiKey, setGeminiKey, clearGeminiKey } = useApiKey();
  const [keyInput, setKeyInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMime, setUploadedMime] = useState("image/jpeg");
  const [generatedImages, setGeneratedImages] = useState<{ mimeType: string; data: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setCameraError("Could not access camera. Please check permissions or try uploading instead.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Crop to center square and mirror horizontally
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setUploadedImage(dataUrl);
    setUploadedMime("image/jpeg");
    setGeneratedImages([]);
    stopCamera();
  }, [stopCamera]);

  // Clean up camera on unmount or mode switch
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (inputMode !== "camera") {
      stopCamera();
    }
  }, [inputMode, stopCamera]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }

    setError("");
    setUploadedMime(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setGeneratedImages([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleGenerate = async () => {
    if (!geminiKey) {
      setError("Please enter your Gemini API key first.");
      return;
    }
    if (!uploadedImage) {
      setError("Please upload a photo first.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedImages([]);

    // Extract base64 data from data URL
    const base64 = uploadedImage.split(",")[1];

    try {
      const response = await fetch("/api/headshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geminiKey,
          imageBase64: base64,
          mimeType: uploadedMime,
          prompt: selectedStyle.prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setGeneratedImages(data.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (image: { mimeType: string; data: string }, index: number) => {
    const ext = image.mimeType.includes("png") ? "png" : "jpg";
    const link = document.createElement("a");
    link.href = `data:${image.mimeType};base64,${image.data}`;
    link.download = `headshot-${selectedStyle.id}-${index + 1}.${ext}`;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:px-8">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Bonus
        </span>
        <h1 className="text-3xl font-semibold text-text mt-2 mb-3 tracking-tight">
          AI Headshot Generator
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Upload a photo of yourself and transform it into a professional headshot using Google&apos;s Nano Banana (Gemini) image model.
        </p>
      </div>

      {/* Gemini API Key */}
      <div className="rounded-xl border border-border bg-surface p-5 mb-8">
        <h2 className="text-sm font-semibold text-text mb-1">Gemini API Key</h2>
        <p className="text-xs text-text-tertiary mb-3">
          Get a key from{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            Google AI Studio
          </a>
          . Stored in this tab only.
        </p>
        {geminiKey ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Key active</span>
            </div>
            <code className="text-xs text-text-tertiary font-mono">
              {geminiKey.slice(0, 6)}...{geminiKey.slice(-4)}
            </code>
            <button
              onClick={clearGeminiKey}
              className="ml-auto text-xs text-text-tertiary hover:text-error transition-colors"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && keyInput.trim()) {
                  setGeminiKey(keyInput.trim());
                  setKeyInput("");
                }
              }}
              placeholder="AIza..."
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-white placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 font-mono"
            />
            <button
              onClick={() => {
                if (keyInput.trim()) {
                  setGeminiKey(keyInput.trim());
                  setKeyInput("");
                }
              }}
              disabled={!keyInput.trim()}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Photo Input Area */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text mb-3">Your Photo</h2>

        {/* Captured/uploaded preview */}
        {uploadedImage ? (
          <div className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4">
            <img
              src={uploadedImage}
              alt="Your photo"
              className="w-24 h-24 rounded-lg object-cover border border-border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">Photo ready</p>
              <p className="text-xs text-text-tertiary mt-0.5">
                Choose a style below and generate
              </p>
            </div>
            <button
              onClick={() => {
                setUploadedImage(null);
                setGeneratedImages([]);
              }}
              className="text-xs text-text-tertiary hover:text-error transition-colors px-2 py-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-3 bg-surface-alt rounded-lg p-1 w-fit">
              <button
                onClick={() => setInputMode("upload")}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  inputMode === "upload"
                    ? "bg-surface text-text shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 16.5V18a3 3 0 003 3h12a3 3 0 003-3v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Upload
              </button>
              <button
                onClick={() => setInputMode("camera")}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  inputMode === "camera"
                    ? "bg-surface text-text shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Camera
              </button>
            </div>

            {/* Upload mode */}
            {inputMode === "upload" && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                  "relative rounded-xl border-2 border-dashed cursor-pointer transition-colors",
                  isDragging
                    ? "border-accent bg-accent-light"
                    : "border-border hover:border-accent/40 bg-surface-alt"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                <div className="py-12 px-6 text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-text-tertiary">
                    <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 16.5V18a3 3 0 003 3h12a3 3 0 003-3v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm font-medium text-text-secondary">
                    Drop a photo here or click to browse
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    JPEG or PNG, max 10MB
                  </p>
                </div>
              </div>
            )}

            {/* Camera mode */}
            {inputMode === "camera" && (
              <div className="rounded-xl border border-border bg-code-bg overflow-hidden">
                <canvas ref={canvasRef} className="hidden" />

                {cameraError ? (
                  <div className="py-12 px-6 text-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-text-tertiary">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p className="text-sm text-error mb-3">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                ) : !cameraActive ? (
                  <div className="py-12 px-6 text-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-text-tertiary">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <p className="text-sm text-text-secondary mb-4">
                      Take a photo with your webcam
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-5 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
                    >
                      Turn on camera
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full aspect-square object-cover"
                      style={{ transform: "scaleX(-1)" }}
                    />
                    {/* Capture overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-4 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
                      <button
                        onClick={capturePhoto}
                        className="w-14 h-14 rounded-full bg-white border-4 border-white/60 shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                        aria-label="Take photo"
                      >
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Style Selector */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text mb-3">Headshot Style</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style)}
              className={clsx(
                "rounded-xl border-2 p-4 text-left transition-all",
                selectedStyle.id === style.id
                  ? "border-accent bg-accent-light"
                  : "border-border hover:border-accent/30 bg-surface"
              )}
            >
              <p className={clsx(
                "text-sm font-semibold",
                selectedStyle.id === style.id ? "text-accent" : "text-text"
              )}>
                {style.label}
              </p>
              <p className="text-xs text-text-tertiary mt-0.5 leading-snug">
                {style.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-8">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !uploadedImage || !geminiKey}
          className="w-full py-3 text-sm font-semibold rounded-xl bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating headshot...
            </span>
          ) : (
            "Generate Headshot"
          )}
        </button>
        {!geminiKey && (
          <p className="text-xs text-text-tertiary text-center mt-2">
            Enter your Gemini API key above to get started
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 px-4 py-3 text-sm text-error bg-error-light rounded-xl border border-error/10">
          {error}
        </div>
      )}

      {/* Results */}
      {generatedImages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text mb-3">Your Headshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="rounded-xl border border-border bg-surface overflow-hidden">
                <img
                  src={`data:${image.mimeType};base64,${image.data}`}
                  alt={`Generated headshot ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 flex items-center justify-between border-t border-border-subtle">
                  <span className="text-xs text-text-tertiary">
                    {selectedStyle.label} style
                  </span>
                  <button
                    onClick={() => handleDownload(image, index)}
                    className="text-xs font-medium text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generating skeleton */}
      {isGenerating && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text mb-3">Generating...</h2>
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="w-full aspect-square bg-surface-alt animate-pulse flex items-center justify-center">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 text-text-tertiary mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-text-tertiary">This usually takes 10\u201315 seconds</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-xl border border-border-subtle bg-surface-alt p-5">
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Tips for best results</h3>
        <ul className="text-sm text-text-secondary space-y-1.5 leading-relaxed">
          <li>Use a well-lit photo where your face is clearly visible</li>
          <li>Front-facing or slight angle works best</li>
          <li>Avoid heavy filters or extreme crops</li>
          <li>Higher resolution photos produce better results</li>
        </ul>
      </div>
    </div>
  );
}
