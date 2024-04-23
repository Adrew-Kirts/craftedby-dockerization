import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{vue, js, ts}'],
  plugins: [daisyui],
  daisyui: {
  themes: [
    {
      artisan: {
        primary: "#C14029",
        secondary: "#DAA07A",
        accent: "#E8C8AB",
        neutral: "#191C15",
        'base-100': "#FFFFFF",
        info: "#bae6fd",
        success: "#56ae57",
        warning: "#fcd34d",
        error: "#f87171",
      }
    },
    "pastel",
    "autumn",
    "garden",
    "retro",
  ],
  }
};