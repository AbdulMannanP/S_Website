import os
import glob
import re

html_files = glob.glob('frontend/**/*.html', recursive=True)

for filepath in html_files:
    if 'node_modules' in filepath or 'dist' in filepath: continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content

    # 1. Header Auto-hide
    # Replace body scroll listener
    content = content.replace(
        '@scroll.window="scrolled = (window.pageYOffset > 50)"',
        '@scroll.window="scrolled = (window.pageYOffset > 50); let curr = window.pageYOffset; headerHidden = (curr > lastScroll && curr > 100); lastScroll = curr;"'
    )
    # Replace header :class
    content = content.replace(
        ":class=\"scrolled ? 'bg-stone-950/80 backdrop-blur-md shadow-2xl border-white/5' : 'bg-transparent border-transparent'\"",
        ":class=\"(scrolled ? 'bg-stone-950/80 backdrop-blur-md shadow-2xl border-white/5 ' : 'bg-transparent border-transparent ') + (headerHidden ? '-translate-y-full ' : 'translate-y-0 ')\""
    )

    # 2. Carousel Native Swipe
    if 'about.html' in filepath:
        content = content.replace(
            '<div class="carousel-pill">',
            '<div class="carousel-pill flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">'
        )
        content = content.replace(
            '<div class="carousel-slide" :class="{ active: current === idx }">',
            '<div class="carousel-slide flex-shrink-0 w-full h-full snap-center relative" :class="{ active: current === idx }">'
        )
        content = content.replace(
            '      position: absolute;\n      inset: 0;\n      opacity: 0;\n      transition: opacity 1.2s ease-in-out;',
            '      /* replaced with native swipe */'
        )
        content = content.replace(
            '.carousel-slide.active { opacity: 1; }',
            '/* .carousel-slide.active { opacity: 1; } */'
        )
        # Also remove the opacity transition logic from x-data?
        # Actually it's fine, the active class just won't do anything because we removed the opacity CSS.
        # But wait, we want the dots to update when swiping!
        # To do that natively, we would need IntersectionObserver. For now, since the user just said:
        # "Inject native CSS scroll-snapping by adding flex overflow-x-auto snap-x snap-mandatory hide-scrollbar to the carousel container, and snap-center or snap-start to the individual image slides."
        # The user specifically gave the exact action: "adding flex overflow-x-auto... and snap-center... to the slides"
        
    # 3. Contact Link Standardization
    # Phone numbers
    content = content.replace(
        '+966 92 880 04450',
        '<a href="tel:+9669288004450" class="hover:text-[#c9a96e] transition-colors">+966 92 880 04450</a>'
    )
    # Don't double wrap if it's already wrapped (e.g. if the script runs twice)
    content = content.replace('<a href="tel:+9669288004450" class="hover:text-[#c9a96e] transition-colors"><a href="tel:+9669288004450" class="hover:text-[#c9a96e] transition-colors">+966 92 880 04450</a></a>', '<a href="tel:+9669288004450" class="hover:text-[#c9a96e] transition-colors">+966 92 880 04450</a>')

    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated", filepath)

