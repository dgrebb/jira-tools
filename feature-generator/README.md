# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Generating Features

Try a sample prompt:

> Let's create 3 Epics that cover the engineering areas of Back End Engineering (key: BEE), UI Engineering (UIE), and End to End Testing (E2E). The feature is a new banner that displays the latest offers served up from the Back End team's service APIs. This, however, is a new API that they will be creating. The UI team is responsible for making the various integrations with the API, and displaying the banner with appropriate styles in CSS. The End to End team will then test the integrations prior to launch in the production environment. Let's create 5 user stories under each team's epic, then break each down into 2 sub-tasks.
