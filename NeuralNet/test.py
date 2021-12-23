import cv2
import numpy as np

img = cv2.imread("./drawings/eraser_1.png")

img = cv2.cvtColor(img, cv2.COLOR_BGR2RGBA)

mask = (img[:, :, 0:3] == [0,0,0]).all(2)
img[mask] = (0,0,0,0)

img = cv2.rotate(img, cv2.ROTATE_180)

cv2.imwrite("eraser_1_a.png", img)