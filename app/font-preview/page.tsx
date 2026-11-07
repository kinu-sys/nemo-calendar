const samples = [
  { name: 'Noto Sans JP', family: "'Noto Sans JP', sans-serif", note: 'すっきり・標準幅' },
  { name: 'BIZ UDPGothic', family: "'BIZ UDPGothic', sans-serif", note: '文字が見分けやすい' },
  { name: 'M PLUS 1p', family: "'M PLUS 1p', sans-serif", note: 'やわらかく読みやすい' },
  { name: 'Noto Sans JP + Roboto Condensed', family: "'Noto Sans JP', sans-serif", note: '英数字を細めに表示' },
  { name: 'M PLUS Rounded 1c', family: "'M PLUS Rounded 1c', sans-serif", note: '丸みがはっきり・幅は日本語標準' },
  { name: 'Kosugi Maru', family: "'Kosugi Maru', sans-serif", note: '丸文字・すっきりした印象' },
];

const text = '予定 ｶﾚﾝﾀﾞｰ 10:30 家族の予定';

export default function FontPreviewPage() {
  return (
    <main style={{ maxWidth: 760, margin: '32px auto', padding: '24px', color: '#5c4d49' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&family=Kosugi+Maru&family=M+PLUS+1p:wght@400;500;700&family=M+PLUS+Rounded+1c:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Roboto+Condensed:wght@400;700&display=swap" />
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>フォント見本</h1>
      <p style={{ marginBottom: 24, color: '#81716d' }}>同じ文字列で、字形と横幅を比べられます。半角カナも含めています。</p>
      <div style={{ display: 'grid', gap: 14 }}>
        {samples.map((sample, index) => (
          <section key={sample.name} style={{ border: '1px solid #f2e3df', borderRadius: 14, padding: 16, background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', marginBottom: 10 }}>
              <strong>{index + 1}. {sample.name}</strong><span style={{ fontSize: 13, color: '#9e8e8a' }}>{sample.note}</span>
            </div>
            <div style={{ fontFamily: sample.family, fontSize: 20, lineHeight: 1.6 }}>
              {index === 3 ? <><span>予定 ｶﾚﾝﾀﾞｰ </span><span style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>10:30</span><span> 家族の予定</span></> : text}
            </div>
            <div style={{ fontFamily: sample.family, fontSize: 15, marginTop: 4, color: '#81716d' }}>月 火 水 木 金 土 日　2026年11月</div>
          </section>
        ))}
      </div>
    </main>
  );
}
