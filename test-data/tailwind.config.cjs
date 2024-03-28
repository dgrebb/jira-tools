const daisyui = require('daisyui');
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
		colors: {
			'dark-blue': {
				50: '#e9f1ff',
				100: '#d6e7ff',
				200: '#b6d0ff',
				300: '#8aafff',
				400: '#5c80ff',
				500: '#3752ff',
				600: '#1520ff',
				700: '#0b13f7',
				800: '#0c15bc',
				900: '#141e9b',
				950: '#0c105a'
			},
			cinder: {
				50: '#eef0ff',
				100: '#dce0ff',
				200: '#b2bfff',
				300: '#6d8aff',
				400: '#204dff',
				500: '#0025ff',
				600: '#0013df',
				700: '#000eb4',
				800: '#000d95',
				900: '#000b7a',
				950: '#000111'
			}
		}
	},

	plugins: [forms, typography, daisyui]
};

module.exports = config;
