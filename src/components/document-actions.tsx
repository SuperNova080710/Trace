"use client";

export function DocumentActions({ title }: { title: string }) {
  function downloadHtml() {
    const documentElement = document.querySelector<HTMLElement>("#application-document");
    if (!documentElement) return;
    const css = Array.from(document.styleSheets).map((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n");
      } catch { return ""; }
    }).join("\n");
    const markup = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${title}</title>
      <style>body{font-family:"Malgun Gothic",Arial,sans-serif;margin:30px;color:#172a46;line-height:1.8}h1,h2,h3{color:#102748}
      .paper-header,.paper-heading{border-bottom:1px solid #dce7f5;padding-bottom:12px;margin-bottom:24px}
      .paper-section{margin:24px 0}.paper-section-heading{display:flex;gap:12px;align-items:center}.paper-footer{border-top:1px solid #ddd;margin-top:30px;padding-top:12px}
      @media print{body{margin:15mm}} ${css}</style></head><body>${documentElement.outerHTML}</body></html>`;
    const url = URL.createObjectURL(new Blob([markup], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `TRACE_${title}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="application-actions" aria-label="문서 다운로드">
      <button type="button" onClick={downloadHtml}>문서 파일 다운로드 (.html)</button>
      <button type="button" className="primary" onClick={() => window.print()}>PDF로 저장 / 인쇄</button>
      <p>PDF 저장을 누른 다음 인쇄 대상에서 ‘PDF로 저장’을 선택하세요. 첫 번째 버튼은 오프라인에서도 열 수 있는 HTML 문서 파일을 즉시 다운로드합니다.</p>
    </div>
  );
}
