const importanceSamples = [
  { mark: '〇', label: '標準', className: 'text-[#5c4d49]' },
  { mark: '◎', label: 'やや重要', className: 'border border-[#a9b9aa] bg-[#e5ede5] text-[#4e6252]' },
  { mark: '◉', label: '重要', className: 'bg-[#536b58] text-white' },
];

export default function ImportancePreviewPage() {
  return (
    <main className="mx-auto max-w-xl p-5 text-text-main">
      <h1 className="mb-2 text-xl font-bold">予定の重要度プレビュー</h1>
      <p className="mb-5 text-sm text-text-muted">データベースを変更せずに、カレンダー内の色分けを確認できます。</p>
      <div className="grid grid-cols-3 gap-3">
        {importanceSamples.map(({ mark, label, className }) => (
          <section key={label} className="rounded-2xl border border-card-border bg-white p-3">
            <div className="mb-2 text-xs font-bold text-text-muted">{mark} {label}</div>
            <div className="rounded-xl border border-[#f7edea] bg-[#fffaf9] p-2">
              <div className="mb-2 text-sm font-bold text-text-light">18</div>
              <div className={`truncate rounded px-1 py-1 text-xs font-bold ${className}`}>10:30 家族の予定</div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
