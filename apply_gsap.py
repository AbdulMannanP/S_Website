import re
import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Padding adjustments
content = re.sub(r'class="([^"]*?)py-(16|20|24)([^"]*?)"', r'class="\1py-32\3"', content)

# 2. x-intersect replacements for gsap-reveal
# We want to replace something like:
# opacity-0 translate-y-8 transition-all duration-1000 ease-out" x-intersect="$el.classList.remove('opacity-0', 'translate-y-8')"
# with:
# gsap-reveal opacity-0"

# Specifically:
content = re.sub(
    r'opacity-0 translate-y-[48] transition-all duration-[0-9]+(?: ease-out)?" x-intersect="\$el\.classList\.remove\(\'opacity-0\', \'translate-y-[48]\'\)"',
    r'gsap-reveal opacity-0"',
    content
)

# For the gold line:
content = re.sub(
    r'w-0 h-\[1px\] bg-gold absolute -top-4 right-0 transition-all duration-\[1\.5s\] delay-300" x-intersect="\$el\.classList\.add\(\'w-full\'\)"',
    r'w-full h-[1px] bg-gold absolute -top-4 right-0 gsap-line origin-right transform scale-x-0"',
    content
)

# 3. Add GSAP ScrollTrigger script logic in the initialization block
# We'll inject it into the script block we added previously.
gsap_logic = """
      // 3. GSAP Scroll Reveals
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Standard reveals
        gsap.utils.toArray('.gsap-reveal').forEach(elem => {
          gsap.fromTo(elem, 
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        });

        // Gold line reveal
        gsap.utils.toArray('.gsap-line').forEach(line => {
          gsap.to(line, {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: line,
              start: "top 85%"
            }
          });
        });

        // Parallax effect on hero backgrounds or section backgrounds if applicable
        // The arabesque-bg can have a subtle parallax
        gsap.utils.toArray('section.arabesque-bg').forEach(sec => {
          gsap.to(sec, {
            backgroundPosition: "50% 100px",
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        });
      }
"""

# Insert GSAP logic right before "// 2. Custom Magnetic Cursor Logic"
content = content.replace('// 2. Custom Magnetic Cursor Logic', gsap_logic + '\n      // 2. Custom Magnetic Cursor Logic')

with codecs.open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done with Phase 2 and 3 replacements.")
