import os

def force_apply_by_lines():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return

    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = """               <motion.div 
                 layout
                 className={`w-full relative transition-all duration-500
                   ${compareItem
                     ? 'flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 pt-4 px-4 md:px-8'
                     : 'flex items-center justify-center flex-1 flex-col'
                   }`}
                 style={{ height: isInterceptDrawerOpen && !compareItem ? (isMobile ? 'auto' : '60%') : 'auto' }}
              >
                 {!compareItem ? (
                    // MAIN PRODUCT VIEW
                    <div
                      className={isMobile ? 'w-full flex-none relative' : 'relative w-full h-full flex items-center justify-center'}
                    >
                       {isMobile ? (
                         <div className="w-full">
                           <MobileStaticImage item={selectedItem.gallery[galleryIndex]} containerClassName="rounded-b-3xl" />
                         </div>
                       ) : (
                         <motion.div className="absolute inset-0 w-full h-full">
                           <SynchronizedZoomImage
                             item={selectedItem.gallery[galleryIndex]}
                             isTouchDevice={isTouchDevice}
                             isZoomingLeft={isZoomingLeft} isZoomingRight={isZoomingRight}
                             zoomXLeft={zoomXLeft} zoomYLeft={zoomYLeft}
                             zoomXRight={zoomXRight} zoomYRight={zoomYRight}
                             side="left"
                           />
                         </motion.div>
                       )}
                    </div>
                 ) : (
                    // UNIVERSAL CARD STRUCTURE (Compare Stack View)
                    <>
                      {/* Card 1: Selected Item */}
                      <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto mb-8">
                        {/* The Image Wrapper */}
                        <div className="relative w-full rounded-xl overflow-hidden aspect-[16/9] md:aspect-[3/2]">
                          {/* Global Image Rendering - purely responsive <img> tag */}
                          <img 
                            src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${selectedItem.gallery[galleryIndex]}?tr=w-1200,q-80,f-auto`}
                            alt={selectedItem.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* The Button */}
                          <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setCompareItem(null);
                               setIsBespokeModalOpen(true);
                             }}
                             className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 bg-[#FDFBF7]/95 backdrop-blur-md rounded-full shadow-sm text-xs uppercase tracking-widest font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[#A68A56] hover:text-white transition-all"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Choose {selectedItem.name.split(' ')[0]}
                          </button>
                        </div>
                        {/* The Title */}
                        <h3 className="text-center text-[#1C1A17] font-serif text-lg md:text-xl">{selectedItem.name}</h3>
                      </div>

                      {/* Card 2: Compare Item */}
                      <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto mb-8 relative">
                        {/* Close button for compare view */}
                        <button
                          onClick={() => setCompareItem(null)}
                          className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center text-[#1C1A17]/60 hover:text-[#1C1A17] hover:bg-[#FDFBF7] transition-all border border-[#A68A56]/20 shadow-sm z-[60] bg-white/50 backdrop-blur-md cursor-pointer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        
                        {/* The Image Wrapper */}
                        <div className="relative w-full rounded-xl overflow-hidden aspect-[16/9] md:aspect-[3/2]">
                          {/* Global Image Rendering - purely responsive <img> tag */}
                          <img 
                            src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${compareItem.gallery[compareGalleryIndex]}?tr=w-1200,q-80,f-auto`}
                            alt={compareItem.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* The Button */}
                          <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setSelectedItem(compareItem);
                               setCompareItem(null);
                               setIsBespokeModalOpen(true);
                             }}
                             className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 bg-[#FDFBF7]/95 backdrop-blur-md rounded-full shadow-sm text-xs uppercase tracking-widest font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[#A68A56] hover:text-white transition-all"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Choose {compareItem.name.split(' ')[0]}
                          </button>
                        </div>
                        {/* The Title */}
                        <h3 className="text-center text-[#1C1A17] font-serif text-lg md:text-xl">{compareItem.name}</h3>
                      </div>
                    </>
                 )}
               </motion.div>
"""
    # Lines 476 to 588 inclusive (0-indexed 475 to 588)
    # Be careful! Let's find exactly where <motion.div layout starts and ends.
    start_idx = -1
    end_idx = -1
    for i in range(470, 480):
        if "<motion.div " in lines[i] and "layout" in lines[i+1]:
            start_idx = i
            break
            
    for i in range(580, 595):
        if "</motion.div>" in lines[i] and "Data Panel" in lines[i+2]:
            end_idx = i
            break

    if start_idx != -1 and end_idx != -1:
        new_content = "".join(lines[:start_idx]) + new_lines + "".join(lines[end_idx+1:])
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success! Lines {} to {} replaced.".format(start_idx, end_idx))
    else:
        print("Failed to find indices. Start: {}, End: {}".format(start_idx, end_idx))

if __name__ == '__main__':
    force_apply_by_lines()
