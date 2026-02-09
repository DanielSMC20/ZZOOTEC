module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C9A24D",
          hover: "#B8913E",
          light: "#E6D3A3",
          lighter: "#F7F3E8",
        },
        cream: {
          DEFAULT: "#FDF9F0",
          light: "#FFF9EC",
        },
      },
      borderRadius: {
        form: "0.75rem", // 12px - para inputs y botones
        card: "1.5rem", // 24px - para cards
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
