# ToolNest starter

A responsive, browser-first tools website built with React + Vite.

## Run locally
1. Install Node.js (LTS).
2. Extract this project.
3. Open a terminal in the `toolnest-starter` folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Included and working
- Responsive premium-dark dashboard and mobile navigation
- Dark/light theme toggle
- Tool search and favorites (saved in localStorage)
- Image Studio: resize and export JPG/PNG/WebP in-browser
- QR Code Studio: live QR generation and SVG download
- Text Studio: word/character/sentence counts, reading estimate, case conversion and copy
- Color Studio: random palettes and click-to-copy HEX values

PDF Studio and Code Playground are intentionally marked as coming soon; they are not falsely presented as working tools yet.

## Notes
- No paid API keys or backend are required for the included features.
- Google Fonts is loaded remotely; system fonts remain the fallback.
- Image conversion uses the browser Canvas API. Some image formats or browser-specific encoders may not be supported.
- Browser clipboard access generally requires HTTPS or localhost.
- Test on real mobile devices before public launch.
