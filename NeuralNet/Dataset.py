import glob
import cv2
import random
import numpy as np
import sys
import struct
from struct import unpack
from torch.utils.data import Dataset
import matplotlib.pyplot as plt

FILTER_WINDOW = 3
DEGREE = 3

class Drawing_Dataset(Dataset):
    def __init__(self, train = False):
        self.data = []
        self.classes = ["book", "computer", "face"]
        class_data = [[]]*len(self.classes)
        for i in range(len(self.classes)):
            for drawing in self.unpack_drawings(f"Data/full_binary_{self.classes[i]}.bin"):
                if drawing['recognized']:
                    im = drawing['image']

                    class_data[i].append(im)

    def drawing_to_np(self, drawing, shape=(256, 256)):
        # evaluates the drawing array
        fig, ax = plt.subplots()
        # Close figure so it won't get displayed while transforming the set
        plt.close(fig)
        for x,y in drawing:
            ax.plot(x, y, marker='.')
            ax.axis('off')
        fig.canvas.draw()
        # Convert images to numpy array
        np_drawing = np.array(fig.canvas.renderer._renderer)
        # If you want to take only one channel, you can try somethin like:
        np_drawing = np_drawing[:, :, 1]
        np_drawing = np.invert(np_drawing)
        return cv2.resize(np_drawing, shape) # Resize array

    def unpack_drawing(self, file_handle):
        key_id, = unpack('Q', file_handle.read(8))
        country_code, = unpack('2s', file_handle.read(2))
        recognized, = unpack('b', file_handle.read(1))
        timestamp, = unpack('I', file_handle.read(4))
        n_strokes, = unpack('H', file_handle.read(2))
        image = []
        for i in range(n_strokes):
            n_points, = unpack('H', file_handle.read(2))
            fmt = str(n_points) + 'B'
            x = unpack(fmt, file_handle.read(n_points))
            y = unpack(fmt, file_handle.read(n_points))
            image.append((x, y))

        image = self.drawing_to_np(image)

        return {
            'key_id': key_id,
            'country_code': country_code,
            'recognized': recognized,
            'timestamp': timestamp,
            'image': image
        }

    def unpack_drawings(self, filename):
        with open(filename, 'rb') as f:
            while True:
                try:
                    yield self.unpack_drawing(f)
                except struct.error:
                    break

    def __getitem__(self, idx):
        return self.data[idx]

    def __len__(self):
        return len(self.data)
