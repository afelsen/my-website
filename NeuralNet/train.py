from Dataset import Drawing_Dataset
from CNN import CNN
import torch
import torch.optim as optim
import cv2

BATCH_SIZE = 128
NUM_EPOCHS = 10
MODEL_PATH = "./Models/test.pth"

def train(net, trainloader, device):

    criterion = torch.nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)

    for epoch in range(NUM_EPOCHS):

        running_loss = 0.0
        for i, data in enumerate(trainloader, 0):

            inputs = data[0].to(device=device, dtype=torch.float)
            inputs = torch.permute(inputs, (0, 3, 1, 2))
            labels = data[1].to(device=device, dtype=torch.long)


            optimizer.zero_grad()
            outputs = net(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            running_loss += loss.item()
            optimizer.step()
            print(f"Loss:{running_loss/(i+1)} Epoch: {epoch}\r", end = "")
        print()


    torch.save({
        "model_state_dict": net.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "epoch": NUM_EPOCHS
    }, MODEL_PATH)

    print('Finished Training')

def test(net, testloader, device):
    checkpoint = torch.load(MODEL_PATH)
    net.load_state_dict(checkpoint['model_state_dict'])

    total = 0
    correct = 0
    for i, data in enumerate(testloader, 0):

        inputs = data[0].to(device=device, dtype=torch.float)
        inputs = torch.permute(inputs, (0, 3, 1, 2))
        labels = data[1].to(device=device, dtype=torch.long)

        outputs = net(inputs)

        # print(torch.argmax(outputs[0]), labels[0])
        # cv2.imshow("", inputs.cpu().numpy()[0,0,:,:])
        # cv2.waitKey(0)


        for i in range(len(outputs)):
            if torch.argmax(outputs[i]) == labels[i]:
                correct += 1
            total += 1

    print(f"Accuracy: {correct/total}")

if __name__ == "__main__":
    train_data = Drawing_Dataset(train = True)
    test_data = Drawing_Dataset(train = False)
    net = CNN()

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print("Training device: ", device)
    net.to(device)

    trainloader = torch.utils.data.DataLoader(train_data, batch_size = BATCH_SIZE, shuffle = True, num_workers = 1, persistent_workers = True)
    testloader = torch.utils.data.DataLoader(test_data, batch_size = BATCH_SIZE, shuffle = False, num_workers = 1, persistent_workers = True)
    # train(net, trainloader, device)
    test(net, testloader, device)
