import os
import shutil
import argparse

def delete_pycache_and_pyc_files(directory):
    for root, dirs, files in os.walk(directory):
        for name in dirs:
            if name == '__pycache__':
                shutil.rmtree(os.path.join(root, name))
                
        for name in files:
            if name.endswith('.pyc'):
                os.remove(os.path.join(root, name))
                
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Delete __pycache__ directories and .pyc files.')
    parser.add_argument('directory', type=str, help='The directory to clean.')
    
    args = parser.parse_args()
    delete_pycache_and_pyc_files(args.directory)
