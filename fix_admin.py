import os
import re

def fix_mojibake(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return
        
    print(f"Processing {filepath}...")
    
    # We will replace all occurrences of â€” with —, Ã— with ×, etc.
    replacements = {
        'â€”': '—',
        'Ã—': '×',
        'â€“': '–',
        'â€™': "'",
        'â€œ': '"',
        'â€ ': '"'
    }
    
    changes = 0
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        fixed_line = line
        for bad, good in replacements.items():
            if bad in fixed_line:
                fixed_line = fixed_line.replace(bad, good)
                changes += 1
        fixed_lines.append(fixed_line)
        
    if changes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(fixed_lines))
        print(f"Fixed {changes} instances in {filepath}")

fix_mojibake('frontend/dashboard/admin.html')
