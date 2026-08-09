import os

def patch_majlis_jsx():
    file = r'src/react/Majlis.jsx'
    if not os.path.exists(file): return
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the sticky button wrapper for the first compare item
    old_btn1 = """<div className={`${isMobile ? 'sticky bottom-0 left-0 w-full p-4 bg-[#FDFBF7]/90 backdrop-blur-md border-t border-black/10 flex justify-center z-50' : 'absolute bottom-4 left-1/2 -translate-x-1/2 z-20'}`}>"""
    new_btn1 = """<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">"""
    
    content = content.replace(old_btn1, new_btn1)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched Majlis.jsx")

if __name__ == "__main__":
    patch_majlis_jsx()
