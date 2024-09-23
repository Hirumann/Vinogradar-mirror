/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/**/*.blade.php", "./resources/**/*.js"],
    theme: {
        extend: {
            fontFamily: {
                fontProjects: ["Cuprum", "Inter", "Coda"],
            },
            colors: {
                inputColor: "#00CC66",
            },
            boxShadow: {
                main: "0px 9px 9.2px 0px rgba(0,0,0,0.4)",
            },
        },
    },
    plugins: [],
};
