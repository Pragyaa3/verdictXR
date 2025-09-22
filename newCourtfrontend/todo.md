# WebXR Courtroom Simulation - MVP Todo

## Core Files to Create:
1. **index.html** - Main HTML structure with WebXR setup
2. **style.css** - Styling for UI elements and canvas
3. **script.js** - Main Three.js application with WebXR integration
4. **courtroom.js** - Courtroom scene creation and geometry
5. **characters.js** - Judge and lawyer character models
6. **lighting.js** - Scene lighting setup
7. **controls.js** - WebXR controllers and interaction handling

## Features to Implement:
- Complete 3D courtroom architecture (judge's bench, witness stand, jury box, gallery)
- Judge figure at judge's bench
- Lawyer figures at prosecution and defense tables
- WebXR VR/AR support
- Interactive elements (teleportation, object interaction)
- Proper lighting and materials
- Browser compatibility fallback for non-VR devices

## Architecture:
- Main scene manager in script.js
- Modular components for courtroom elements
- WebXR session management
- Responsive design for desktop/mobile fallback
- Performance optimization for VR rendering

## Success Criteria:
- Runs in modern browsers with WebXR support
- Fallback camera controls for non-VR devices
- Complete courtroom scene with all required elements
- Smooth 60fps performance in VR
- Ready for integration into other projects