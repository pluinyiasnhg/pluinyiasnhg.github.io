---
title: Pytorch 入门(1)
date: 2025-10-10
tags:
  - Python
  - Pytorch
category:
  - 框架
---
# 前言

学习 Pytorch 官方的 [Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/intro.html)。

<!-- more -->

# Pytorch 2.x

相比于 Pytorch 1.x，Pytorch 2.x 增加了 `torch.compile` 功能，因此它完全兼容于上个版本的 Pytorch。`torch.compile`的新技术是 TorchDynamo、AOTAutograd、PrimTorch和TorchInductor。

- `TorchDynamo` 可靠且快速地获取图。通过使用 Frame Evaluation API 安全地捕获PyTorch程序
- `AOTAutograd` 复用Autograd进行即时图计算，以加快训练过程的反向传播环节
- `PrimTorch` 将2000多个PyTorch算子规范化为约250个基本算子的封闭集，开发者可以针对这些算子构建完整的PyTorch后端。这大大降低了编写PyTorch功能或后端的门槛。
- `TorchInductor` 是一个深度学习编译器，为多个加速器和后端生成快速代码。为 GPU 生成 [Triton](https://github.com/openai/triton)代码，为 CPU 生成 C++/OpenMP 代码

![Pytorch 编译流程|700x0](https://vip.123pan.cn/1844935313/obsidian/20251007182116047.png)


Pytorch 2.x 最显著的特点就是在编译模式下取得优秀的模型加速效果。下面是个简单上手例子：

```python
compiled_model = torch.compile(model)
```

模型会在第一轮训练时进行编译，所以首轮速度会比之后的训练速度慢一些。`torch.compile` 的可选参数 `mode` 有三个选项：

- `default` 针对大型模型优化，编译时间低，不额外占用内存
- `reduce-overhead` 针对小模型优化，占用额外内存
- `max-autotune` 优化以产生最快的模型，但编译时间非常长

代码在启用编译后在 debug 上会变得困难。这可能不是用户代码的问题，可以用 Minifier 工具生成 Minifier 代码 ，并向官方反馈。如果编译模式下的加速不理想，使用 `torch._dynamo.explain` 工具检查哪处代码出现 graph break，它会阻碍编译器工作。

<mark style="background: #FF5582A6;">Distributed(未完待续)</mark>

## 其他项目

[vLLM](https://github.com/vllm-project/vllm)用于大语言模型的加速推理和减少模型占用，由加利福尼亚大学捐赠给 Linux 基金会。
[DeepSpeed](https://github.com/deepspeedai/DeepSpeed)用于简化模型并行训练的部署过程，由微软捐赠给 Linux 基金会。

# 安装

[本地安装](https://pytorch.org/get-started/locally/)。目前稳定版最新的是 Pytorch 2.8，要求 Python 版本3.9及以上。

```zsh
# 安装 pip
sudo apt install python3-pip

# CPU
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

# Learn the Basics

有其他深度学习框架学习经验的人可以直接跳到 [0. Quickstart](https://docs.pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html)。

## 1. Tensors

创建张量的方式有：

- 数组创建。如 `torch.tensor(data)`
- numpy 数组创建。如 `torch.from_numpy(np_array)`
- 由旧张量创建新张量，新张量保留旧张量的形状、数据类型，除非覆盖。如 `torch.rand_like(x_data, dtype=torch.float)`
- 用形状（如 `shape = (2, 3)`）创建，如 `torch.rand(shape)`

其中由 numpy 数组创建的张量与 numpy 数组共享同一块内存，是同一块内存的不同视图；与普通数组不共享内存。

张量的属性有：

- shape 形状
- dtype 数据类型
- device 设备，表示张量是在 cpu 还是 gpu 上计算

拼接张量的方式有 `torch.cat` 和 `torch.stack` 。

单元素张量转换为 Python 数值，用 `tensor.item()` 。

张量乘法，其中 `tensor.T` 是 `tensor` 的转置，y1 等于 y2 等于 y3：

```python
# 1. @
y1 = tensor @ tensor.T
# 2. tensor.matual
y2 = tensor.matual(tensor.T)

# 3. torch.matual
y3 = torch.rand_like(y1)
torch.matual(tensor, tensor.T, out=y3)
```

张量逐元素乘法，z1 等于 z2 等于 z3 ：

```python
# 1. *
z1 = tensor * tensor
# 2. tensor.mul
z2 = tensor.mul(tensor)

# 3. torch.mul
z3 = torch.rand_like(z1)
torch.mul(tensor, tensor, out=z3)
```

## 2. Datasets & Dataloaders

`torch.utils.data.Dataset` 和 `torch.utils.data.Dataloader` 用于将数据集代码和模型训练代码解耦合。`Dataset` 存储样本及其对应的标签，`Dataloader` 将可迭代的对象包装在 `Dataset` 周围，以实现轻松访问样本。

使用 `Dataset` 自定义数据集：

```python
# decode_image 将图片转换为张量
from torchvision.io import decode_image

class CustomImageDataset(Dataset):
    def __init__(self, annotations_file, img_dir, transform=None, target_transform=None):
        self.img_labels = pd.read_csv(annotations_file)
        self.img_dir = img_dir
        self.transform = transform
        self.target_transform = target_transform

	# 返回数据集中的样本数量。
    def __len__(self):
        return len(self.img_labels)

	# 根据 idx，返回该位置的(图片张量，标签)
    def __getitem__(self, idx):
        img_path = os.path.join(self.img_dir, self.img_labels.iloc[idx, 0])
        image = decode_image(img_path)
        label = self.img_labels.iloc[idx, 1]
        if self.transform:
            image = self.transform(image)
        if self.target_transform:
            label = self.target_transform(label)
        return image, label
```

`Dataloder` 是一个迭代器。使用 `Dataloader` 实现：小批量（minibatch） 训练、每个 epoch 打乱数据集（抑制过拟合）、Python 多进程（加快数据读取）。

```python
train_dataloader = DataLoader(training_data, batch_size=64, shuffle=True)
test_dataloader  = DataLoader(test_data, batch_size=64, shuffle=True)

train_features, train_labels = next(iter(train_dataloader))
```

进一步阅读：[torch.utils.data API](https://docs.pytorch.org/docs/stable/data.html)

## 3. Tranformers

图像数据集往往不能开箱即用，需要用 `torchvision.transforms` 对数据进行一些操作，使其适合训练。`torchvision.datasets` 提供的数据集有两个通用参数，用于修改特征的 `transform` 和用于修改标签的 `target_transform`。

Fashion MNIST 的特征以 PIL 图像格式存在，标签是整数。为了训练，我们需要将特征转换为归一化的张量，将标签转换为 one-hot 编码的张量。为了进行这些转换，我们使用了 ToTensor 和 Lambda。

```python
from torchvision.transforms import ToTensor, Lambda

ds = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor(),
    target_transform=Lambda(lambda y: torch.zeros(10, dtype=torch.float).scatter_(0, torch.tensor(y), value=1))
)
```

- `ToTensor` 将 PIL 图像或 NumPy 数组转换为 FloatTensor，并将图像的像素值缩放到 `[0., 1.]` 范围内
- `scatter_(dim, index, value)` 的作用是：在指定的维度 `dim` 上，按照 `index` 指定的位置，填入 `value` 值

进一步阅读：[torchvision.transforms APl](https://pytorch.org/vision/stable/transforms.html)

## 4. Build Model

`torch.nn` 命名空间提供了构建自己的神经网络所需的所有构建块。PyTorch中的每个网络模块都是 `nn.Module` 的子类。

```python
# 确定训练所用的加速设备
device = torch.accelerator.current_accelerator().type if torch.accelerator.is_available() else "cpu"

class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10),
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

# 实例化神经网络，并将示例转移到加速设备上
model = NeuralNetwork().to(device)
```

- `nn.Flatten` 有两个重要参数：start_dim 表示从哪个维度开始展平（默认=1，0 是minibatch所在的维度）， end_dim 表示展平到哪个维度（默认=-1，即最后一个维度）。 `nn.Flatten` 主要作用是将输入**展平**（flatten）成一维或二维张量
- `nn.Linear` 使用其存储的权重和偏置对输入应用线性变换
- `nn.Relu` 是激活函数中的一种，帮助网络学习各种现象
- `nn.Sequential` 是一个按顺序排列的模块容器，数据将按照定义的顺序通过所有模块
- `nn.Softmax` 会将输入张量第 `dim` 维度上的值缩放到0和1之间，代表模型对每个类别的预测概率。`dim` 维度上的所有值之和为1

注意，像 `nn.Linear`、`nn.Relu` 这种的，它们不是函数而是 Python 的模块。

测试网络：初始化一个随机的张量 x

```python
X = torch.rand(1, 28, 28, device=device)
logits = model(X)
pred_probab = nn.Softmax(dim=1)(logits)
y_pred = pred_probab.argmax(1)
print(f"Predicted class: {y_pred}")
```

查看模型参数：使用模型的 parameters() 或 named_parameters() 方法。

```python
for name, param in model.named_parameters():
    print(f"Layer: {name} | Size: {param.size()} | Values : {param[:2]} \n")
```

进一步阅读：[torch.nn API](https://www.google.com/url?q=https%3A%2F%2Fpytorch.org%2Fdocs%2Fstable%2Fnn.html)

## 5. Autograd

训练网络过程中常常用到反向传播，反向传播会根据损失函数的梯度对网络的权重进行调整。而 `torch.autograd` 用于自动求梯度。自动求梯度要求张量的 `requires_grad` 属性设置为 true，可以在创建张量时设置，也可以用张量的方法 `tensor.requires_grad_(True)` 。

出于性能考虑，在一张给定的计算图上进行反向传播的次数是一次，除非在调用 `backward()` 传递参数 `retain_graph=True` 。

```python
# 反向传播
loss.backward()

# 查看梯度
print(w.grad)
print(b.grad)
```

出于冻结参数、进行测试等目的，有时需要停止对张量的梯度跟踪计算。

- 使用 `torch.no_grad()` 代码块，在代码块下的所有张量不进行梯度计算
- 使用张量的 `detach` 方法，比如 `z_det = z.detach()` 中 `z_det` 不计算梯度

前文提到“对给定的计算图只进行一次反向传播”，是因为每次执行 `backward()` 都会重新建立一张新的计算图，这样做的好处是可以在模型训练过程中添加控制流语句。

Pytorch 的计算图是一张有向无环图（DAG），输入是叶子结点，输出也就是损失函数，是根结点。在正向传播过程中，`autograd` 会运行请求的操作以计算结果张量，并维护 DAG 中每次操作的 `grad_fn` 。在反向传播过程中，`autograd` 会根据每个 `grad_fn` 计算梯度，并将得到的梯度累加到张量的 `grad` 属性上。

“梯度累计”会引起一些问题，比如下一个 epoch 会用到上一个 epoch 的梯度，每个 epoch 应该是独立的。`tensor.grad.zero_()` 会清空张量的梯度，实际训练过程中由优化器负责清空张量的 `grad`，如 `optimizer.zero_grad()`。

进一步阅读：[Autograd Mechanics](https://www.google.com/url?q=https%3A%2F%2Fpytorch.org%2Fdocs%2Fstable%2Fnotes%2Fautograd.html)

## 6. Optimiztion

超参数是用于控制模型优化过程的可调整的参数，比如 `epochs`、`batch_size`、`learning_rate`。超参数的微调可以借助 [ray tune](https://docs.ray.io/en/latest/tune/index.html) 工具。

设置数据、网络、超参数后，就可以开始训练和优化模型了。优化循环的每次迭代就是 epoch，每个 epoch 又包含一个训练循环和一个测试/验证循环。训练循环尝试收敛到最优参数，测试/验证循环在测试集上迭代，用来验证每个 epoch 后模型的表现是否改善。

损失函数用来衡量预测结果和实际结果之间的不相似度，优化的目的是让损失函数的值越来越小，模型在测试集上的表现越来越好。

常见的损失函数有用于回归任务的  `nn.MSELoss` (Mean Square Error)、用于分类任务的 `nn.NLLLoss` (Negative Log Likelihood)、综合了 `nn.LogSoftmax` 和 `nn.NLLLoss` 的 `nn.CrossEntropyLoss` 。

优化器是调整模型参数以在每个训练步骤中减少模型错误的过程。优化算法定义了这一过程是如何执行的。

```python
# 用到的优化算法是 Stochastic Gradient Descent
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)
```

优化器的工作流程是上个 epoch 梯度清零 `optimier.zero_grad()`、进行反向传播 `loss.backward()`、根据反向传播得到的梯度对参数进行调整 `optimier.step()`。

```python
def train_loop(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    # Set the model to training mode - important for batch normalization and dropout layers
    # Unnecessary in this situation but added for best practices
    model.train()
    for batch, (X, y) in enumerate(dataloader):
        # Compute prediction and loss
        pred = model(X)
        loss = loss_fn(pred, y)

        # Backpropagation
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        if batch % 100 == 0:
            loss, current = loss.item(), batch * batch_size + len(X)
            print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")


def test_loop(dataloader, model, loss_fn):
    # Set the model to evaluation mode - important for batch normalization and dropout layers
    # Unnecessary in this situation but added for best practices
    model.eval()
    size = len(dataloader.dataset)
    num_batches = len(dataloader)
    test_loss, correct = 0, 0

    # Evaluating the model with torch.no_grad() ensures that no gradients are computed during test mode
    # also serves to reduce unnecessary gradient computations and memory usage for tensors with requires_grad=True
    with torch.no_grad():
        for X, y in dataloader:
            pred = model(X)
            test_loss += loss_fn(pred, y).item()
			# type(torch.float) 将 True 转换为 1.，False 转换为 0.
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    test_loss /= num_batches
    correct /= size
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")
```

开始训练：

```python
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)

epochs = 10
for t in range(epochs):
    print(f"Epoch {t+1}\n-------------------------------")
    train_loop(train_dataloader, model, loss_fn, optimizer)
    test_loop(test_dataloader, model, loss_fn)
print("Done!")
```

进一步阅读：[Loss Functions](https://www.google.com/url?q=https%3A%2F%2Fpytorch.org%2Fdocs%2Fstable%2Fnn.html%23loss-functions)、[torch.optim](https://www.google.com/url?q=https%3A%2F%2Fpytorch.org%2Fdocs%2Fstable%2Foptim.html)

### 模型热身

加载已训练模型的部分参数，能够有效的加快我们自己的待训练模型的训练速度。但是已训练模型的参数往往不能直接拿来用，参数往往不能匹配，比如这里多一点、那里少一点参数。

如果模型A和模型B的网络结构相同，但某些键不匹配，此时将参数 strict 设置为 False：

```python
# Specify a path to save to
PATH = "model.pt"

torch.save(netA.state_dict(), PATH)

# 将模型A的参数加载到模型B
netB.load_state_dict(torch.load(PATH, weights_only=True), strict=False)
```

## 7. save & load model

`state_dict` 是保存 Pytorch 已训练模型参数的内部静态字典。要加载模型权重，首先需要创建相同模型的实例，然后使用`load_state_dict()`方法加载参数。

```python
# 保存模型
torch.save(model.state_dict(), 'model_weights.pth')

# 实例化 model

# 加载模型
model_state_dict = torch.load('model_weights.pth', weights_only=True)
model.load_state_dict(model_state_dict)
```

保存模型时可以把网络结构和参数一并保存，这样加载模型时就不用实例化模型了。但是不建议这么用。

```python
torch.save(model, 'model.pth')

model = torch.load('model.pth', weights_only=False)
```

[Tips for Loading an nn.Module from a Checkpoint](https://docs.pytorch.org/tutorials/recipes/recipes/module_load_state_dict_tips.html)提到了一种优化保存和加载模型的方法。下面代码2要比代码1更节省计算和内存开销，代码2要求 Pytorch 2.1 及以上。

```python
# 代码1
state_dict = torch.load('checkpoint.pth', weights_only=True)
m = SomeModule(1000)
m.load_state_dict(state_dict)

# 代码2
state_dict = torch.load('checkpoint.pth', mmap=True, weights_only=True)
with torch.device('meta'):
  meta_m = SomeModule(1000)
meta_m.load_state_dict(state_dict, assign=True)
```

- `torch.load(mmap=True)` 把参数加载到虚拟内存（而不是物理内存），让操作系统自动处理加载和卸载到物理内存。此外，`mmap=True` 不需要等待参数加载完成，就可以进行逐张量处理（ per-tensor processing）
- `torch.device(meta)` 