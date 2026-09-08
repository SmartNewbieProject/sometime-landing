// macOS canvas padding and independent QR decoding; encoding is handled by Bun.Image.
import AppKit
import Vision

enum AssetError: Error { case invalidArguments, invalidImage, missingQRCode }

let arguments = CommandLine.arguments
guard arguments.count >= 3 else { throw AssetError.invalidArguments }
let input = URL(fileURLWithPath: arguments[2])

switch arguments[1] {
case "pad":
    guard arguments.count == 4,
          let image = NSImage(contentsOf: input),
          let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 1200,
              pixelsHigh: 630, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
              isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0),
          let context = NSGraphicsContext(bitmapImageRep: bitmap)
    else { throw AssetError.invalidImage }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    NSColor(srgbRed: 219 / 255, green: 207 / 255, blue: 237 / 255, alpha: 1).setFill()
    NSRect(x: 0, y: 0, width: 1200, height: 630).fill()
    image.draw(in: NSRect(x: 0, y: 22, width: 1200, height: 586))
    NSGraphicsContext.restoreGraphicsState()
    guard let png = bitmap.representation(using: .png, properties: [:])
    else { throw AssetError.invalidImage }
    try png.write(to: URL(fileURLWithPath: arguments[3]))
case "decode":
    let request = VNDetectBarcodesRequest()
    request.symbologies = [.qr]
    try VNImageRequestHandler(url: input).perform([request])
    let payloads = request.results?.compactMap { $0.payloadStringValue } ?? []
    guard payloads.count == 1 else { throw AssetError.missingQRCode }
    print(payloads[0])
default:
    throw AssetError.invalidArguments
}
