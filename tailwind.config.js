// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'grain': 'grainy 1.5s steps(10) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        grainy: {
          '0%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-1%, 1%)' },
          '20%': { transform: 'translate(1%, -1%)' },
          '30%': { transform: 'translate(-1%, 1%)' },
          '40%': { transform: 'translate(1%, 1%)' },
          '50%': { transform: 'translate(-1%, -1%)' },
          '60%': { transform: 'translate(1%, -1%)' },
          '70%': { transform: 'translate(-1%, 1%)' },
          '80%': { transform: 'translate(1%, 1%)' },
          '90%': { transform: 'translate(-1%, -1%)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },},
  },
  plugins: [],
  experimental: {
    disableOptimizedUniversalDefaults: true,
  },
};
