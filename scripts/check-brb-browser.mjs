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

    for (const [width, reducedMotion] of [[1366, "no-preference"], [390, "no-preference"], [390, "reduce"]]) {
      const experiencePage = await browser.newPage({viewport: {width, height: 900}, reducedMotion});
      try {
        await experiencePage.addInitScript(() => {
          const startTransition = document.startViewTransition.bind(document);
          window.alephViewTransitions = [];
          document.startViewTransition = update => {
            const dialog = document.querySelector("#aleph-document-viewer");
            const button = document.querySelector("[data-trace-credential-origin]");
            const opening = !dialog.open;
            const rect = element => {
              const {x, y, width, height} = element.getBoundingClientRect();
              return [x, y, width, height];
            };
            const result = {
              button: button.textContent.trim(),
              start: null,
              end: null,
              frames: [],
              animations: [],
              finished: false,
            };
            const transition = startTransition(() => {
              result.start = rect(opening ? button : dialog);
              return update();
            });
            window.alephViewTransitions.push(result);
            void transition.ready.then(() => {
              const animations = document.getAnimations();
              const group = animations.find(animation => animation.effect?.pseudoElement === "::view-transition-group(trace-launch)");
              result.end = rect(opening ? dialog : button);
              result.animations = animations.map(animation => animation.animationName);
              result.frames = group?.effect.getKeyframes().map(frame => {
                const {e, f} = new DOMMatrix(frame.transform);
                return [e, f, parseFloat(frame.width), parseFloat(frame.height)];
              }) ?? [];
            }, () => {});
            void transition.finished.then(() => { result.finished = true; });
            return transition;
          };
        });
        await experiencePage.goto(base + "/#experience", {waitUntil: "networkidle"});
        const card = experiencePage.locator("#experience .project-card");
        const dialog = experiencePage.locator("#experience dialog");
        let expectedTransitions = 0;

        async function checkViewTransition(title) {
          if (reducedMotion === "reduce") {
            assert.equal(await experiencePage.evaluate(() => window.alephViewTransitions.length), 0);
            return;
          }

          expectedTransitions++;
          await experiencePage.waitForFunction(count => {
            const transitions = window.alephViewTransitions;
            return transitions.length === count && transitions.at(-1).finished;
          }, expectedTransitions);
          const result = await experiencePage.evaluate(() => window.alephViewTransitions.at(-1));
          assert.ok(result.button.startsWith(`${title} 보기`));
          assert.equal(result.frames.length, 2, "Shared View Transition group should animate position and size");
          for (const [frame, bounds] of [[result.frames[0], result.start], [result.frames[1], result.end]]) {
            assert.ok(frame.every((value, index) => Math.abs(value - bounds[index]) <= 5),
              `View Transition frame ${frame} should match element bounds ${bounds}`);
          }
          assert.ok(result.animations.includes("trace-credential-backdrop"), "Backdrop snapshot should animate");
        }

        for (const [title, asset] of [["수료증", "completion"], ["인증서", "certification"]]) {
          const trigger = card.getByRole("button", {name: `${title} 보기`});
          if (width > 760) {
            const background = await trigger.evaluate(el => getComputedStyle(el).backgroundColor);
            await trigger.hover();
            const hover = await trigger.evaluate(async el => {
              await Promise.all(el.getAnimations().map(animation => animation.finished));
              const style = getComputedStyle(el);
              return {background: style.backgroundColor, decoration: style.textDecorationLine};
            });
            assert.notEqual(hover.background, background);
            assert.equal(hover.decoration, "none");
          }

          await trigger.press("Enter");
          const viewer = experiencePage.getByRole("dialog", {name: `SKT ALEPH ${title}`});
          await viewer.waitFor();
          const image = viewer.getByRole("img");
          assert.equal(await image.getAttribute("src"), `/experience/aleph-${asset}.jpg`);
          await image.evaluate(element => element.decode());
          await checkViewTransition(title);

          if (width === 1366) {
            await viewer.getByRole("heading").click();
            assert.ok(await viewer.isVisible(), "Clicking inside a credential should leave it open");
            await experiencePage.mouse.click(4, 20);
          } else if (asset === "completion") await experiencePage.keyboard.press("Escape");
          else await viewer.getByRole("button", {name: "닫기"}).click();
          await dialog.waitFor({state: "hidden"});
          await checkViewTransition(title);
          assert.ok(await trigger.evaluate(element => document.activeElement === element));
        }
        console.log(`PASS ALEPH certificate dialog at ${width}px (${reducedMotion})`);
      } finally {
        await experiencePage.close();
      }
    }

    const launchRoutes = [
      ["research-app", "/ech-beacon-explorer"],
      ["document-resume", "/documents/resume"],
      ["document-personal-statement", "/documents/personal-statement"],
      ["document-project-experience", "/documents/project-experience"],
    ];
    for (const width of [1366, 390]) {
      const navigationPage = await browser.newPage({viewport: {width, height: 900}});
      try {
        // Serve the exported HTML at the same extensionless URLs used by the deployed site.
        await navigationPage.route(/\/(?:ech-beacon-explorer|documents\/[^/.]+)\/?$/, async route => {
          const url = new URL(route.request().url());
          url.pathname = url.pathname.replace(/\/$/, "") + ".html";
          await route.fulfill({response: await route.fetch({url: url.href})});
        });
        await navigationPage.addInitScript(() => {
          window.addEventListener("pagereveal", ({viewTransition}) => {
            if (!viewTransition) return;
            void viewTransition.ready.then(() => {
              const group = document.getAnimations().find(animation => animation.effect?.pseudoElement === "::view-transition-group(trace-launch)");
              window.routeLaunchFrames = group?.effect.getKeyframes().map(frame => {
                const {e, f} = new DOMMatrix(frame.transform);
                return [e, f, parseFloat(frame.width), parseFloat(frame.height)];
              });
            }, () => {});
          });
        });

        for (const [id, path] of launchRoutes) {
          await navigationPage.goto(base + "/");
          const trigger = navigationPage.locator(`#${id} a[data-trace-launch-link]`);
          await trigger.scrollIntoViewIfNeeded();
          const button = await trigger.boundingBox();
          await trigger.click();
          await navigationPage.waitForURL(url => url.pathname.replace(/\/$/, "") === path);
          await navigationPage.waitForFunction(() => window.routeLaunchFrames?.length === 2);
          const [start, expanded] = await navigationPage.evaluate(() => window.routeLaunchFrames);
          assert.ok(start.every((value, index) => Math.abs(value - [button.x, button.y, button.width, button.height][index]) <= 6),
            `${path} should open from its link bounds, received ${start}`);
          assert.ok(expanded[2] >= width * 0.95 && expanded[3] >= 890, `${path} should expand to the viewport`);

          await navigationPage.locator(`a[href="/#${id}"]`).click();
          await navigationPage.waitForURL(`**/#${id}`);
          await navigationPage.waitForFunction(() => window.routeLaunchFrames?.length === 2);
          const [expandedBeforeClose, end] = await navigationPage.evaluate(() => window.routeLaunchFrames);
          const returned = await trigger.boundingBox();
          assert.ok(expandedBeforeClose[2] >= width * 0.95 && expandedBeforeClose[3] >= 890);
          assert.ok(end.every((value, index) => Math.abs(value - [returned.x, returned.y, returned.width, returned.height][index]) <= 6),
            `${path} should close to its link bounds, received ${end}`);
        }
        console.log(`PASS shared View Transition for four home links at ${width}px`);
      } finally {
        await navigationPage.close();
      }
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
