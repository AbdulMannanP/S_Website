import os
import glob

def fix_mojibake(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath}: {e}")
        return

    # Check if we have suspicious characters like 'Ø' or 'Ù' commonly found in Arabic mojibake
    if 'Ø' not in content and 'Ù' not in content:
        return

    print(f"Processing {filepath}...")
    
    # We will try to unmojibake line by line or chunk by chunk to avoid breaking valid UTF-8
    lines = content.split('\n')
    fixed_lines = []
    changes = 0
    
    for line in lines:
        if 'Ø' in line or 'Ù' in line:
            # Attempt to unmojibake just the string
            try:
                # encode back to latin-1/windows-1252, then decode as utf-8
                fixed_line = line.encode('windows-1252').decode('utf-8')
                fixed_lines.append(fixed_line)
                changes += 1
            except UnicodeEncodeError:
                # Mixed line, try character by character or word by word?
                # For simplicity, if it fails, just append original.
                # Actually, typically the whole line is either mangled or not, except if it has valid Arabic.
                fixed_lines.append(line)
            except UnicodeDecodeError:
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
