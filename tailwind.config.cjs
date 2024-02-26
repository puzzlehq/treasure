/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg1: "#706231",
        bg2: "#312808",
        primary: "#FFD600",
        "primary-green": "#0FBE0C",
        "primary-red": "#F63B3B",
        "primary-light": "#C3BC93",
      },
      fontFamily: {
        header: ["Pirata One"],
        body: ["Kadwa"],
      },
    },
  },
  plugins: [],
};
