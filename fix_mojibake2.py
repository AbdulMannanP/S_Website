import os
import re

def fix_mojibake(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return

    if 'Ø' not in content and 'Ù' not in content:
        return

    print(f"Processing {filepath}...")
    
    # We will try to unmojibake by finding consecutive blocks of windows-1252/latin-1 encoded bytes masquerading as utf-8
    # A robust way is to find segments matching [Ã-ÿ][\x80-\xbf]+ which are typical utf-8 sequences viewed as latin-1.
    # Actually, simpler: replace line by line, but if there's a UnicodeEncodeError, catch it and print the char.
    
    lines = content.split('\n')
    fixed_lines = []
    changes = 0
    
    for i, line in enumerate(lines):
        if 'Ø' in line or 'Ù' in line:
            # We can isolate the strings within quotes, or tags, but let's try to encode with 'cp1252' with error replacement
            try:
                # encode back to cp1252, but ignore chars that aren't in cp1252 (like curly quotes)
                # wait, if we ignore, we lose the curly quotes. 
                # Let's write a regex that matches common mojibake characters and only translates those segments
                
                # Let's just do a manual segment replace.
                # Every match of 2 or more chars in the range 128-255
                def replacer(match):
                    segment = match.group(0)
                    try:
                        return segment.encode('cp1252').decode('utf-8')
                    except Exception:
                        return segment
                        
                fixed_line = re.sub(r'[\x80-\xff]+', replacer, line)
                if fixed_line != line:
                    fixed_lines.append(fixed_line)
                    changes += 1
                else:
                    fixed_lines.append(line)
            except Exception as e:
                print(f"Error on line {i}: {e}")
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
            
    if changes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(fixed_lines))
        print(f"Fixed {changes} lines in {filepath}")

for root, _, files in os.walk('frontend'):
    for file in files:
        if file.endswith('.html'):
            fix_mojibake(os.path.join(root, file))
