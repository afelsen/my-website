import numpy as np
import cv2
import torch
from NeuralNet.CNN import CNN
from torch.nn import Softmax




def squarify(M,val):
    (a,b)=M.shape
    if a>b:
        padding=((0,0),(0,a-b))
    else:
        padding=((0,b-a),(0,0))
    return np.pad(M,padding,mode='constant',constant_values=val)

def get_prediction(img):
    model_path = "./NeuralNet/Models/nav.pth"

    net = CNN(5)
    net = net.double()
    checkpoint = torch.load(model_path, map_location ='cpu')
    net.load_state_dict(checkpoint['model_state_dict'])
    classes = ["Book", "Brain", "Computer", "Face", "Envelope"]


    # crop image based on bounding rectangle

    rect = cv2.boundingRect(img[:,:,0])
    img = img[:,:,0]
    img = img[rect[1]:rect[1] + rect[3], rect[0]:rect[0] + rect[2]]

    img = squarify(img, 0)

    if img.size == 0:
        img = np.zeros((64,64))
    else:
        img = cv2.resize(img, (64,64), interpolation=cv2.INTER_NEAREST)
    img[img > 0] = 255


    img = img[..., np.newaxis, np.newaxis]
    img = img.astype(np.float64)

    img = torch.from_numpy(img)
    img = torch.permute(img, (2, 3, 0, 1))

    outputs = net(img.double())
    index = torch.argmax(outputs[0])

    softmax = Softmax(dim=1)
    outputs = softmax(outputs)

    outputs = outputs[0].tolist()

    return classes[index], index, outputs

def get_theme_prediction(img):
    model_path = "./NeuralNet/Models/theme.pth"

    net = CNN(3)
    net = net.double()
    checkpoint = torch.load(model_path, map_location ='cpu')
    net.load_state_dict(checkpoint['model_state_dict'])
    classes = ["sun", "moon", "rainbow"]


    # crop image based on bounding rectangle

    rect = cv2.boundingRect(img[:,:,0])
    img = img[:,:,0]
    img = img[rect[1]:rect[1] + rect[3], rect[0]:rect[0] + rect[2]]

    img = squarify(img, 0)

    if img.size == 0:
        img = np.zeros((64,64))
    else:
        img = cv2.resize(img, (64,64), interpolation=cv2.INTER_NEAREST)
    img[img > 0] = 255


    img = img[..., np.newaxis, np.newaxis]
    img = img.astype(np.float64)

    img = torch.from_numpy(img)
    img = torch.permute(img, (2, 3, 0, 1))

    outputs = net(img.double())
    index = torch.argmax(outputs[0])

    softmax = Softmax(dim=1)
    outputs = softmax(outputs)

    outputs = outputs[0].tolist()

    return classes[index], index, outputs

# def get_probabilities_string(outputs, index):
#     classes = ["Book", "Brain", "Computer", "Face", "Envelope"]
#     probs_string = ""
#     for i in range(len(outputs)):
#         if i == index:
#             probs_string += "<b>"
#         probs_string += f"{classes[i]}: {outputs[i]:.2f} "
#         if i == index:
#             probs_string += "</b>"
#
#     return probs_string
