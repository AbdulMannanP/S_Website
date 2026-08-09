import os

def apply_strict_guardrails():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return

    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Image Wrapper: aspect-[4/3] bg-[#F4EFE6] rounded-b-3xl
    # In MobileStaticImage:
    # Change `className="w-full h-full object-cover rounded-[2rem] bg-[#FDFBF7]/50 border border-[#A68A56]/10 shadow-lg"`
    # To `className="w-full aspect-[4/3] object-cover rounded-b-3xl bg-[#F4EFE6] shadow-lg"`
    old_mobile_static = """const MobileStaticImage = ({ item }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-0 sm:p-4">
      <img
        src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-900,q-80,f-auto`}
        loading="lazy"
        alt="Product"
        className="w-full h-full object-cover rounded-[2rem] bg-[#FDFBF7]/50 border border-[#A68A56]/10 shadow-lg"
      />
    </div>
  );
};"""
    new_mobile_static = """const MobileStaticImage = ({ item }) => {
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
    content = content.replace(old_mobile_static, new_mobile_static)

    # 2. Main Container Z-Index and Scroll Clearance (pb-36)
    # Change: `className={`fixed inset-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-3xl pt-[80px] ${`
    # To: `className={`fixed inset-0 z-[9999] bg-[#FDFBF7]/90 backdrop-blur-3xl pt-[80px] ${`
    # And change: `? 'flex flex-col h-[100dvh] md:h-auto max-h-[90vh] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch pb-24' `
    # To: `? 'flex flex-col h-[100dvh] md:h-auto max-h-[90vh] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch pb-36' `
    content = content.replace(
        "className={`fixed inset-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-3xl pt-[80px] ${",
        "className={`fixed inset-0 z-[9999] bg-[#FDFBF7]/90 backdrop-blur-3xl pt-[80px] ${"
    )
    content = content.replace(
        "? 'flex flex-col h-[100dvh] md:h-auto max-h-[90vh] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch pb-24' ",
        "? 'flex flex-col h-[100dvh] md:h-auto max-h-[90vh] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch pb-36' "
    )

    # 3. Close Button: fixed top-6 right-6
    # Change: className={`absolute top-4 right-4 z-[60]...
    # To: className={`fixed top-6 right-6 z-[9999]...
    old_close = """className={`absolute top-4 right-4 z-[60] bg-[#FDFBF7] rounded-full p-2 shadow-sm flex items-center justify-center gap-3 text-[#1C1A17] md:hover:bg-[#1C1A17]/10 hover:scale-105 transition-all ${'cursor-pointer'}`}"""
    new_close = """className={`fixed top-6 right-6 z-[9999] bg-[#FDFBF7]/90 backdrop-blur-md rounded-full p-3 shadow-md border border-black/5 flex items-center justify-center gap-3 text-[#1C1A17] md:hover:bg-[#1C1A17]/10 hover:scale-105 transition-all ${'cursor-pointer'}`}"""
    content = content.replace(old_close, new_close)

    # 4. Main View CTA Footer Fixed bottom-0
    old_footer = """            {/* Mobile Native Sticky Footer for CTA Buttons */}
            {isMobile && !compareItem && (
               <div className="sticky bottom-0 left-0 w-full p-4 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-black/5 flex justify-center gap-4 z-50">"""
    new_footer = """            {/* Mobile Native Fixed Footer for CTA Buttons */}
            {isMobile && !compareItem && (
               <div className="fixed bottom-0 left-0 w-full px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-[#FDFBF7]/95 backdrop-blur-md border-t border-black/5 flex justify-center gap-4 z-[9999] shadow-[0_-10px_40px_rgba(253,251,247,0.8)]">"""
    content = content.replace(old_footer, new_footer)

    # 5. Fix Mobile Image Wrapper height container
    old_img_wrapper = """                 <div
                   style={compareItem && isMobile ? { height: '45vh', width: '100%', position: 'relative' } : (!isMobile ? { flex: 1, width: '100%', height: '100%', position: 'relative' } : { position: 'relative' })}
                   className={
                     !compareItem && isMobile 
                        ? 'w-full h-[45vh] min-h-[300px] flex-none relative' 
                        : 'relative w-full h-full flex items-center justify-center'
                   }
                 >"""
    new_img_wrapper = """                 <div
                   style={compareItem && isMobile ? { height: 'auto', width: '100%', position: 'relative' } : (!isMobile ? { flex: 1, width: '100%', height: '100%', position: 'relative' } : { position: 'relative' })}
                   className={
                     !compareItem && isMobile 
                        ? 'w-full flex-none relative' 
                        : 'relative w-full h-full flex items-center justify-center'
                   }
                 >"""
    content = content.replace(old_img_wrapper, new_img_wrapper)
    
    # 6. Remove `absolute inset-0` from the Mobile static image container so it can dictate its own aspect ratio height
    old_mobile_static_container = """                   {isMobile ? (
                     // MOBILE: strictly positioned, clean static img
                     <div className="w-full h-full absolute inset-0">
                       <MobileStaticImage item={selectedItem.gallery[galleryIndex]} />
                     </div>
                   ) : ("""
    new_mobile_static_container = """                   {isMobile ? (
                     // MOBILE: strictly positioned, clean static img
                     <div className="w-full">
                       <MobileStaticImage item={selectedItem.gallery[galleryIndex]} />
                     </div>
                   ) : ("""
    content = content.replace(old_mobile_static_container, new_mobile_static_container)
    
    # Also for Compare mode mobile image wrapper:
    old_compare_mobile_img = """                 {compareItem && (
                   <div
                     style={isMobile ? { height: '45vh', width: '100%', position: 'relative' } : { flex: 1, width: '100%', height: '100%', position: 'relative' }}
                     className="relative w-full h-full"
                   >
                     <motion.div
                       style={{ x: isMobile ? gyro.x : 0, y: isMobile ? gyro.y : 0 }}
                       className="absolute inset-0 w-full h-full"
                     >"""
    new_compare_mobile_img = """                 {compareItem && (
                   <div
                     style={isMobile ? { width: '100%', position: 'relative' } : { flex: 1, width: '100%', height: '100%', position: 'relative' }}
                     className="relative w-full h-full"
                   >
                     <motion.div
                       style={{ x: isMobile ? gyro.x : 0, y: isMobile ? gyro.y : 0 }}
                       className="relative w-full"
                     >"""
    content = content.replace(old_compare_mobile_img, new_compare_mobile_img)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Guardrails Part 1 Applied")

if __name__ == '__main__':
    apply_strict_guardrails()
