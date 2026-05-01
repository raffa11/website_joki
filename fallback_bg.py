from PIL import Image
import os

input_dir = 'public/assets/ranks'
for filename in os.listdir(input_dir):
    if filename.endswith('.jpg'):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(input_dir, filename.split('.')[0] + '.png')
        print(f"Processing fallback {input_path}...")
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        newData = []
        for item in datas:
            # If the pixel is very dark (black background) or very light (white background)
            if item[0] < 40 and item[1] < 40 and item[2] < 40:
                newData.append((255, 255, 255, 0)) # transparent
            elif item[0] > 220 and item[1] > 220 and item[2] > 220:
                newData.append((255, 255, 255, 0)) # transparent
            else:
                newData.append(item)
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Saved {output_path}")
