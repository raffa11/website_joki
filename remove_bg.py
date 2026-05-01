import os
from rembg import remove
from PIL import Image

input_dir = 'public/assets/ranks'
for filename in os.listdir(input_dir):
    if filename.endswith('.jpg') or filename.endswith('.png'):
        if filename == 'Stars.png': 
            continue # Don't remove bg for stars, it's already png
        if filename.endswith('.png'):
            # It might already be a png from previous run, let's process original jpgs if they exist, or process this png if no jpg exists
            pass
        
        input_path = os.path.join(input_dir, filename)
        output_filename = filename.split('.')[0] + '.png'
        output_path = os.path.join(input_dir, output_filename)
        
        if not filename.endswith('.jpg') and os.path.exists(os.path.join(input_dir, filename.split('.')[0] + '.jpg')):
            continue # Skip processing png if jpg exists, we will process jpg
        
        print(f"Processing {input_path} to {output_path}...")
        try:
            input_image = Image.open(input_path)
            output_image = remove(input_image)
            output_image.save(output_path)
            print(f"Successfully processed {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
