#!/usr/bin/env node
/**
 * Browser-level BR-B contract for the statically exported application.
 * Runs against an ephemeral localhost server in GitHub Actions; never accesses private sources.
 */
import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = process.env.BRB_QA_BASE_URL || "http://127.0.0.1:4173";
const widths = [1920, 1366, 1024, 861, 860, 600, 390, 320];

(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.BRB_CHROME_BIN || undefined, args:["--no-sandbox"]});
  try {
    for (const width of widths) {
      const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
      try {
        const response = await page.goto(base + "/ech-beacon-explorer.html", {waitUntil:"networkidle", timeout:30000});
        assert.equal(response?.status(),200, "HTTP 200 at "+width);
        await page.locator("#explorer-title > span").first().waitFor();
        const layout = await page.evaluate(() => {
          const heading=document.querySelector("#explorer-title");
          const first=heading.firstElementChild;
          const second=heading.lastElementChild;
          const range=document.createRange();
          range.selectNodeContents(first);
          const parts=[...range.getClientRects()];
          const r1=first.getBoundingClientRect();
          const r2=second.getBoundingClientRect();
          return {
            firstText:first.textContent.trim(),
            secondText:second.textContent.trim(),
            count:parts.length,
            partsMaxRight:Math.max(...parts.map(r=>r.right)),
            firstRight:r1.right,
            secondTop:r2.top,
            firstBottom:r1.bottom,
            horizontalOverflow:document.documentElement.scrollWidth-window.innerWidth,
            computedWhitespace:getComputedStyle(first).whiteSpace
          };
        });
        assert.equal(layout.firstText,"암호화된 연결 뒤의 탐지 결과를");
        assert.equal(layout.secondText,"숫자로 검증하다.");
        assert.ok(layout.horizontalOverflow <= 2, "Page horizontal overflow at "+width+": "+layout.horizontalOverflow);
        assert.ok(layout.secondTop >= layout.firstBottom - 2, "Second sentence overlaps first at "+width);
        if(width>600) {
          assert.equal(layout.computedWhitespace,"nowrap", "Desktop line must not wrap at "+width);
          assert.equal(layout.count,1,"Desktop first phrase should occupy one rendered line at "+width);
          assert.ok(layout.partsMaxRight <= layout.firstRight+2,"Clipped first phrase at "+width+": "+JSON.stringify(layout));
        }
        console.log("PASS title/layout width="+width+"px");
      } finally {
        await page.close();
      }
    }

    const page=await browser.newPage({viewport:{width:1366,height:900}});
    try {
      await page.goto(base + "/ech-beacon-explorer.html",{waitUntil:"networkidle",timeout:30000});
      const summary=page.locator('[aria-live="polite"]').filter({hasText:"표본 선택됨"});
      await summary.waitFor();
      assert.match(await summary.innerText(),/110건/);

      await page.locator("#brb-group").selectOption("normal");
      assert.match(await summary.innerText(),/60건/);
      await page.locator("#brb-profile").selectOption("irregular-lognormal");
      assert.match(await summary.innerText(),/18건/);

      await page.getByLabel("탐지기 간 판정이 다른 표본만 표시").check();
      assert.match(await summary.innerText(),/3건/);
      await page.getByLabel("탐지기 간 판정이 다른 표본만 표시").uncheck();

      await page.locator("#brb-search").fill("no-match-ever");
      assert.match(await page.locator('[role="status"]').innerText(),/일치하는 표본이 없습니다/);
      await page.getByRole("button",{name:"전체 조건 초기화"}).click();
      assert.match(await summary.innerText(),/110건/);

      await page.locator("#brb-group").selectOption("beacon");
      await page.locator("#brb-jitter").selectOption("70");
      assert.match(await summary.innerText(),/10건/);
      assert.equal(await page.getByRole("button",{name:"다음"}).isDisabled(),true);
      console.log("PASS browser interactions: filter, disagree, empty state, reset, jitter and pagination");
    } finally {
      await page.close();
    }

    // TRACE homepage document-card interaction (Issue #58).
    // Verify live CSS, pointer positioning, reduced-motion and link destinations.
    const documentsPage = await browser.newPage({viewport:{width:1366,height:900}});
    try {
      const response = await documentsPage.goto(base + "/", {waitUntil:"networkidle", timeout:30000});
      assert.equal(response?.status(),200,"TRACE portfolio must respond 200");
      const cards = documentsPage.locator("#documents .document-item.spotlight-card");
      assert.equal(await cards.count(),3,"All application documents should react to pointer hover");
      const links = [
        "/documents/resume",
        "/documents/personal-statement",
        "/documents/project-experience"
      ];
      for (let i=0;i<3;i++) {
        const link = cards.nth(i).locator(".document-download");
        const href = await link.getAttribute("href");
        assert.ok(href === links[i] || href === links[i] + "/", "Document link changed: " + href);
      }
      const first = cards.first();
      await first.hover();
      const rect = await first.boundingBox();
      assert.ok(rect,"Document card must be visible");
      await documentsPage.mouse.move(rect.x + 30,rect.y + 35);
      await documentsPage.waitForTimeout(430);
      const active = await first.evaluate((element)=>({
        x: element.style.getPropertyValue("--spotlight-x"),
        y: element.style.getPropertyValue("--spotlight-y"),
        transform: getComputedStyle(element).transform,
        glow: getComputedStyle(element,"::after").opacity,
        overflow: document.documentElement.scrollWidth - window.innerWidth
      }));
      assert.match(active.x,/px$/,"Cursor x should update a CSS custom property");
      assert.match(active.y,/px$/,"Cursor y should update a CSS custom property");
      assert.notEqual(active.transform,"none","Hover should lift document card");
      assert.equal(active.glow,"1","Mouse glow should be visible on hover");
      assert.ok(active.overflow <= 2,"Document hover causes horizontal overflow");
      await documentsPage.emulateMedia({reducedMotion:"reduce"});
      const reduced = await first.evaluate(element=>({
        transform:getComputedStyle(element).transform,
        glowDisplay:getComputedStyle(element,"::after").display
      }));
      assert.equal(reduced.transform,"none","Reduced motion should disable card lift");
      assert.equal(reduced.glowDisplay,"none","Reduced motion should disable glow");
      console.log("PASS TRACE document-card pointer glow, floating hover, reduced motion and links");
    } finally {
      await documentsPage.close();
    }

    // A separate smoke check against the real public deployment, not the local static build.
    // This confirms that PR #47's title fix actually reached Vercel.
    const publicUrl = "https://trace-eight-topaz.vercel.app/ech-beacon-explorer";
    const production = await browser.newPage({viewport:{width:1366,height:900}});
    try {
      const response = await production.goto(publicUrl, {waitUntil:"domcontentloaded", timeout:30000});
      assert.equal(response?.status(),200,"Public Vercel BR-B URL must respond 200");
      await production.locator("#explorer-title > span").first().waitFor({timeout:15000});
      for (const width of [1366,1920]) {
        await production.setViewportSize({width,height:900});
        const live = await production.evaluate(() => {
          const first=document.querySelector("#explorer-title").firstElementChild;
          const second=first.nextElementSibling;
          const range=document.createRange();range.selectNodeContents(first);
          const ranges=[...range.getClientRects()];
          return {first:first.textContent.trim(),second:second.textContent.trim(),lines:ranges.length,
            right:Math.max(...ranges.map(r=>r.right)),available:first.getBoundingClientRect().right,
            whitespace:getComputedStyle(first).whiteSpace};
        });
        assert.equal(live.first,"암호화된 연결 뒤의 탐지 결과를");
        assert.equal(live.second,"숫자로 검증하다.");
        assert.equal(live.whitespace,"nowrap");
        assert.equal(live.lines,1);
        assert.ok(live.right <= live.available+2,"Production title overflows at "+width);
        console.log("PASS production Vercel title width="+width+"px");
      }
    } finally { await production.close(); }
  } finally {
    await browser.close();
  }
})().catch(err=>{console.error(err);process.exitCode=1;});
