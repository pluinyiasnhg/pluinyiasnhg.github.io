---
title: Pytorch 入门(2)
date: 2025-10-14
tags:
  - Pytorch
  - 尚硅谷
category:
  - Python
---
# 前言

学习尚硅谷 b站的 [NLP 教程](https://www.bilibili.com/video/BV1k44LzPEhU)

<!-- more -->

90 年代，随着计算能力的提升和语料资源的积累，统计方法逐渐成为主流。通过对大量文本数据进行概率建模，系统能够“学习”语言中的模式和规律。典型方法包括 n-gram 模型、隐马尔可夫模型(HMM)和最大熵模型。

进入 21 世纪，NLP 技术逐步引入传统机器学习方法，如逻辑回归、支持向量机 (SVM)、决策树、条件随机场(CRF)等。这些方法在命名实体识别、文本分类等任务上表现出色。在此阶段，特征工程成为关键环节，研究者需要设计大量手工特征来提升模型性能。

自2010年代中期开始，深度学习在NLP中迅速崛起。基于神经网络的模型RNN、LSTM、GRU等，取代了传统手工特征工程，能够从海量数据中自动提取语义表示。随后，Transformer架构的提出极大提升了语言理解与生成的能力，深度学习不仅在精度上实现突破，也推动了预训练语言模型（如GPT、BERT等）和迁移学习的发展，使NLP技术更通用、更强大。

![RNN](https://vip.123pan.cn/1844935313/obsidian/20251014224728382.png)

![LSTM（Long Short-Term Memory）](https://vip.123pan.cn/1844935313/obsidian/20251014224924676.png)

![GRU（Gated Recurrent Unit）](https://vip.123pan.cn/1844935313/obsidian/20251014224958375.png)

![Transformer|438x0](https://vip.123pan.cn/1844935313/obsidian/20251014225051167.png)


