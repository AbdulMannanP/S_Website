import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """            <div x-ref="carousel" class="flex h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
              <div class="relative w-full h-full snap-center flex-none" x-data="{ loaded: false }">
                <img :src="IMAGE_BASE_URL + 'images/modern.png'" loading="lazy" @load="loaded = true" class="absolute inset-0 w-full h-full object-cover transition-all duration-700" :class="loaded ? 'blur-0' : 'blur-md'" alt="Modern">
              </div>
              <div class="relative w-full h-full snap-center flex-none" x-data="{ loaded: false }">
                <img :src="IMAGE_BASE_URL + 'images/authentic.png'" loading="lazy" @load="loaded = true" class="absolute inset-0 w-full h-full object-cover transition-all duration-700" :class="loaded ? 'blur-0' : 'blur-md'" alt="Authentic">
              </div>
              <div class="relative w-full h-full snap-center flex-none" x-data="{ loaded: false }">
                <img :src="IMAGE_BASE_URL + 'images/heritage.png'" loading="lazy" @load="loaded = true" class="absolute inset-0 w-full h-full object-cover transition-all duration-700" :class="loaded ? 'blur-0' : 'blur-md'" alt="Heritage">
              </div>
            </div>"""

replacement = """            <div x-ref="carousel" class="flex h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
              <div class="relative w-full h-full snap-center flex-none group/img cursor-none" x-data="{ loaded: false }">
                <div class="absolute inset-0 overflow-hidden bg-black">
                  <img :src="IMAGE_BASE_URL + 'images/modern.png'" loading="lazy" @load="loaded = true" class="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/img:scale-95 group-hover/img:opacity-70" :class="loaded ? 'blur-0' : 'blur-md'" alt="Modern">
                </div>
                <div class="absolute inset-0 border border-gold/0 group-hover/img:border-gold/30 transition-all duration-[1.5s] pointer-events-none scale-105 group-hover/img:scale-95"></div>
              </div>
              <div class="relative w-full h-full snap-center flex-none group/img cursor-none" x-data="{ loaded: false }">
                <div class="absolute inset-0 overflow-hidden bg-black">
                  <img :src="IMAGE_BASE_URL + 'images/authentic.png'" loading="lazy" @load="loaded = true" class="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/img:scale-95 group-hover/img:opacity-70" :class="loaded ? 'blur-0' : 'blur-md'" alt="Authentic">
                </div>
                <div class="absolute inset-0 border border-gold/0 group-hover/img:border-gold/30 transition-all duration-[1.5s] pointer-events-none scale-105 group-hover/img:scale-95"></div>
              </div>
              <div class="relative w-full h-full snap-center flex-none group/img cursor-none" x-data="{ loaded: false }">
                <div class="absolute inset-0 overflow-hidden bg-black">
                  <img :src="IMAGE_BASE_URL + 'images/heritage.png'" loading="lazy" @load="loaded = true" class="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/img:scale-95 group-hover/img:opacity-70" :class="loaded ? 'blur-0' : 'blur-md'" alt="Heritage">
                </div>
                <div class="absolute inset-0 border border-gold/0 group-hover/img:border-gold/30 transition-all duration-[1.5s] pointer-events-none scale-105 group-hover/img:scale-95"></div>
              </div>
            </div>"""

if target in content:
    content = content.replace(target, replacement)
    with codecs.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Carousel images updated.")
else:
    print("Target not found.")
