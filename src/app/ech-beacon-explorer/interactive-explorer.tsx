"use client";

import { useMemo, useState } from "react";
import dataset from "@/content/br-b-heldout-trials.json";
import research from "@/content/br-b-research-contract.json";
import styles from "./interactive.module.css";

type Trial = (typeof dataset.trials)[number];
type Group = "all" | "beacon" | "normal";
type Detector = "timingOnlyPrediction" | "multiFeaturePrediction";

const profiles = ["all", "interactive-burst", "irregular-lognormal", "mixed-activity"] as const;
const jitters = ["all", "0", "10", "30", "50", "70"] as const;

function metrics(trials: Trial[], key: Detector) {
  const TP = trials.filter(t => t.groundTruth === "beacon" && t[key] === 1).length;
  const FP = trials.filter(t => t.groundTruth === "normal" && t[key] === 1).length;
  const TN = trials.filter(t => t.groundTruth === "normal" && t[key] === 0).length;
  const FN = trials.filter(t => t.groundTruth === "beacon" && t[key] === 0).length;
  const precision = TP + FP === 0 ? null : TP / (TP + FP);
  const recall = TP + FN === 0 ? null : TP / (TP + FN);
  const f1 = precision === null || recall === null || precision + recall === 0 ? null : 2 * precision * recall / (precision + recall);
  return { TP, FP, TN, FN, precision, recall, f1 };
}

const pct = (value: number | null) => value === null ? "해당 없음" : (value * 100).toFixed(1) + "%";
const f1text = (value: number | null) => value === null ? "해당 없음" : value.toFixed(4);
const verdict = (label: Trial["groundTruth"], pred: number) => pred === 1
  ? (label === "normal" ? "오탐 (FP)" : "탐지 (TP)")
  : (label === "normal" ? "정상 (TN)" : "미탐 (FN)");

