# AR Mushroom Garden 🍄

An interactive augmented reality experience featuring colorful, procedurally generated 3D mushrooms built with Three.js and WebXR.

## Features

- **Colorful Mushroom Generation**: Procedurally generated mushrooms with 8 unique color schemes
- **Interactive 3D View**: Rotate, zoom, and explore the mushroom garden
- **AR Mode**: Place mushrooms in your real environment using WebXR (on supported devices)
- **Dynamic Animations**: Gentle bobbing animations bring the mushrooms to life
- **Realistic Details**: Each mushroom includes:
  - Textured stems
  - Spotted caps
  - Gills underneath
  - Randomized sizes and orientations
  - Realistic shadows

## Color Schemes

The mushrooms come in various vibrant color combinations:
- 🔴 Classic Red with white spots
- 🟠 Orange with yellow spots
- 🟣 Purple with magenta spots
- 🔵 Cyan with blue spots
- 💗 Pink with light pink spots
- 🟢 Green with yellow spots
- 🟧 Orange-red with gold spots
- 💜 Dark violet with orchid spots

## Usage

### Quick Start

1. Open `index.html` in a modern web browser
2. Use the control panel to interact with the scene:
   - **Add Random Mushroom**: Spawn a single mushroom at a random location
   - **Add Cluster**: Create a group of mushrooms with matching colors
   - **Clear All**: Remove all mushrooms from the scene
   - **Start AR Mode**: Enable augmented reality (requires WebXR-compatible device)

### Controls

- **Mouse/Touch Drag**: Rotate the camera view
- **Mouse Wheel/Pinch**: Zoom in and out
- **Buttons**: Use the on-screen controls to add or remove mushrooms

### AR Mode

To use AR features:
1. Open the page on an AR-capable device (modern Android/iOS device)
2. Use HTTPS (AR requires secure context)
3. Click "Start AR Mode"
4. Grant camera permissions
5. Point your device at a flat surface
6. Tap to place mushrooms in your environment

## Technical Details

### Built With

- **Three.js** (v0.159.0): 3D graphics library
- **WebXR**: Augmented reality capabilities
- **ES6 Modules**: Modern JavaScript architecture

### File Structure

```
final--mushroom-picking/
├── index.html          # Main HTML page
├── mushroom-ar.js      # Core Three.js and AR logic
└── README.md          # This file
```

### Mushroom Generation

Each mushroom is composed of:
- **Stem**: Cylindrical geometry with tapered base
- **Cap**: Hemisphere with vibrant colors
- **Spots**: Randomly positioned spheres on the cap surface
- **Gills**: Cylindrical detail under the cap
- **Lighting**: Shadow casting for realism

### Browser Compatibility

- **3D View**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- **AR Mode**: Requires WebXR support
  - Android: Chrome 79+, Samsung Internet
  - iOS: Safari 13+ (with WebXR Viewer app for enhanced features)

## Development

The project uses ES6 modules and imports Three.js from a CDN. No build step required!

To modify:
1. Edit `mushroom-ar.js` for logic changes
2. Edit `index.html` for UI modifications
3. Refresh your browser to see changes

### Adding New Features

To add new mushroom types, edit the `colorSchemes` array in `mushroom-ar.js`:

```javascript
const colorSchemes = [
    { cap: 0xff4444, spots: 0xffffff, stem: 0xffeecc },
    // Add your custom colors here
];
```

## Deployment

To deploy online:
1. Host files on any static web server
2. Ensure HTTPS is enabled (required for AR)
3. Share the URL

Suggested platforms:
- GitHub Pages
- Netlify
- Vercel
- Any web hosting service

## Future Enhancements

Potential improvements:
- Hit-test based placement in AR mode
- More mushroom varieties (different shapes)
- Interactive mushroom picking
- Sound effects
- Particle effects (spores, sparkles)
- Save/load garden configurations
- Multi-user AR sessions

## License

Free to use and modify for any purpose.

## Credits

Created with Three.js and WebXR. Mushroom models generated procedurally in code.

---

Enjoy your magical mushroom garden! 🍄✨
