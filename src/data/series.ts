export interface SeriesPart {
  order: number;
  title: string;
  summary: string;
}

export interface ReadingPath {
  title: string;
  orders: number[];
  note: string;
}

export const seriesConfig = {
  id: 'forms-boundary',
  title: '形式的边界：元数学、集合论与逻辑',
  description:
    '从一阶逻辑、可计算性与不完备性，到 ZFC、力迫、非经典逻辑与数学哲学的系统连载。强调语法与语义的分工、公理的动机、证明的机制，以及每个比喻的失效边界。',
  parts: [
    { order: 0, title: '导论', summary: '对象、方法、最小工具箱与阅读路径。' },
    {
      order: 1,
      title: '第一部 逻辑与模型论：从符号到语义',
      summary: '语法、语义、证明、完备性、紧致性与模型论初步。',
    },
    {
      order: 2,
      title: '第二部 可计算性与不完备性：形式的限度',
      summary: 'Turing 机、算术化、Gödel、Tarski 与证明论。',
    },
    {
      order: 3,
      title: '第三部 公理化集合论：无穷的架构',
      summary: 'ZFC、序数、基数、CH、L、力迫与大基数。',
    },
    {
      order: 4,
      title: '第四部 哲学逻辑：逻辑的多种生命',
      summary: '模态、直觉主义、非经典逻辑、真理与逻辑后承。',
    },
    {
      order: 5,
      title: '第五部 数学哲学与历史：我们到底在做什么',
      summary: '三大纲领、Gödel 之后与学派纵向比较。',
    },
    {
      order: 6,
      title: '附录',
      summary: '参考文献、符号表、术语表、隐喻账本与常见误区。',
    },
  ] satisfies SeriesPart[],
  readingPaths: [
    {
      title: '完整路径',
      orders: Array.from({ length: 31 }, (_, index) => index),
      note: '按顺序读完，含全部技术细节与哲学讨论。',
    },
    {
      title: '核心速览',
      orders: [0, 4, 10, 13, 17, 24, 30],
      note: '先看主线骨架，再回补细节。',
    },
    {
      title: '逻辑与计算',
      orders: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 30],
      note: '逻辑、可计算性与哲学逻辑优先。',
    },
    {
      title: '集合论与基础',
      orders: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 26, 27, 28, 29, 30],
      note: '集合论、独立性与数学哲学优先。',
    },
    {
      title: '哲学路径',
      orders: [0, 4, 10, 11, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      note: '真理、后承与数学哲学优先。',
    },
  ] satisfies ReadingPath[],
};
