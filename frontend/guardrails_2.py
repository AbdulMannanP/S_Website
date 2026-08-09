import os

def apply_strict_guardrails_2():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Swatch Book Redesign
    old_swatch_header = """                <div className="absolute top-8 left-0 w-full px-8 flex justify-between items-center max-w-6xl mx-auto">
                  <h2 className="text-2xl font-light text-[#1C1A17]" style={{ fontFamily: "'Playfair Display', serif" }}>Select a Model to Compare</h2>
                  <button onClick={() => setIsCompareModalOpen(false)} className="w-12 h-12 rounded-full bg-[#1C1A17]/5 border border-[#A68A56]/20 flex items-center justify-center text-[#1C1A17] hover:bg-[#1C1A17]/10 transition-all shadow-sm"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>

                <div className="relative w-full max-w-6xl flex items-center justify-between mt-12 md:mt-16">"""
    new_swatch_header = """                <div className="relative w-full px-8 pt-8 pb-4 flex justify-between items-center max-w-6xl mx-auto z-10 shrink-0">
                  <h2 className="text-xl md:text-2xl font-light text-[#1C1A17]" style={{ fontFamily: "'Playfair Display', serif" }}>Select a Model to Compare</h2>
                  <button onClick={() => setIsCompareModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1C1A17]/5 border border-[#A68A56]/20 flex items-center justify-center text-[#1C1A17] hover:bg-[#1C1A17]/10 transition-all shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>

                <div className="relative w-full max-w-6xl flex items-center justify-between flex-1 overflow-hidden">"""
    content = content.replace(old_swatch_header, new_swatch_header)

    old_grid = """                        className="grid grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4 md:gap-6 w-full"
                      >
                         {currentCompareData.map(item => (
                           <div 
                             key={item.id}
                             onClick={() => { setCompareItem(item); setCompareGalleryIndex(0); setIsCompareModalOpen(false); }}
                             className="relative block w-full aspect-square rounded-2xl overflow-hidden shadow-xl border border-[#A68A56]/20 bg-white group cursor-pointer"
                           >
                              <ImageKitLQIP item={item.gallery[0]} width={400} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#F4EFE6] to-transparent">
                                <p className="text-[#1C1A17] text-xs font-bold leading-tight drop-shadow-md">{item.name}</p>
                              </div>
                           </div>
                         ))}"""
    new_grid = """                        className="grid grid-cols-2 gap-6 w-full pb-8"
                      >
                         {currentCompareData.map(item => (
                           <div 
                             key={item.id}
                             onClick={() => { setCompareItem(item); setCompareGalleryIndex(0); setIsCompareModalOpen(false); }}
                             className="relative block w-full aspect-square rounded-xl overflow-hidden shadow-md border border-[#A68A56]/20 bg-[#F4EFE6] group cursor-pointer"
                           >
                              <ImageKitLQIP item={item.gallery[0]} width={400} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#FDFBF7]/90 via-[#FDFBF7]/60 to-transparent">
                                <p className="text-[#1C1A17] text-[10px] md:text-xs font-bold uppercase tracking-widest line-clamp-2 leading-snug text-balance">{item.name}</p>
                              </div>
                           </div>
                         ))}"""
    content = content.replace(old_grid, new_grid)

    old_page_indicator = """                {/* Page Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                   <p className="text-xs font-bold tracking-widest text-[#1C1A17]/50 uppercase">
                      Page {comparePage + 1} / {totalPages}
                   </p>
                </div>"""
    new_page_indicator = """                {/* Page Indicator */}
                <div className="relative w-full pb-8 pt-4 flex justify-center shrink-0">
                   <p className="text-[10px] font-bold tracking-widest text-[#1C1A17]/50 uppercase">
                      Page {comparePage + 1} / {totalPages}
                   </p>
                </div>"""
    content = content.replace(old_page_indicator, new_page_indicator)

    # 2. Compare Stack View Redesign
    # We will replace the "CHOOSE THIS DESIGN" buttons in both the primary and compare image blocks
    old_primary_btn = """                   {/* Winner Selection UI (Primary side) */}
                   {compareItem && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}
                           className={`px-6 py-3 rounded-full backdrop-blur-md bg-white/20 border border-[#A68A56]/30 text-[#1C1A17] text-xs font-bold uppercase tracking-widest hover:bg-[#A68A56] hover:text-white transition-all shadow-xl flex items-center gap-2 whitespace-nowrap ${'cursor-pointer'}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                          Choose This Design
                        </button>
                      </div>
                   )}"""
    
    new_primary_btn = """                   {/* Winner Selection UI (Primary side) */}
                   {compareItem && (
                      <div className="absolute bottom-4 inset-x-4 z-50 flex justify-center pointer-events-none">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}
                           className={`pointer-events-auto px-5 py-2.5 rounded-full bg-[#FDFBF7]/95 backdrop-blur-md border border-[#A68A56]/20 text-[#1C1A17] text-[10px] font-bold uppercase tracking-widest hover:bg-[#A68A56] hover:text-white hover:border-[#A68A56] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${'cursor-pointer'}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                          Choose {selectedItem.name.split(' ')[0]}
                        </button>
                      </div>
                   )}"""
    content = content.replace(old_primary_btn, new_primary_btn)

    old_compare_btn = """                     {/* Winner Selection UI (Compare side) */}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedItem(compareItem);
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}
                           className={`px-6 py-3 rounded-full backdrop-blur-md bg-white/20 border border-[#A68A56]/30 text-[#1C1A17] text-xs font-bold uppercase tracking-widest hover:bg-[#A68A56] hover:text-white transition-all shadow-xl flex items-center gap-2 whitespace-nowrap ${'cursor-pointer'}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                          Choose This Design
                        </button>
                     </div>"""
    new_compare_btn = """                     {/* Winner Selection UI (Compare side) */}
                     <div className="absolute bottom-4 inset-x-4 z-50 flex justify-center pointer-events-none">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedItem(compareItem);
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}
                           className={`pointer-events-auto px-5 py-2.5 rounded-full bg-[#FDFBF7]/95 backdrop-blur-md border border-[#A68A56]/20 text-[#1C1A17] text-[10px] font-bold uppercase tracking-widest hover:bg-[#A68A56] hover:text-white hover:border-[#A68A56] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${'cursor-pointer'}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                          Choose {compareItem.name.split(' ')[0]}
                        </button>
                     </div>"""
    content = content.replace(old_compare_btn, new_compare_btn)

    # 3. Change rounded-[2rem] to rounded-xl on compare images if applicable.
    # In MobileStaticImage we removed rounded-[2rem] and made it rounded-b-3xl for the main image.
    # But wait, MobileStaticImage is used for both!
    # In `guardrails_1.py` I changed MobileStaticImage to be rounded-b-3xl.
    # If compareItem is true, they are stacked. We don't want rounded-b-3xl on both if they are stacked.
    # Let's override MobileStaticImage to accept a className prop to allow overriding rounded edges!
    old_mobile_static = """const MobileStaticImage = ({ item }) => {
  return (
    <div className="w-full flex items-start justify-center p-0 sm:p-4 bg-[#F4EFE6] rounded-b-3xl overflow-hidden shadow-lg border-b border-[#A68A56]/10">
      <img
        src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-900,q-80,f-auto`}
        loading="lazy"
        alt="Product"
        className="w-full aspect-[4/3] object-cover bg-[#F4EFE6]"
      />
    </div>
  );
};"""
    new_mobile_static = """const MobileStaticImage = ({ item, containerClassName }) => {
  return (
    <div className={`w-full flex items-start justify-center p-0 sm:p-4 bg-[#F4EFE6] overflow-hidden shadow-lg border-b border-[#A68A56]/10 ${containerClassName || 'rounded-b-3xl'}`}>
      <img
        src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-900,q-80,f-auto`}
        loading="lazy"
        alt="Product"
        className="w-full aspect-[4/3] object-cover bg-[#F4EFE6]"
      />
    </div>
  );
};"""
    content = content.replace(old_mobile_static, new_mobile_static)

    # Now pass containerClassName for compare mode images
    old_primary_call = """<MobileStaticImage item={selectedItem.gallery[galleryIndex]} />"""
    new_primary_call = """<MobileStaticImage item={selectedItem.gallery[galleryIndex]} containerClassName={compareItem ? 'rounded-xl mb-2' : 'rounded-b-3xl'} />"""
    content = content.replace(old_primary_call, new_primary_call)

    old_compare_call = """<MobileStaticImage item={compareItem.gallery[compareGalleryIndex]} />"""
    new_compare_call = """<MobileStaticImage item={compareItem.gallery[compareGalleryIndex]} containerClassName="rounded-xl mt-2" />"""
    content = content.replace(old_compare_call, new_compare_call)


    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Guardrails Part 2 Applied")

if __name__ == '__main__':
    apply_strict_guardrails_2()