export default function InteractiveExplorer() {
  const [group, setGroup] = useState<Group>("all");
  const [jitter, setJitter] = useState<(typeof jitters)[number]>("all");
  const [profile, setProfile] = useState<(typeof profiles)[number]>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [onlyDisagreements, setOnlyDisagreements] = useState(false);
  const [page, setPage] = useState(0);
  const data = dataset.trials;
  const filtered = useMemo(() => data.filter(trial =>
    (group === "all" || trial.groundTruth === group) &&
    (jitter === "all" || trial.groundTruth === "beacon" && trial.jitterPercent === Number(jitter)) &&
    (profile === "all" || trial.normalProfile === profile) &&
    (!onlyDisagreements || trial.timingOnlyPrediction !== trial.multiFeaturePrediction) &&
    trial.trialId.toLowerCase().includes(query.trim().toLowerCase())
  ), [data, group, jitter, profile, onlyDisagreements, query]);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);
  const selected = filtered.find(t => t.trialId === selectedId) ?? rows[0] ?? null;
  const timing = metrics(filtered, "timingOnlyPrediction");
  const multi = metrics(filtered, "multiFeaturePrediction");
  const reset = () => { setGroup("all"); setJitter("all"); setProfile("all"); setQuery(""); setOnlyDisagreements(false); setPage(0); setSelectedId(""); };
  const changeGroup = (value: Group) => { setGroup(value); setJitter("all"); setProfile("all"); setPage(0); setSelectedId(""); };

  return (
    <section className={styles.explorer} aria-labelledby="lab-title">
      <div className={styles.head}>
        <div><p className={styles.eyebrow}>04 / INTERACTIVE RESEARCH LAB</p><h2 id="lab-title">실제 실험 판정을 탐색하세요</h2><p>동결된 합성 Held-out 110개 표본을 필터링하고, 동일 표본에 대한 두 탐지기의 결정을 비교합니다. 이 앱은 실시간 패킷 분석기가 아닙니다.</p></div>
        <button type="button" onClick={reset} className={styles.reset}>전체 조건 초기화</button>
      </div>
      <div className={styles.controls} aria-label="실험 필터">
        <div className={styles.field}><label htmlFor="brb-group">① 트래픽 유형</label><select id="brb-group" value={group} onChange={e => changeGroup(e.target.value as Group)}><option value="all">전체 110건</option><option value="beacon">Beacon 50건</option><option value="normal">정상 60건</option></select></div>
        <div className={styles.field}><label htmlFor="brb-jitter">Beacon 지터</label><select id="brb-jitter" value={jitter} disabled={group === "normal"} onChange={e => { setJitter(e.target.value as typeof jitter); setPage(0); setSelectedId(""); }}><option value="all">모든 지터</option>{jitters.filter(x => x !== "all").map(x => <option key={x} value={x}>{x}%</option>)}</select></div>
        <div className={styles.field}><label htmlFor="brb-profile">정상 트래픽 프로필</label><select id="brb-profile" value={profile} disabled={group === "beacon"} onChange={e => { setProfile(e.target.value as typeof profile); setPage(0); setSelectedId(""); }}><option value="all">모든 프로필</option>{profiles.filter(x => x !== "all").map(x => <option key={x} value={x}>{x}</option>)}</select></div>
        <div className={styles.field}><label htmlFor="brb-search">Trial ID 검색</label><input id="brb-search" value={query} maxLength={64} placeholder="예: beacon-j00" onChange={e => { setQuery(e.target.value); setPage(0); setSelectedId(""); }} /></div>
      </div>
      <label className={styles.check}><input type="checkbox" checked={onlyDisagreements} onChange={e => { setOnlyDisagreements(e.target.checked); setPage(0); setSelectedId(""); }} /> 탐지기 간 판정이 다른 표본만 표시</label>
      <div className={styles.summary} aria-live="polite"><strong>{filtered.length}건</strong>의 표본 선택됨 · Beacon {filtered.filter(t => t.groundTruth === "beacon").length} · 정상 {filtered.filter(t => t.groundTruth === "normal").length}</div>
      <div className={styles.comparison} aria-label="선택 데이터 기준 혼동행렬">
        {([{ label: "TIMING-ONLY", m: timing }, { label: "MULTI-FEATURE", m: multi }] as const).map(({label,m}) => <article className={styles.stats} key={label}>
          <h3>{label}</h3><div className={styles.statNumbers}><span>TP <b>{m.TP}</b></span><span>FP <b>{m.FP}</b></span><span>TN <b>{m.TN}</b></span><span>FN <b>{m.FN}</b></span></div>
          <p>Precision {pct(m.precision)} · Recall {pct(m.recall)} · F1 {f1text(m.f1)}</p>
        </article>)}
      </div>
      <p className={styles.explain}>수치는 현재 필터의 표본으로 다시 계산합니다. Beacon만 고르면 정상 표본이 없어 오탐률을 계산할 수 없습니다. 지터별 Beacon은 동일한 정상 표본과 합산된 전체 평가를 대신하지 않습니다.</p>
      <div className={styles.layout}>
        <div className={styles.tablePanel}>
          <div className={styles.listHead}><h3>② 표본별 탐지 결과</h3><span>행을 선택하여 상세 비교</span></div>
          <div className={styles.tableScroll}><table><thead><tr><th scope="col">Trial ID</th><th scope="col">실제 유형</th><th scope="col">Timing</th><th scope="col">Multi</th></tr></thead><tbody>{rows.map(t => <tr key={t.trialId} className={selected?.trialId === t.trialId ? styles.active : ""}><td><button type="button" aria-pressed={selected?.trialId === t.trialId} onClick={() => setSelectedId(t.trialId)}>{t.trialId}</button></td><td>{t.groundTruth === "beacon" ? "Beacon" : "정상"}</td><td>{verdict(t.groundTruth, t.timingOnlyPrediction)}</td><td>{verdict(t.groundTruth, t.multiFeaturePrediction)}</td></tr>)}</tbody></table></div>
          {filtered.length === 0 && <p className={styles.empty} role="status">일치하는 표본이 없습니다. 검색어나 필터를 변경하거나 전체 조건을 초기화하세요.</p>}
          <div className={styles.pagination}><button type="button" disabled={safePage === 0} onClick={() => { setPage(p => Math.max(0,p-1)); setSelectedId(""); }}>이전</button><span>{safePage+1} / {pageCount} 페이지</span><button type="button" disabled={safePage+1 >= pageCount} onClick={() => { setPage(p => p+1); setSelectedId(""); }}>다음</button></div>
        </div>
        <aside className={styles.detail} aria-live="polite"><h3>선택한 표본의 판정</h3>{selected ? <><p className={styles.trialId}>{selected.trialId}</p><dl><div><dt>실제 정답</dt><dd>{selected.groundTruth === "beacon" ? "Beacon" : "정상"}</dd></div><div><dt>시나리오</dt><dd>{selected.groundTruth === "beacon" ? "지터 " + selected.jitterPercent + "%" : selected.normalProfile}</dd></div><div><dt>Timing-only</dt><dd>{verdict(selected.groundTruth,selected.timingOnlyPrediction)}</dd></div><div><dt>Multi-feature</dt><dd>{verdict(selected.groundTruth,selected.multiFeaturePrediction)}</dd></div><div><dt>Interval CV (특징값)</dt><dd>{selected.iatCv.toFixed(6)}</dd></div><div><dt>Multi-feature logit</dt><dd>{selected.multiFeatureLogit.toFixed(4)}</dd></div></dl><p>판정값은 논문에서 동결한 기존 예측입니다. 이 화면에서 임계값을 변경하거나 새로운 예측을 생성하지 않습니다.</p></> : <p>표본이 선택되지 않았습니다.</p>}</aside>
      </div>
      <div className={styles.tradeoff}><h3>③ 오탐 감소와 추론 비용 비교</h3><div className={styles.bars}><div><span>Timing-only 오탐</span><strong>{research.detectors.timingOnly.FP} / 60</strong><div><i style={{width: "100%"}} /></div></div><div><span>Multi-feature 오탐</span><strong>{research.detectors.multiFeature.FP} / 60</strong><div><i style={{width: "70%"}} /></div></div></div><p>전체 정상 표본 60건 중 오탐은 10건에서 7건으로 줄었지만, 사전 추출 특징의 110행 순수 추론 배치 중앙값은 {research.inferenceBench.timingMedianBatchMs.toFixed(3)}ms에서 {research.inferenceBench.multiMedianBatchMs.toFixed(3)}ms로 증가했습니다({research.inferenceBench.ratio.toFixed(2)}배). 특징 추출·I/O 및 실제 네트워크 탐지 비용은 포함하지 않습니다.</p><p className={styles.warning}>연구 한계: 합성 통제 환경의 평가이며 운영망 성능이나 고지터 조건의 재현율 우위가 입증된 것은 아닙니다.</p></div>
    </section>
  );
}
