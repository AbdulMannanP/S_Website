import re
import os

def fix_mobile_modals():
    file = r'src/react/Majlis.jsx'
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Unified Scroll Context (The "Invisible Wall" Fix)
    # Target: The Product View Modal (selectedItem) wrapper
    old_wrapper = """className={`fixed inset-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-3xl pt-[80px] ${
              isMobile 
                ? 'flex flex-col h-[100dvh] overflow-hidden' 
                : 'flex items-center justify-center p-4 md:p-8 overflow-y-auto'
            }`}"""
    new_wrapper = """className={`fixed inset-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-3xl pt-[80px] ${
              isMobile 
                ? 'flex flex-col h-[100dvh] md:h-auto max-h-[90vh] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch pb-24' 
                : 'flex items-center justify-center p-4 md:p-8 overflow-y-auto'
            }`}"""
    content = content.replace(old_wrapper, new_wrapper)
    
    # Remove overflow-y-auto from the text panel child on mobile
    old_text_panel = """className={`shrink-0 flex flex-col justify-start lg:justify-center py-8 lg:py-0 ${
                     isMobile ? 'flex-1 w-full min-h-0 overflow-y-auto pb-32 px-4 sm:px-8' : 'w-full lg:w-[450px]'
                   }`}"""
    new_text_panel = """className={`shrink-0 flex flex-col justify-start lg:justify-center py-8 lg:py-0 ${
                     isMobile ? 'w-full px-4 sm:px-8 pb-4' : 'w-full lg:w-[450px]'
                   }`}"""
    content = content.replace(old_text_panel, new_text_panel)

    # 2. Native Bottom Action Bar
    old_cta_grid = """<div className="grid grid-cols-2 gap-3 mt-8 w-full">
                     <button 
                       onClick={() => setIsBespokeModalOpen(true)}
                       className={`w-full py-4 px-2 bg-[#A68A56] text-white rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17] active:scale-95 transition-all shadow-[0_0_30px_rgba(166,138,86,0.2)] ${'cursor-pointer'}`}
                     >
                       Request Bespoke
                     </button>
                     <button 
                       onClick={() => { setComparePage(0); setIsCompareModalOpen(true); }}
                       className={`w-full py-4 px-2 bg-transparent border border-[#A68A56]/30 text-[#1C1A17] rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17]/5 transition-all ${'cursor-pointer'}`}
                     >
                       Compare Models
                     </button>
                   </div>"""
                   
    new_cta_grid = """<div className={`${isMobile ? 'sticky bottom-0 left-0 w-full p-4 bg-[#FDFBF7]/90 backdrop-blur-md border-t border-black/10 flex gap-4 z-50' : 'grid grid-cols-2 gap-3 mt-8 w-full'}`}>
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
                   </div>"""
    content = content.replace(old_cta_grid, new_cta_grid)
    
    # "Choose This Design" Sticky Bottom (Primary and Compare Views)
    # We find both absolute bottom-4 left-1/2 -translate-x-1/2 z-20 containers and turn them into sticky footers on mobile.
    old_choose_1 = """<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}"""
    new_choose_1 = """<div className={`${isMobile ? 'sticky bottom-0 left-0 w-full p-4 bg-[#FDFBF7]/90 backdrop-blur-md border-t border-black/10 flex justify-center z-50' : 'absolute bottom-4 left-1/2 -translate-x-1/2 z-20'}`}>
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}"""
    content = content.replace(old_choose_1, new_choose_1)
    
    old_choose_2 = """<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedItem(compareItem);
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}"""
    new_choose_2 = """<div className={`${isMobile ? 'sticky bottom-0 left-0 w-full p-4 bg-[#FDFBF7]/90 backdrop-blur-md border-t border-black/10 flex justify-center z-50' : 'absolute bottom-4 left-1/2 -translate-x-1/2 z-20'}`}>
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedItem(compareItem);
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}"""
    content = content.replace(old_choose_2, new_choose_2)
    
    # 3. Modal Close Button (X) Z-Index Fix
    old_close = """className="absolute top-4 right-4 bg-[#FDFBF7]/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-[#1C1A17]/60 hover:text-[#1C1A17] hover:bg-[#FDFBF7] transition-all border border-[#A68A56]/20 shadow-2xl z-30\""""
    new_close = """className="absolute top-4 right-4 bg-[#FDFBF7]/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-[#1C1A17]/60 hover:text-[#1C1A17] hover:bg-[#FDFBF7] transition-all border border-[#A68A56]/20 shadow-2xl z-[60]\""""
    content = content.replace(old_close, new_close)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed mobile modals in Majlis.jsx")

if __name__ == '__main__':
    fix_mobile_modals()
