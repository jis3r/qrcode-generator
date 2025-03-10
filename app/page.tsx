"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, RefreshCw } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://isermann.dev")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const qrCodeRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (!qrCodeRef.current) return

    const svg = qrCodeRef.current.querySelector("svg")
    if (!svg) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = size
    canvas.height = size

    // Create an image from the SVG
    const img = new Image()
    img.crossOrigin = "anonymous"

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    img.onload = () => {
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0)

      // Convert canvas to data URL and trigger download
      const pngUrl = canvas.toDataURL("image/png")

      // Create download link
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = "qrcode.png"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      // Clean up
      URL.revokeObjectURL(svgUrl)
    }

    img.src = svgUrl
  }

  return (
    <div className="container mx-auto pb-12 pt-16 px-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Enter text or a URL to generate a QR code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">Text or URL</Label>
            <Input id="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="size">Size: {size}px</Label>
            </div>
            <Slider
              id="size"
              min={128}
              max={512}
              step={8}
              value={[size]}
              onValueChange={(value) => setSize(value[0])}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fgColor">Foreground Color</Label>
              <div className="flex space-x-2">
                <div className="w-10 h-10 rounded border" style={{ backgroundColor: fgColor }} />
                <Input
                  id="fgColor"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex space-x-2">
                <div className="w-10 h-10 rounded border" style={{ backgroundColor: bgColor }} />
                <Input
                  id="bgColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>

          <div ref={qrCodeRef} className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG
              value={text || " "}
              size={size}
              level="H"
              includeMargin
              fgColor={fgColor}
              bgColor={bgColor}
              className="mx-auto"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setText("")}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

