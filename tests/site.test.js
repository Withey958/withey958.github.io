'use strict';

const fs   = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const htmlContent = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cssContent  = fs.readFileSync(path.join(root, 'withey.css'),  'utf8');

let document;

beforeAll(() => {
    const dom = new JSDOM(htmlContent);
    document = dom.window.document;
});

// ─────────────────────────────────────────────────────────────────────────────
// Links
// ─────────────────────────────────────────────────────────────────────────────

describe('Links', () => {
    let anchors;

    beforeAll(() => {
        anchors = Array.from(document.querySelectorAll('a'));
    });

    // Some cards are intentional placeholders with no link yet (headphones, masters degrees, radio)
    const PLACEHOLDER_CLASSES = ['headphones', 'masters', 'radio', 'thrive-wearables'];

    test('every anchor has a non-empty href, or is a known placeholder', () => {
        anchors.forEach(a => {
            const cls = a.getAttribute('class') || '';
            const isPlaceholder = PLACEHOLDER_CLASSES.some(c => cls.includes(c));
            if (!isPlaceholder) {
                expect(a.getAttribute('href')).toBeTruthy();
            }
        });
    });

    test('placeholder cards are exactly the known set', () => {
        const noHref = anchors
            .filter(a => !a.hasAttribute('href'))
            .map(a => a.getAttribute('class'));
        noHref.forEach(cls => {
            expect(PLACEHOLDER_CLASSES.some(c => cls.includes(c))).toBe(true);
        });
    });

    test('all external links use HTTPS', () => {
        anchors
            .filter(a => (a.getAttribute('href') || '').startsWith('http'))
            .forEach(a => {
                expect(a.getAttribute('href')).toMatch(/^https:/);
            });
    });

    test('all internal anchor links (#) point to an existing element', () => {
        anchors
            .filter(a => (a.getAttribute('href') || '').startsWith('#'))
            .forEach(a => {
                const id = a.getAttribute('href').slice(1);
                expect(document.getElementById(id)).not.toBeNull();
            });
    });

    test('external links open in a new tab', () => {
        anchors
            .filter(a => (a.getAttribute('href') || '').startsWith('http'))
            .forEach(a => {
                expect(a.getAttribute('target')).toBe('_blank');
            });
    });

    test('LinkedIn link present and points to linkedin.com', () => {
        const link = anchors.find(a => (a.getAttribute('href') || '').includes('linkedin.com'));
        expect(link).toBeDefined();
        expect(link.getAttribute('href')).toMatch(/linkedin\.com/);
    });

    test('GitHub link present and points to github.com', () => {
        const link = anchors.find(a => (a.getAttribute('href') || '').includes('github.com/withey'));
        expect(link).toBeDefined();
    });

    test('Instagram link present and points to instagram.com', () => {
        const link = anchors.find(a => (a.getAttribute('href') || '').includes('instagram.com'));
        expect(link).toBeDefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Page structure & content
// ─────────────────────────────────────────────────────────────────────────────

describe('Page structure', () => {
    test('page title contains the full name', () => {
        expect(document.querySelector('title').textContent).toContain('Luke Withey');
    });

    test('h1 contains the full name', () => {
        expect(document.querySelector('header h1').textContent.trim()).toContain('Luke Withey');
    });

    test('h2 contains job title', () => {
        expect(document.querySelector('header h2').textContent).toContain('Product');
    });

    test('profile image is present with a src', () => {
        const img = document.querySelector('header img');
        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toBeTruthy();
    });

    test('profile image has alt text', () => {
        const img = document.querySelector('header img');
        expect(img.getAttribute('alt')).toBeTruthy();
    });

    test('career section exists', () => {
        expect(document.getElementById('career')).not.toBeNull();
    });

    test('patents section exists', () => {
        expect(document.getElementById('patents')).not.toBeNull();
    });

    test('certificates section exists', () => {
        expect(document.getElementById('certificates')).not.toBeNull();
    });

    test('canvas animation element is inside the header', () => {
        const canvas = document.querySelector('header #header-particles');
        expect(canvas).not.toBeNull();
        expect(canvas.tagName).toBe('CANVAS');
    });

    test('canvas has aria-hidden for accessibility', () => {
        const canvas = document.querySelector('#header-particles');
        expect(canvas.getAttribute('aria-hidden')).toBe('true');
    });

    test('nav contains at least 3 social icon links', () => {
        const navLinks = document.querySelectorAll('header nav a');
        expect(navLinks.length).toBeGreaterThanOrEqual(3);
    });

    test('career section contains at least one entry', () => {
        const items = document.querySelectorAll('#career li');
        expect(items.length).toBeGreaterThan(0);
    });

    test('patents section contains at least one entry', () => {
        const items = document.querySelectorAll('#patents li');
        expect(items.length).toBeGreaterThan(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Responsive CSS / screen sizes
// ─────────────────────────────────────────────────────────────────────────────

describe('Responsive CSS breakpoints', () => {
    test('mobile breakpoint defined at max-width 566px', () => {
        expect(cssContent).toMatch(/max-width:\s*566px/);
    });

    test('tablet breakpoint defined at min-width 567px', () => {
        expect(cssContent).toMatch(/min-width:\s*567px/);
    });

    test('desktop breakpoint defined at min-width 768px', () => {
        expect(cssContent).toMatch(/min-width:\s*768px/);
    });

    test('tools grid is 3 columns on mobile', () => {
        expect(cssContent).toMatch(/grid-template-columns:\s*repeat\(3/);
    });

    test('tools grid is 4 columns on tablet', () => {
        expect(cssContent).toMatch(/grid-template-columns:\s*repeat\(4/);
    });

    test('tools grid is 5 columns on desktop', () => {
        expect(cssContent).toMatch(/grid-template-columns:\s*repeat\(5/);
    });

    test('tablet content width is 520px', () => {
        expect(cssContent).toMatch(/520px/);
    });

    test('desktop content width is 640px', () => {
        expect(cssContent).toMatch(/640px/);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Header animation
// ─────────────────────────────────────────────────────────────────────────────

describe('Header animation', () => {
    test('gradient animation keyframe is defined', () => {
        expect(cssContent).toMatch(/@keyframes\s+headerGradient/);
    });

    test('header uses a linear-gradient background', () => {
        expect(cssContent).toMatch(/header\s*\{[^}]*linear-gradient/s);
    });

    test('gradient animation is applied to the header', () => {
        expect(cssContent).toMatch(/header\s*\{[^}]*animation:[^}]*headerGradient/s);
    });

    test('header animation cycles through at least 3 colour stops', () => {
        const gradientMatch = cssContent.match(/linear-gradient\([^)]+\)/);
        expect(gradientMatch).not.toBeNull();
        const stops = gradientMatch[0].match(/#[0-9a-fA-F]{3,6}/g);
        expect(stops.length).toBeGreaterThanOrEqual(3);
    });
});
