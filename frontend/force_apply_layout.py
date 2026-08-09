import os

def force_apply_layout():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    old_block = """               <motion.div 
                 layout
                 className={`w-full relative flex items-center justify-center transition-all duration-500
                   ${compareItem
                     ? isMobile
                       ? 'flex-col gap-4 flex-none'        // Mobile: stacked
                       : 'flex-row gap-4 flex-1'           // Desktop: side-by-side
                     : 'flex-1 flex-col'
                   }`}
                 style={{ height: isInterceptDrawerOpen ? (isMobile ? 'auto' : '60%') : '100%' }}
              >
                 {/* ── PRIMARY IMAGE ─────────────────────────────────────
                     Phase 2 fix: forced min-height so text panel cannot crush the image on mobile */}
                 <div
                   style={compareItem && isMobile ? { height: 'auto', width: '100%', position: 'relative' } : (!isMobile ? { flex: 1, width: '100%', height: '100%', position: 'relative' } : { position: 'relative' })}
                   className={
                     !compareItem && isMobile 
                        ? 'w-full flex-none relative' 
                        : 'relative w-full h-full flex items-center justify-center'
                   }
                 >
                   {isMobile ? (
                     // MOBILE: strictly positioned, clean static img
                     <div className="w-full">
                       <MobileStaticImage item={selectedItem.gallery[galleryIndex]} containerClassName={compareItem ? 'rounded-xl mb-2' : 'rounded-b-3xl'} />
                     </div>
                   ) : (
                     // DESKTOP: full synchronized magnifier engine
                     <motion.div
                       className="absolute inset-0 w-full h-full"
                     >
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

                   {/* Winner Selection UI (Primary side) */}
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
                   )}

                 </div>

                 {/* ── COMPARE IMAGE ─────────────────────────────────────
                     Layout: Mobile = 45vh height block, Desktop = flex-1 side panel */}
                 {compareItem && (
                   <div
                     style={isMobile ? { width: '100%', position: 'relative' } : { flex: 1, width: '100%', height: '100%', position: 'relative' }}
                     className="relative w-full h-full"
                   >
                     <motion.div
                       style={{ x: isMobile ? gyro.x : 0, y: isMobile ? gyro.y : 0 }}
                       className="relative w-full"
                     >
                       {isMobile ? (
                         // MOBILE: lightweight static image — no zoom engine overhead
                         <MobileStaticImage item={compareItem.gallery[compareGalleryIndex]} containerClassName="rounded-xl mt-2" />
                       ) : (
                         // DESKTOP: full synchronized magnifier
                         <SynchronizedZoomImage
                           item={compareItem.gallery[compareGalleryIndex]}
                           isTouchDevice={isTouchDevice}
                           isZoomingLeft={isZoomingLeft} isZoomingRight={isZoomingRight}
                           zoomXLeft={zoomXLeft} zoomYLeft={zoomYLeft}
                           zoomXRight={zoomXRight} zoomYRight={zoomYRight}
                           side="right"
                         />
                       )}
                     </motion.div>

                     <button
                       onClick={() => setCompareItem(null)}
                       className="absolute top-4 right-4 bg-[#FDFBF7]/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-[#1C1A17]/60 hover:text-[#1C1A17] hover:bg-[#FDFBF7] transition-all border border-[#A68A56]/20 shadow-2xl z-[60]"
                     >
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                     </button>

                     {/* Winner Selection UI (Compare side) */}
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
                     </div>
                   </div>
                 )}
               </motion.div>"""

    new_block = """               <motion.div 
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
               </motion.div>"""

    if old_block in content:
        content = content.replace(old_block, new_block)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Force applied successfully.")
    else:
        print("Failed to find exact string block.")

if __name__ == '__main__':
    force_apply_layout()
