const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');

const POSTS_DIR = path.join(__dirname, '../../_posts');
const OUTPUT_DIR = path.join(__dirname, '../../blog');

// Create output dir if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { data: {}, body: content };
    const data = yaml.load(match[1]);
    const body = content.slice(match[0].length).trim();
    return { data, body };
}

function slugFromFilename(filename) {
    return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function generateHTML(slug, data, bodyHtml) {
    const title = data.title || 'Blog Post';
    const description = data.description || '';
    const category = data.category || 'Insights';
    const date = formatDate(data.date);
    const readtime = data.readtime || '5 min read';
    const image = data.image || '';
    const imagealt = data.imagealt || title;

    const ogImage = image ? `<meta property="og:image" content="https://mercyvideos.in${image}">
    <meta name="twitter:image" content="https://mercyvideos.in${image}">` : '';

    const featuredImage = image
        ? `<img src="${image}" alt="${imagealt}" class="w-full rounded-2xl mb-8 max-h-[500px] object-cover" />`
        : '';

    return `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CY6ZG52SXN"><\/script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-CY6ZG52SXN');
<\/script>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta name="robots" content="index, follow">
    <meta name="author" content="Mercy Videos">

    <!-- Primary Meta Tags -->
    <title>${title} | Mercy Videos</title>
    <meta name="title" content="${title} | Mercy Videos">
    <meta name="description" content="${description}">
    <link rel="canonical" href="https://mercyvideos.in/blog/${slug}.html" />

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://mercyvideos.in/blog/${slug}.html">
    <meta property="og:title" content="${title} | Mercy Videos">
    <meta property="og:description" content="${description}">
    ${ogImage}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title} | Mercy Videos">
    <meta name="twitter:description" content="${description}">

    <!-- Article Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${title}",
      "description": "${description}",
      "author": { "@type": "Organization", "name": "Mercy Videos" },
      "publisher": { "@type": "Organization", "name": "Mercy Videos", "url": "https://mercyvideos.in" },
      "datePublished": "${data.date || ''}",
      "url": "https://mercyvideos.in/blog/${slug}.html"
    }
    <\/script>

    <!-- Favicons -->
    <link rel="icon" href="../images/favicon.png" type="image/png">

    <link href="../css/style.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"><\/script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { primary: '#C042FF', secondary: '#7ed1f2', surface: '#0e0e0e' },
                    fontFamily: { space: ['Space Grotesk', 'sans-serif'], inter: ['Inter', 'sans-serif'] },
                },
            },
        }
    <\/script>

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0e0e0e; color: #ffffff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .glass-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); }
        .neon-glow-purple { box-shadow: 0 0 20px rgba(192,66,255,0.5), 0 0 40px rgba(192,66,255,0.3); }
        .brand-logo { color: #fff; text-shadow: 0 0 10px rgba(192,66,255,0.8); font-style: italic; }
        .scroll-progress { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg,#C042FF,#7ed1f2); z-index: 9999; width: 0%; transition: width 0.1s; }
        
        /* Blog content typography */
        .blog-content h1, .blog-content h2, .blog-content h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; margin: 2rem 0 1rem; }
        .blog-content h2 { font-size: 1.75rem; background: linear-gradient(135deg, #C042FF, #7ed1f2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .blog-content h3 { font-size: 1.35rem; color: #7ed1f2; }
        .blog-content p { color: rgba(255,255,255,0.75); line-height: 1.85; margin-bottom: 1.5rem; font-size: 1.05rem; }
        .blog-content ul, .blog-content ol { color: rgba(255,255,255,0.75); padding-left: 1.5rem; margin-bottom: 1.5rem; line-height: 1.85; }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content strong { color: #fff; font-weight: 600; }
        .blog-content a { color: #C042FF; text-decoration: underline; }
        .blog-content blockquote { border-left: 3px solid #C042FF; padding-left: 1.5rem; margin: 2rem 0; color: rgba(255,255,255,0.6); font-style: italic; }
        .blog-content code { background: rgba(192,66,255,0.15); color: #C042FF; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9em; }
        .blog-content pre { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; overflow-x: auto; }
        .blog-content img { border-radius: 12px; max-width: 100%; margin: 1.5rem 0; }
        .blog-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2.5rem 0; }
    </style>
</head>
<body>

<div class="scroll-progress"></div>

<!-- NAV -->
<nav class="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
    <div class="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        <a href="../index.html" class="brand-logo font-space text-xl font-black tracking-tight">Mercy Videos</a>
        <div class="hidden md:flex items-center gap-8">
            <a href="../index.html" class="text-white/70 hover:text-white text-sm font-medium transition-colors">Home</a>
            <a href="../about.html" class="text-white/70 hover:text-white text-sm font-medium transition-colors">About</a>
            <a href="../services.html" class="text-white/70 hover:text-white text-sm font-medium transition-colors">Services</a>
            <a href="../portfolio.html" class="text-white/70 hover:text-white text-sm font-medium transition-colors">Portfolio</a>
            <a href="../blog.html" class="text-primary text-sm font-medium transition-colors">Blog</a>
            <a href="../contact.html" class="bg-primary text-white font-inter tracking-[0.15em] uppercase text-xs font-black px-6 py-3 rounded-full neon-glow-purple hover:scale-105 transition-all duration-300">Get In Touch</a>
        </div>
    </div>
</nav>

<!-- ARTICLE -->
<main class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">

        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-white/40 text-sm mb-8">
            <a href="../blog.html" class="hover:text-primary transition-colors">Blog</a>
            <span>/</span>
            <span class="text-white/60">${category}</span>
        </div>

        <!-- Category badge -->
        <div class="inline-block mb-6 px-4 py-2 bg-primary/20 rounded-full">
            <span class="text-primary text-xs font-bold uppercase tracking-wider">${category}</span>
        </div>

        <!-- Title -->
        <h1 class="font-space text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">${title}</h1>

        <!-- Meta -->
        <div class="flex items-center gap-4 text-white/40 text-sm mb-10 pb-8 border-b border-white/10">
            <span>Mercy Videos</span>
            <span>·</span>
            ${date ? `<time datetime="${data.date}">${date}</time><span>·</span>` : ''}
            <span>${readtime}</span>
        </div>

        <!-- Featured Image -->
        ${featuredImage}

        <!-- Blog Content -->
        <article class="blog-content">
            ${bodyHtml}
        </article>

        <!-- Back to blog -->
        <div class="mt-16 pt-8 border-t border-white/10">
            <a href="../blog.html" class="inline-flex items-center gap-2 text-primary hover:gap-4 transition-all duration-300 font-medium">
                ← Back to all articles
            </a>
        </div>

    </div>
</main>

<!-- CTA -->
<section class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto glass-panel rounded-[30px] p-10 md:p-16 text-center">
        <h2 class="font-space text-3xl md:text-4xl font-black tracking-tighter mb-4">Need Professional Video Editing?</h2>
        <p class="text-white/70 text-lg mb-8">Let's work together to create videos that captivate your audience.</p>
        <a href="../contact.html" class="inline-block bg-primary text-white font-inter tracking-[0.2em] uppercase text-xs font-black px-14 py-6 rounded-full neon-glow-purple hover:scale-105 transition-all duration-300">Get In Touch</a>
    </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div>
      <span class="footer-logo">Mercy Videos</span>
      <p class="footer-desc">A premium video editing agency based in India, serving creators, real estate professionals, and businesses worldwide.</p>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul class="footer-links">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../about.html">About</a></li>
        <li><a href="../services.html">Services</a></li>
        <li><a href="../portfolio.html">Portfolio</a></li>
        <li><a href="../blog.html">Blog</a></li>
        <li><a href="../contact.html">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <div class="contact-item">
        <div class="contact-icon">✉️</div>
        <span>Email<br><a href="mailto:hello@mercyvideos.in">hello@mercyvideos.in</a></span>
      </div>
      <a href="../contact.html" class="footer-btn">Contact Us →</a>
    </div>
  </div>
  <div class="footer-divider"></div>
  <div class="footer-bottom">
    <span class="footer-copy">© 2026 Mercy Videos. All rights reserved.</span>
  </div>
</footer>

<script>
const scrollProgressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollProgressBar) scrollProgressBar.style.width = p + '%';
});
<\/script>
</body>
</html>`;
}

// Process all markdown files in _posts/
if (!fs.existsSync(POSTS_DIR)) {
    console.log('No _posts directory found. Nothing to build.');
    process.exit(0);
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

files.forEach(filename => {
    const content = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data, body } = parseFrontmatter(content);
    const bodyHtml = marked.parse(body);
    const slug = slugFromFilename(filename);
    const html = generateHTML(slug, data, bodyHtml);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✅ Generated: blog/${slug}.html`);
});

console.log(`\n🎉 Built ${files.length} blog post(s) successfully!`);
