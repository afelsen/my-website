import numpy as np
import cv2
import torch
from NeuralNet.CNN import CNN

MODEL_PATH = "./NeuralNet/Models/test.pth"


def get_prediction(img):
    net = CNN()
    net = net.double()
    checkpoint = torch.load(MODEL_PATH)
    net.load_state_dict(checkpoint['model_state_dict'])
    classes = ["book", "computer", "face"]

    img = cv2.resize(img, (64,64))


    img = img[:,:,0]
    img = img[..., np.newaxis, np.newaxis]
    img = img.astype(np.float64)
    # img = img//255

    print(img.shape)
    img = torch.from_numpy(img)
    img = torch.permute(img, (2, 3, 0, 1))
    print(img)

    outputs = net(img.double())
    index = torch.argmax(outputs[0])
    print(classes[index])
    print(outputs)


    return classes[index]
