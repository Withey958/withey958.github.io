# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio/CV website for Luke Withey, hosted on GitHub Pages at `withey.tech`. It is a single-page static site with no build step, framework, or package manager.

## Architecture

The entire site is two files:

- [index.html](index.html) — all content and structure
- [withey.css](withey.css) — all styles (no inline styles except one `text-align` override in the footer)

Images are stored in [images/](images/) and referenced directly by CSS class in [withey.css](withey.css). Each card entry in `index.html` uses a CSS class (e.g. `.pneumacare`, `.ibexbh`) that maps to a `background-image` rule in the stylesheet.

### Content sections in index.html (in order)
1. Header — photo, name, title, social nav icons (Font Awesome via kit)
2. Bio paragraphs
3. Career (`#career`) — ordered list of employer cards
4. Tools (`.wrapper`) — CSS grid of tool logo tiles
5. Products (`#Other`) — ordered list of product cards
6. Patents (`#patents`) — ordered list of patent cards
7. Certificates (`#certificates`) — ordered list of qualification cards
8. Other activities (`#Other`) — ordered list of hobby cards

### Card pattern
Adding a new card entry requires two steps:
1. Add a `<li>` with an `<a class="[classname]">` block in the appropriate section of `index.html`
2. Add a `.projects .[classname]` (or `.wrapper .[classname]`) rule in `withey.css` referencing the image file in `images/`

## Deployment

Pushing to the `master` branch on GitHub automatically deploys to GitHub Pages. There is no CI, build process, or preview environment — changes go live immediately on push.

## Design principles
- Follows Material Design — MD Blue 800 (`#1565C0`) as primary colour, card elevation on hover, keyboard focus states
- Three responsive breakpoints: `<567px` mobile (3-col tools grid), `567–767px` tablet (4-col, 520px content), `≥768px` desktop (5-col, 640px content)

## External dependencies (CDN, no local install needed)
- Google Fonts: Nunito (`wght@200;300;400`) — loaded via `css2` API with `display=swap`
- Font Awesome kit: `https://kit.fontawesome.com/447132c055.js`
- Google Analytics: UA-163886841-1
