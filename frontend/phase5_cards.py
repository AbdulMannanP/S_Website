import os
import re

dynamic_template = '''
        <template x-if="catalog && catalog.taxonomy_tree">
          <template x-for="category in catalog.taxonomy_tree" :key="category.internal_id">
            <a :href="'/showroom.html?category=' + category.internal_id" class="category-card card-animate" :aria-label="'Explore ' + category.public_display_name">
              <div class="category-card__topbar"></div>
              <img
                :src="category.internal_id === 'type_modern_floor_majlis' ? 'https://ik.imagekit.io/de7qvcvqv/images/hero.png' : (category.internal_id === 'type_elevated_contemporary' ? 'https://ik.imagekit.io/de7qvcvqv/images/modern.png' : 'https://ik.imagekit.io/de7qvcvqv/images/authentic.png')"
                :alt="category.public_display_name"
                class="category-card__img" loading="lazy"
              />
              <div class="category-card__overlay"></div>
              <div class="category-card__glass"></div>
              <div class="category-card__content">
                <span class="category-card__eyebrow" x-text="category.public_display_name + ' Collection'"></span>
                <h2 class="category-card__name" x-text="category.public_display_name"></h2>
                <p class="category-card__arabic" style="font-size: 0.75rem; opacity: 0.8; white-space: normal; line-height: 1.4; margin-top: 0.5rem;" x-text="category.definition.substring(0, 80) + '...'"></p>
                <div class="category-card__cta">
                  <div class="category-card__cta-line"></div>
                  <span>Explore</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h10M7.5 2.5L12 7l-4.5 4.5"/></svg>
                </div>
              </div>
            </a>
          </template>
        </template>
'''

for filepath in ['d:/Saeed Furniture/frontend/select.html', 'd:/Saeed Furniture/frontend/index.html']:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the section containing the 5 a.category-card elements
    # They start around <!-- 1. Majlis --> and end around <!-- 5. Almirah -->
    # We will use regex to replace the whole block of <a>...</a>
    # Basically from <a href="/majlis.html" ... up to the end of the last </a> before </div></section>
    
    # We can match all <a ... class="category-card card-animate"...>...</a>
    # Actually, a safer way is to replace everything inside <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 px-4 md:px-10 lg:px-16 w-full max-w-[2000px] mx-auto pb-20">
    # Let's just find the grid container
    grid_match = re.search(r'(<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5[^>]*>)([\s\S]*?)(</section>)', content)
    
    if grid_match:
        # replace the inner HTML of the grid
        # Wait, the closing of the grid is a </div> not </section>
        # Let's find the grid container exactly
        pass

    # A simpler regex: find all <a href="/majlis.html" class="category-card... up to the end of <a href="/almirah.html"...</a>
    pattern = r'(<!-- 1\. Majlis.*?-->\s*<a href="/majlis\.html"[\s\S]*?<a href="/almirah\.html"[\s\S]*?</a>)'
    content = re.sub(pattern, dynamic_template, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")
