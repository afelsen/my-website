import cv2
import numpy as np
import glob

for file in glob.glob("./drawings/*.png"):
    print(file)
    file = file.replace('\\', '/')
    img = cv2.imread(file)

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGBA)

    mask = (img[:, :, 0:3] == [0,0,0]).all(2)
    img[mask] = (0,0,0,0)

    cv2.imwrite(f"./drawings_rgba/{file.split('/')[-1]}", img)