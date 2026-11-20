const shortNames = {
  计算机: '计算机科学与技术',
  计算机图灵: '计算机科学与技术（图灵班）',
  信计计算机: '信息与计算科学（计算机方向）',
  信计图灵: '信息与计算科学（图灵班）',
  信计智能: '信息与计算科学（智能方向）',
  信计智班: '信息与计算科学（智班）',
  智能: '智能科学与技术',
  智能智班: '智能科学与技术（智班）',
  软工: '软件工程',
  电子科学: '电子信息科学与技术',
  电子工程: '电子信息工程',
  微电子: '微电子科学与工程',
  集成电路: '集成电路设计与集成系统',
  应物: '应用物理学',
  应物信班: '应用物理学（信班）',
  信班: '电子信息科学类实验班（信班）',
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fullNames = Object.values(shortNames);
const fullNameSet = new Set(fullNames);
const shortKeys = Object.keys(shortNames).sort((a, b) => b.length - a.length);
const fullPattern = new RegExp(`(${fullNames.map(escapeRegExp).join('|')})`, 'g');
const shortPattern = new RegExp(`(${shortKeys.map(escapeRegExp).join('|')})`, 'g');

export function renderShortNames(text) {
  if (typeof text !== 'string' || !text) return text;

  return text.split(fullPattern).map((segment, segmentIndex) => {
    if (fullNameSet.has(segment)) return segment;

    return segment.split(shortPattern).map((part, partIndex) => {
      const fullName = shortNames[part];
      if (!fullName) return part;

      return (
        <abbr
          key={`${segmentIndex}-${partIndex}`}
          title={fullName}
          className="cursor-help underline decoration-dotted underline-offset-2"
        >
          {part}
        </abbr>
      );
    });
  });
}