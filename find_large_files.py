import os
from pathlib import Path

def find_large_files(directory, size_limit_mb=50):
    size_limit_bytes = size_limit_mb * 1024 * 1024
    large_files = []
    
    for root, dirs, files in os.walk(directory):
        if '.git' in dirs:
            dirs.remove('.git')
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.venv' in dirs:
            dirs.remove('.venv')
            
        for file in files:
            path = Path(root) / file
            try:
                size = path.stat().st_size
                if size > size_limit_bytes:
                    large_files.append((str(path), size))
            except Exception:
                pass
                
    return large_files

large_files = find_large_files('.')
if large_files:
    print("Found the following large files (> 50MB):")
    for file, size in large_files:
        print(f"- {file} ({size / (1024*1024):.2f} MB)")
else:
    print("No files larger than 50MB found.")
