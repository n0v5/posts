export function Theorem({ kind = '定理', number, title, children }) {
  return (
    <section className="series-block series-theorem">
      <div className="series-block-head">
        <span className="series-block-kind">
          {kind}
          {number ? ` ${number}` : ''}
        </span>
        {title ? <span className="series-block-title">（{title}）</span> : null}
      </div>
      <div className="series-block-body">{children}</div>
    </section>
  );
}

export function Definition({ number, title, children }) {
  return (
    <section className="series-block series-definition">
      <div className="series-block-head">
        <span className="series-block-kind">
          定义
          {number ? ` ${number}` : ''}
        </span>
        {title ? <span className="series-block-title">（{title}）</span> : null}
      </div>
      <div className="series-block-body">{children}</div>
    </section>
  );
}

export function Proof({ sketch = false, children }) {
  return (
    <div className="series-proof">
      <div className="series-proof-label">{sketch ? '证明骨架' : '证明'}</div>
      <div>{children}</div>
      <div className="series-qed" aria-label="证明结束">
        ∎
      </div>
    </div>
  );
}

export function Exercise({ number, title, children }) {
  return (
    <section className="series-exercise">
      <div className="series-exercise-head">
        习题{number ? ` ${number}` : ''}
        {title ? `：${title}` : ''}
      </div>
      <div>{children}</div>
    </section>
  );
}

export function Hint({ children }) {
  return (
    <details className="series-hint">
      <summary>提示</summary>
      <div>{children}</div>
    </details>
  );
}

export function Metaphor({ title = '隐喻', breaking, children }) {
  return (
    <aside className="series-metaphor">
      <div className="series-metaphor-title">{title}</div>
      <div>{children}</div>
      {breaking ? (
        <div className="series-metaphor-breaking">
          <strong>破裂点：</strong>
          {breaking}
        </div>
      ) : (
        <div className="series-warning">缺少 breaking：这个隐喻不得作为最终稿发布。</div>
      )}
    </aside>
  );
}
