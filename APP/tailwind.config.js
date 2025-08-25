/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],

 daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"], 

          "base-200": "#0D1117", 

          "base-100": "#f0f2f5",
        },
      },
      "dark",
    ],
  },
}