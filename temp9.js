
    document.addEventListener("DOMContentLoaded", (event) => {
      // 1. Lenis Smooth Scroll
      if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        })

        function raf(time) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Sync GSAP ScrollTrigger with Lenis
        if (typeof ScrollTrigger !== 'undefined') {
          lenis.on('scroll', ScrollTrigger.update)
          gsap.ticker.add((time)=>{
            lenis.raf(time * 1000)
          })
          gsap.ticker.lagSmoothing(0)
        }
      }

      
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

      
      // Anime.js Day/Night Crossfade
      if (typeof anime !== 'undefined') {
        let isNight = false;
        setInterval(() => {
          isNight = !isNight;
          anime({
            targets: '#hero-night',
            opacity: isNight ? 1 : 0,
            duration: 2000,
            easing: 'easeInOutQuad'
          });
        }, 10000); // 10s interval

        // SVG Hotspot Interactions
        const zones = ['majlis', 'kitchens', 'cots', 'bedroom', 'almirah'];
        zones.forEach(zone => {
          const poly = document.getElementById(`poly-${zone}`);
          const label = document.getElementById(`label-${zone}`);
          
          if (poly && label) {
            poly.addEventListener('mouseenter', () => {
              anime({
                targets: label,
                opacity: 1,
                scale: 1.1,
                duration: 300,
                easing: 'easeOutQuad'
              });
              // Poly glow
              anime({
                targets: poly,
                fill: 'rgba(201,169,110,0.15)',
                duration: 300
              });
            });
            
            poly.addEventListener('mouseleave', () => {
              anime({
                targets: label,
                opacity: 0,
                scale: 1,
                duration: 300,
                easing: 'easeInQuad'
              });
              anime({
                targets: poly,
                fill: 'rgba(0,0,0,0)', // transparent
                duration: 300
              });
            });

            poly.addEventListener('click', () => {
              // Intense glow feedback
              anime({
                targets: poly,
                fill: 'rgba(201,169,110,0.6)',
                duration: 200,
                direction: 'alternate',
                easing: 'easeInOutQuad'
              });
              
              // Fade entire hub
              anime({
                targets: '#hero',
                opacity: 0,
                duration: 800,
                easing: 'easeInOutQuad',
                complete: () => {
                  // Navigate to category page logic
                  console.log(`Navigating to ${zone}...`);
                  // For now, simulate routing by triggering the alpine state
                  // Assuming window.saeedApp exists
                  window.location.hash = zone;
                  setTimeout(() => {
                    anime({
                      targets: '#hero',
                      opacity: 1,
                      duration: 800
                    });
                  }, 1000);
                }
              });
            });
          }
        });
      }

      // 2. Custom Magnetic Cursor Logic
      const cursor = document.getElementById('customCursor');
      if (window.matchMedia("(pointer: fine)").matches && cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let speed = 0.2;

        window.addEventListener('mousemove', e => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        });

        function animateCursor() {
          let distX = mouseX - cursorX;
          let distY = mouseY - cursorY;
          cursorX = cursorX + (distX * speed);
          cursorY = cursorY + (distY * speed);
          cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
          requestAnimationFrame(animateCursor);
        }
        animateCursor();

        function bindCursorHover() {
          const hoverElements = document.querySelectorAll('a:not(.cursor-bound), button:not(.cursor-bound), [role="button"]:not(.cursor-bound), input:not(.cursor-bound), textarea:not(.cursor-bound)');
          hoverElements.forEach(el => {
            el.classList.add('cursor-bound');
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
          });
        }
        bindCursorHover();

        const observer = new MutationObserver(() => bindCursorHover());
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  