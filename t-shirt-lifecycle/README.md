# The Life of a T-Shirt

An interactive map story that follows one cotton T-shirt from the cotton field,
through manufacturing and shipping, to a student's closet in Ann Arbor. Then it
explores four possible next chapters: throw it away, donate or resell, recycle
or repurpose, or pass it along.

Built with plain HTML/CSS/JavaScript and [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/).

## Project structure

```
public/
  index.html          page markup
  style.css           styles
  script.js           map + story logic
  config.example.js   template for local testing
build-config.js       writes public/config.js from the MAPBOX_TOKEN env variable
vercel.json           tells Vercel to run the build and serve /public
```

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the repo.
3. Under **Environment Variables**, add:
   - **Name:** `MAPBOX_TOKEN`
   - **Value:** your Mapbox public token (starts with `pk.`)
4. Click **Deploy**.

Leave the framework preset as **Other**. `vercel.json` already sets the build
command and output directory.

## Run locally

1. Copy `public/config.example.js` to `public/config.js` and paste in your token.
2. From the project folder, run a simple server:
   ```
   npx serve public
   ```
   or `python3 -m http.server --directory public 8000`
3. Open the URL it prints (for example http://localhost:8000).

## About the token

Mapbox public tokens (`pk.`) are meant to be used in the browser, so anyone
visiting the site can see the token. To prevent misuse, go to your
[Mapbox account](https://account.mapbox.com/access-tokens/), edit the token, and
add **URL restrictions** for your Vercel domain (e.g. `https://your-project.vercel.app`).

## Notes on the content

Routes and locations are illustrative. The Ghana pathway represents the wider
international secondhand clothing trade, not the tracked journey of a specific
garment. The student locations in "Pass it along" are fictional.
