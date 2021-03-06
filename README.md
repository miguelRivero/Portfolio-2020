<p align="center"><a href="#"><strong>Front-End Portfolio 2020</strong></a></p>

## Project Overview 

- The project uses [Eleventy](https://11ty.io) as a static site generator
- Default templating is [Nunjucks](https://mozilla.github.io/nunjucks/) (can be changed if you want)
- PostCSS set up to handle:
	- TailwindCSS
	- Autoprefixer 
- PurgeCSS to remove unused CSS (set up for TailwindCSS by default) in production
- HTML minified in production
- CSS inlined and minified in production
- Webpack used to bundle scripts
- Scripts optimised for production
- Document `<head>` crafted using [htmlhead.dev](https://htmlhead.dev)

---

#### Credits 

- [Eleventy](https://11ty.io)
- [TailwindCSS](https://tailwindcss.com/)
- [PostCSS](https://github.com/postcss)
	- Autoprefixer
- [Babel](https://babeljs.io/)
- [Webpack](https://webpack.js.org/)
- [PurgeCSS](https://github.com/FullHuman/purgecss)
- [Luxon](https://moment.github.io/luxon/)
- [Concurrently](https://www.npmjs.com/package/concurrently)
- [HTML Minifier](https://www.npmjs.com/package/html-minifier)
- [JS YAML](https://www.npmjs.com/package/js-yaml)

---

## Deployment 

You can host the production output on any web server or service you like and upload it via any method, it'll work. 

If you don't have an existing place to host your site you should have a look at [Netlify](https://www.netlify.com), I can't recommend it enough. To get started you can hit the button below.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/miguelRivero/Portfolio-2020)

---