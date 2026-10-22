# BR-B 제품 정의 — ECH Beacon Explorer

> 기획 기준: 2026-10-22. 논문 결과·범위는 [T10 연구 저장소](https://github.com/SuperNova080710/ech-beacon-detection)의 `main-v1` 동결 산출물을 따른다.
> 실제 앱 구현·배포는 별도 하위 Issue에서 처리하며 이 문서만으로 앱이 제작됐다는 뜻은 아니다.

## 1. 누구에게, 어떤 일을 돕는가 (BRB-C01)

**한 문장:** 암호화된 HTTPS Beacon 트래픽의 탐지 방식을 비교하려는 **보안 학습자와 분석자**가 **T10 논문의 합성 Held-out 실험 110건**을 선택해 Timing-only·Multi-feature의 **같은 사례별 판정, 정상 오탐 차이, 추론 비용**을 함께 살펴보며 탐지기 선택의 **정확도와 처리 비용 트레이드오프를 이해하도록 돕는 앱**입니다.

- **앱 이름:** ECH Beacon Explorer
- **화면에 표시할 원 논문명:** Native ECH 환경에서 지터가 적용된 HTTPS Beacon 트래픽의 경량 메타데이터 기반 탐지 비교
- **영문 논문명:** Design and Evaluation of a Lightweight Multi-Feature Flow-Based Detector for Jittered Beacon Traffic under Native ECH
- **핵심 연구 결과:** 두 탐지기 모두 Beacon Recall 1.0000. Multi-feature는 동일 정상 샘플 60건에서 오탐이 **10→7건**으로 줄었지만, 이미 추출된 110행을 처리하는 순수 추론 배치 중앙값은 **0.080385ms→1.408802ms**로 약 **17.53배** 높았다.
- **가설 해석:** 원래 예상한 높은 지터 조건에서의 **Multi-feature Recall 우위는 지지되지 않았다**. 낮아진 오탐은 정상 `irregular-lognormal` 프로필에 집중됐다.

### 명시적으로 주장하지 않는 내용

- 실제 기업망/운영망 또는 실제 악성코드 C2를 탐지할 수 있는 배포 제품이라는 주장
- 새로운 PCAP을 업로드하면 모델이 실시간 분석하는 기능(원문 연구에 없는 별도 기능)
- 최신 데이터로 재학습하거나 논문 성능이 임의 상황에 일반화된다는 주장
- 차이의 통계적 유의성·ECH 적용 여부에 대한 인과관계·동일 작업량의 추론 효율을 검증했다는 주장

## 2. 방문자가 설명 없이 직접 하는 세 가지 (BRB-C02)

| 번호 | 사용자 행동 | 조작 | 확인 가능한 결과 | 검증 연결 |
| --- | --- | --- | --- | --- |
| ① | **시나리오 선택** | `Beacon 지터 0/10/30/50/70%` 또는 `정상 프로필 3종` 선택 | 해당 종류의 합성 실험 표본 개수, 특징 및 선택 가능한 Trial 목록 | C03, C05 |
| ② | **같은 Trial 두 탐지기의 판단 비교** | 공개된 Held-out `trial_id` 하나 선택(또는 ID 검색) | Timing-only / Multi-feature의 고정된 0/1 판정, 원본 라벨, TP·FP 등 오류 여부. 정상 샘플 중 두 판정이 갈리는 3개 사례를 탐색 | C04, C05 |
| ③ | **성능·비용의 선택 기준 확인** | 전체 또는 프로필별 요약으로 이동 | 고정 Held-out F1/FPR/Recall과 오탐 10→7, 순수 추론 비용 약 17.53배를 나란히 비교. 이득과 한계를 설명 | C04, C05 |

세 동작은 **로그인·파일 업로드·외부 API 키가 없어도** 실제 공개 데이터에서 작동해야 합니다. 지원하지 않는 입력, 없는 ID, 빈 검색은 친절한 안내를 보여주며 화면을 멈추지 않아야 합니다.

## 3. 정확히 어떤 데이터를 사용하는가

| 데이터 | 공개 원천 | 의미 |
| --- | --- | --- |
| 원 논문·해석 | [T10 한국어 원고](https://github.com/SuperNova080710/ech-beacon-detection/blob/main/docs/paper-t10-ko.md) | 연구 질문·범위·한계 |
| 동결 비교 성능 | [heldout-evaluation.json](https://github.com/SuperNova080710/ech-beacon-detection/blob/main/results/metrics/main-v1/heldout-evaluation.json) | 110 Held-out Trials / 두 detector TP·FP·TN·FN |
| Timing-only 예측 | [predictions.csv](https://github.com/SuperNova080710/ech-beacon-detection/blob/main/results/timing-only/main-v1/predictions.csv) | 동일 Trial의 Timing-only 동결 판정 |
| Multi-feature 예측 | [predictions.csv](https://github.com/SuperNova080710/ech-beacon-detection/blob/main/results/multi-feature/main-v1/predictions.csv) | 동일 Trial의 Multi-feature 동결 판정 |
| 순수 추론 비용 | [processing-cost-benchmark.json](https://github.com/SuperNova080710/ech-beacon-detection/blob/main/results/metrics/main-v1/processing-cost-benchmark.json) | 이미 추출된 특징 110행의 추론 배치 비용. 전체 분석 시간 아님 |

- 200 Trial은 전체 합성 실험 수, **110 Trial**은 Hold-out 평가 수(Beacon 50, Normal 60). Calibration 90은 여기서 재평가하거나 추론하지 않습니다.
- Beacon 지터는 `0, 10, 30, 50, 70%`이며 Held-out 지터별 Beacon 10건입니다. 지터별 수치에서 같은 정상 60건을 반복 사용했으므로 5개의 독립 정상군으로 해석하지 않습니다.
- 정상 프로필은 `interactive-burst: 24`, `irregular-lognormal: 18`, `mixed-activity: 18`. Timing-only 오탐 10건, Multi-feature 오탐 7건은 모두 `irregular-lognormal`에 있습니다.
- 두 탐지기 모두 잘못 판정한 정상 7개, Timing-only만 잘못 판정한 3개, Multi-feature만 잘못 판정한 0개, 두 탐지기 모두 정상 판정 50개입니다.
- 17.53배는 동일 110행 배치에서 측정된 **순수 추론 시간 중앙값의 비율**로, 모델 학습·특징 추출·파일 입출력을 포함하지 않습니다.

## 4. 구현·검증에서 지켜야 할 분리

- **Trace 단일 저장소의 별도 `/ech-beacon-explorer` 라우트**를 우선 사용합니다. 공개 URL은 해당 경로이며 첫 화면/내비게이션·기존 BR-A 내용은 변경하지 않습니다.
- 앱은 공개된 동결 실험 CSV/JSON의 필요한 열만 **정적 파일**로 빌드에 포함합니다. 구체적인 데이터 추출 및 검증은 상위 Issue #22에서 진행합니다.
- UI를 구성하는 작업은 상위 Issue #21, 배포 접근은 #23, 기존 Trace T13 대표작 자리 교체는 #24에서 진행합니다.
- 구현·배포 전에는 앱 링크·작동·성과를 실제 완료했다고 표시하지 않습니다.
- 입력/출력 데이터에 이름·연락처·JWT/API 토큰·리추얼 원문을 넣지 않고 개인정보 자체가 필요 없는 구조를 선택합니다.
- 처음 보는 동료 한 줄 감상은 **실제 사용자 테스트 이후에만 익명으로 기록**합니다.

## 5. 완료 판정 — Issue #25

- [x] 앱이 돕는 사람·하는 일·T10에서 쓰는 결과가 단일 문장에 포함됨
- [x] 사용자의 **세 가지 실제 행동과 확인할 결과**가 분명함
- [x] 합성 Held-out 110건 및 오탐/비용 수치를 원본과 대조해 출처 표기
- [x] 논문의 원 가설이 지지되지 않았고 일반화 한계가 있음을 명시
- [ ] 사용자 측에서 앱 목적 문구를 변경하고 싶다면 PR 병합 전에 검토
