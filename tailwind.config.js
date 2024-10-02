const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./pages/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    // Add DaisyUI's components
    "./node_modules/daisyui/**/*.js",
    "./node_modules/vue-tailwind-datepicker/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "vtd-primary": colors.sky,
        "vtd-secondary": colors.gray,
      },
    },
  },
  plugins: [require("daisyui")],
};
