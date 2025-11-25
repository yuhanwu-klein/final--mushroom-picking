# VR Mushroom Picker - Interactive Experience 🍄

An immersive virtual reality mushroom picking game featuring realistic USDZ 3D models, interactive toxicity checking, and a virtual kitchen cooking experience. Also includes a procedurally generated AR mushroom garden built with Three.js and WebXR.

## 🎮 Main Features

### **Mushroom Picker Game** (mushroom-picker.html)
The complete interactive experience in a single HTML file:
- **VR Forest Scene**: Explore a forest with realistic USDZ mushroom models
- **Click to Check**: Click mushrooms to determine if they're toxic or edible
- **Toxicity System**: 30% chance toxic (mushroom disappears), 70% chance edible (go to kitchen)
- **Kitchen Scene**: Cook your edible mushrooms with animated cooking experience
- **Recipe Ideas**: 5 different mushroom recipes to try
- **AR Support**: View mushrooms in augmented reality on iOS/Android devices

### **VR Forest Scene** (vr-forest.html)
- Uses `slope_in_the_forest_1024.usdz` as immersive background
- Displays `mushroom_pack_1024.usdz` interactive mushroom models
- Click-to-check toxicity feature
- Smooth transitions between scenes
- Mobile-responsive design

### **AR Mushroom Garden** (index.html)
- Procedurally generated mushrooms with 8 unique color schemes
- Interactive 3D View: Rotate, zoom, and explore
- AR Mode: Place mushrooms in your real environment
- Dynamic animations with gentle bobbing effects
- Realistic shadows and lighting

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

### Quick Start - Mushroom Picker Game

1. Open `mushroom-picker.html` in a modern web browser (best on Safari for iOS or Chrome for Android)
2. **Click the mushroom** in the forest to check if it's safe
3. **If Toxic** (☠️): Mushroom disappears, click "Try Again" to reload
4. **If Edible** (✅): Automatically transported to the kitchen
5. **In Kitchen**: Click "Start Cooking!" to prepare your mushroom dish
6. **Cook and Enjoy**: Watch the cooking animation and see your completed dish!

### Quick Start - AR Mushroom Garden

1. Open `index.html` in a modern web browser
2. Click **"🍄 Play Mushroom Picker Game"** for the full interactive experience
3. Or use the control panel to interact with procedurally generated mushrooms:
   - **Add Random Mushroom**: Spawn a single mushroom at a random location
   - **Add Cluster**: Create a group of mushrooms with matching colors
   - **Clear All**: Remove all mushrooms from the scene
   - **Start AR Mode**: Enable augmented reality (requires WebXR-compatible device)

### Controls

- **Click**: Check mushroom toxicity (in VR scenes)
- **Mouse/Touch Drag**: Rotate the camera view
- **Mouse Wheel/Pinch**: Zoom in and out
- **Buttons**: Use the on-screen controls to interact

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
├── index.html                      # Main landing page with procedural mushrooms
├── mushroom-picker.html            # 🎮 Complete game (all-in-one file)
├── vr-forest.html                  # VR forest scene with toxicity checker
├── kitchen.html                    # Kitchen cooking scene
├── test-models.html                # USDZ model testing page
├── mushroom-ar.js                  # Core Three.js and AR logic
├── slope_in_the_forest_1024.usdz   # Forest background 3D model (23MB)
├── mushroom_pack_1024.usdz         # Mushroom 3D model (2.8MB)
└── README.md                       # This file
```

### Recommended Starting Points

1. **For the full game experience**: Open `mushroom-picker.html`
2. **For testing models**: Open `test-models.html` to see each USDZ model separately
3. **For procedural generation**: Open `index.html` for the Three.js mushroom garden

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
