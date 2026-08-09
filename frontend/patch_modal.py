import os

def patch_majlis_modal():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # CHUNK 1: Move Close Button
    old_close = """            {/* Mobile Absolute Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleCloseFocusMode}
              className={`absolute top-24 right-6 md:top-28 md:right-8 z-[60] px-6 h-12 md:h-14 rounded-full bg-[#1C1A17]/5 backdrop-blur-xl border border-[#A68A56]/20 flex items-center justify-center gap-3 text-[#1C1A17] md:hover:bg-[#1C1A17]/10 hover:scale-105 transition-all shadow-xl ${'cursor-pointer'}`}
            >
              {isInterceptDrawerOpen ? (
                 <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                   Back
                 </span>
              ) : (
                 <svg className="transition-transform duration-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              )}
            </motion.button>

            <div className={`relative w-full h-full max-w-[1600px] flex flex-col lg:flex-row gap-6 lg:gap-10 z-10 pt-24 lg:pt-0`}>"""

    new_close = """            <div className={`relative w-full h-full max-w-[1600px] flex flex-col lg:flex-row gap-6 lg:gap-10 z-10 pt-24 lg:pt-0`}>
            {/* Mobile Absolute Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleCloseFocusMode}
              className={`absolute top-4 right-4 z-[60] bg-[#FDFBF7] rounded-full p-2 shadow-sm flex items-center justify-center gap-3 text-[#1C1A17] md:hover:bg-[#1C1A17]/10 hover:scale-105 transition-all ${'cursor-pointer'}`}
            >
              {isInterceptDrawerOpen ? (
                 <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                   Back
                 </span>
              ) : (
                 <svg className="transition-transform duration-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              )}
            </motion.button>"""

    if old_close in content:
        content = content.replace(old_close, new_close)
        print("Patched Chunk 1")
    else:
        print("Could not find Chunk 1")

    # CHUNK 2: Data Panel, inline drawer, sticky footer
    old_data = """              {/* Data Panel - SILENT SPLIT SCREEN (Hides during comparison)
                  Phase 2 fix: overflow-y-auto so content scrolls on short mobile screens */}
              {!compareItem && (
                 <motion.div
                   layout
                   className={`shrink-0 flex flex-col justify-start lg:justify-center py-8 lg:py-0 ${
                     isMobile ? 'w-full px-4 sm:px-8 pb-4' : 'w-full lg:w-[450px]'
                   }`}
                 >
                   {/* Primary Gallery Controls (Moved from absolute image overlay) */}
                   {selectedItem.gallery.length > 1 && (
                      <div className="flex items-center justify-start gap-3 mb-6 w-full">
                         <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev > 0 ? prev - 1 : selectedItem.gallery.length - 1); }} className="text-[#1C1A17]/50 hover:text-[#1C1A17]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                         {selectedItem.gallery.map((_, idx) => (
                           <button key={idx} onClick={(e) => { e.stopPropagation(); setGalleryIndex(idx); }} className={`w-2 h-2 rounded-full transition-all duration-300 ${galleryIndex === idx ? 'bg-[#A68A56] scale-125' : 'bg-[#1C1A17]/20'}`} />
                         ))}
                         <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev < selectedItem.gallery.length - 1 ? prev + 1 : 0); }} className="text-[#1C1A17]/50 hover:text-[#1C1A17]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
                      </div>
                   )}

                   {/* Elegant Bronze Dash */}
                   <div className="w-12 h-[2px] bg-[#A68A56] mb-6" />
                   
                   <p className="text-[#A68A56] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                     {selectedItem.collection}
                   </p>
                   <h2 className="text-4xl lg:text-5xl font-light text-[#1C1A17] mb-6 leading-snug tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                     {selectedItem.name}
                   </h2>
                   <p className="text-[#1C1A17]/70 text-sm leading-relaxed mb-10 font-light">
                     {selectedItem.desc}
                   </p>
                   
                   <div className={`${isMobile ? 'sticky bottom-0 left-0 w-full p-4 bg-[#FDFBF7]/90 backdrop-blur-md border-t border-black/10 flex gap-4 z-50' : 'grid grid-cols-2 gap-3 mt-8 w-full'}`}>
                     <button 
                       onClick={() => setIsBespokeModalOpen(true)}
                       className={`${isMobile ? 'flex-1' : 'w-full'} py-4 px-2 bg-[#A68A56] text-white rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17] active:scale-95 transition-all shadow-[0_0_30px_rgba(166,138,86,0.2)] ${'cursor-pointer'}`}
                     >
                       Request Bespoke
                     </button>
                     <button 
                       onClick={() => { setComparePage(0); setIsCompareModalOpen(true); }}
                       className={`${isMobile ? 'flex-1' : 'w-full'} py-4 px-2 bg-transparent border border-[#A68A56]/30 text-[#1C1A17] rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17]/5 transition-all ${'cursor-pointer'}`}
                     >
                       Compare Models
                     </button>
                   </div>
                 </motion.div>
              )}
              
            </div>

            {/* Intercept Drawer (Similar Models) */}
            <AnimatePresence>
               {isInterceptDrawerOpen && (
                 <motion.div 
                   initial={{ y: "100%", opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: "100%", opacity: 0 }}
                   transition={{ type: "spring", damping: 25, stiffness: 200 }}
                   className="absolute bottom-0 md:bottom-4 left-0 md:left-4 right-0 md:right-4 bg-[#FDFBF7]/95 backdrop-blur-3xl border-t md:border border-[#A68A56]/20 rounded-t-[2rem] md:rounded-[2rem] p-6 lg:p-8 z-50 shadow-2xl"
                 >
                    <h3 className="text-[#1C1A17]/80 text-sm tracking-widest uppercase font-bold mb-6">Similar in this Collection</h3>
                    <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory gap-4 pb-4 lg:pb-0 hide-scrollbar">
                      {getRecommendations().map(rec => (
                        <div 
                           key={rec.id} 
                           onClick={() => { setSelectedItem(rec); setIsInterceptDrawerOpen(false); }}
                           className="min-w-[70vw] sm:min-w-[40vw] lg:min-w-0 snap-center relative aspect-video rounded-xl overflow-hidden bg-white border border-[#A68A56]/20 cursor-pointer hover:border-[#A68A56] transition-all group"
                        >
                           <ImageKitLQIP item={rec.gallery[0]} width={400} className="absolute inset-0 w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE6]/90 via-[#F4EFE6]/0 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-end p-4">
                             <p className="text-xs text-[#1C1A17] font-bold tracking-tight">{rec.name}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>"""

    new_data = """              {/* Data Panel - SILENT SPLIT SCREEN (Hides during comparison)
                  Phase 2 fix: overflow-y-auto so content scrolls on short mobile screens */}
              {!compareItem && (
                 <motion.div
                   layout
                   className={`shrink-0 flex flex-col justify-start lg:justify-center py-8 lg:py-0 ${
                     isMobile ? 'w-full pb-4' : 'w-full lg:w-[450px]'
                   }`}
                 >
                   <p className="text-[#A68A56] text-xs font-bold uppercase tracking-[0.2em] mb-2 mt-4 px-4 sm:px-8 lg:px-0">
                     {selectedItem.collection}
                   </p>
                   <h2 className="text-3xl font-serif mt-6 px-4 sm:px-8 lg:px-0 mb-4 leading-snug tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                     {selectedItem.name}
                   </h2>
                   
                   {/* Elegant Bronze Dash */}
                   <div className="w-12 h-[2px] bg-[#A68A56] mb-4 mx-4 sm:mx-8 lg:mx-0" />
                   
                   {/* Primary Gallery Controls */}
                   {selectedItem.gallery.length > 1 && (
                      <div className="flex items-center justify-start gap-3 mb-6 mt-4 w-full px-4 sm:px-8 lg:px-0">
                         <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev > 0 ? prev - 1 : selectedItem.gallery.length - 1); }} className="text-[#1C1A17]/50 hover:text-[#1C1A17]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                         {selectedItem.gallery.map((_, idx) => (
                           <button key={idx} onClick={(e) => { e.stopPropagation(); setGalleryIndex(idx); }} className={`w-2 h-2 rounded-full transition-all duration-300 ${galleryIndex === idx ? 'bg-[#A68A56] scale-125' : 'bg-[#1C1A17]/20'}`} />
                         ))}
                         <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev < selectedItem.gallery.length - 1 ? prev + 1 : 0); }} className="text-[#1C1A17]/50 hover:text-[#1C1A17]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
                      </div>
                   )}

                   <p className="text-[#1C1A17]/70 text-sm leading-relaxed mb-8 font-light px-4 sm:px-8 lg:px-0">
                     {selectedItem.desc}
                   </p>
                   
                   {/* Similar Models Slider inline */}
                   <div className="mt-4 w-full">
                     <h3 className="text-[#1C1A17]/80 text-sm tracking-widest uppercase font-bold mb-4 px-4 sm:px-8 lg:px-0">Similar in this Collection</h3>
                     <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory gap-4 pb-4 px-4 sm:px-8 lg:px-0 hide-scrollbar">
                       {getRecommendations().map(rec => (
                         <div 
                            key={rec.id} 
                            onClick={() => { setSelectedItem(rec); setIsInterceptDrawerOpen(false); }}
                            className="min-w-[70vw] sm:min-w-[40vw] lg:min-w-0 snap-center relative aspect-video rounded-xl overflow-hidden bg-white border border-[#A68A56]/20 cursor-pointer hover:border-[#A68A56] transition-all group"
                         >
                            <ImageKitLQIP item={rec.gallery[0]} width={400} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE6]/90 via-[#F4EFE6]/0 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-end p-4">
                              <p className="text-xs text-[#1C1A17] font-bold tracking-tight">{rec.name}</p>
                            </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Desktop Buttons (Only show in flow on desktop, mobile has sticky footer) */}
                   {!isMobile && (
                     <div className="grid grid-cols-2 gap-3 mt-8 w-full">
                       <button 
                         onClick={() => setIsBespokeModalOpen(true)}
                         className="w-full py-4 px-2 bg-[#A68A56] text-white rounded-full text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17] active:scale-95 transition-all shadow-[0_0_30px_rgba(166,138,86,0.2)] cursor-pointer"
                       >
                         Request Bespoke
                       </button>
                       <button 
                         onClick={() => { setComparePage(0); setIsCompareModalOpen(true); }}
                         className="w-full py-4 px-2 bg-transparent border border-[#A68A56]/30 text-[#1C1A17] rounded-full text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17]/5 transition-all cursor-pointer"
                       >
                         Compare Models
                       </button>
                     </div>
                   )}
                 </motion.div>
              )}
              
            </div>

            {/* Mobile Native Sticky Footer for CTA Buttons */}
            {isMobile && !compareItem && (
               <div className="sticky bottom-0 left-0 w-full p-4 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-black/5 flex justify-center gap-4 z-50">
                 <button 
                   onClick={() => setIsBespokeModalOpen(true)}
                   className="flex-1 py-4 px-2 bg-[#A68A56] text-white rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17] active:scale-95 transition-all shadow-[0_0_30px_rgba(166,138,86,0.2)] cursor-pointer"
                 >
                   Request Bespoke
                 </button>
                 <button 
                   onClick={() => { setComparePage(0); setIsCompareModalOpen(true); }}
                   className="flex-1 py-4 px-2 bg-transparent border border-[#A68A56]/30 text-[#1C1A17] rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17]/5 transition-all cursor-pointer"
                 >
                   Compare Models
                 </button>
               </div>
            )}"""

    if old_data in content:
        content = content.replace(old_data, new_data)
        print("Patched Chunk 2")
    else:
        print("Could not find Chunk 2")

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    patch_majlis_modal()
