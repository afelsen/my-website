import glob
import cv2
import random
import numpy as np
import sys
import struct
from struct import unpack
from torch.utils.data import Dataset
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw

FILTER_WINDOW = 3
DEGREE = 3

class Drawing_Dataset(Dataset):
    def __init__(self, train = False, transform = None):
        self.transform = transform
        self.data = []
        self.classes = ["book", "computer", "face"]
        class_data = [[]]*len(self.classes)
        for i in range(len(self.classes)):
            for j, drawing in enumerate(self.unpack_drawings(f"Data/full_binary_{self.classes[i]}.bin")):
                # if j > 10000:
                #     break
                if drawing['recognized']:
                    print(f"{self.classes[i]}: {j}", end = '\r')
                    im = drawing['image']

                    cv2.imshow("", im)
                    cv2.waitKey(0)

                    # label = np.zeros((len(self.classes)))
                    # label[i] = 1

                    class_data[i].append((im, i))
            print()

        max_len = max(len(c) for c in class_data)
        print(max_len)
        class_data = [class_data[i][:max_len] for i in range(len(self.classes))]

        for c in class_data:
            random.seed(213123)
            random.shuffle(c)
            if train:
                self.data += c[:int(.8*len(c))]
            else:
                self.data += c[int(.8*len(c)):]

        print(len(self.data))

    def drawing_to_np(self, drawing):
        polylines = [list(zip(polyline[0], polyline[1])) for polyline in drawing]
        pil_img = Image.new("L", (256, 256), 0)
        # get a drawing context
        d = ImageDraw.Draw(pil_img)

        for polyline in polylines:
            d.line(polyline, fill=255, width=3)

        np_img = np.array(pil_img)

        return cv2.resize(np_img, (64,64))

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
        img = self.data[idx][0]
        img = Image.fromarray(img)
        if self.transform is not None:
            img = self.transform(img)
            img = img.permute(1,2,0)
            img = np.array(img)
        else:
            img = np.array(img)
            img = img[..., np.newaxis]
        return self.data[idx][0][..., np.newaxis], self.data[idx][1]

    def __len__(self):
        return len(self.data)
