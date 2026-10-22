# BR-B · 공개 합성 Held-out 데이터 재현 (#31)

2026-10-22 기준 T10 공개 연구 `main-v1`에서 가져온 **고정 예측 결과**를 ECH Beacon Explorer 앱용으로 축소했습니다. 새 학습, 새 예측 또는 운영망 데이터는 생성하지 않습니다.

## 구성

| 파일 | 역할 |
|---|---|
| `data/br-b/source/timing-only-predictions.csv` | 원 T10 Timing-only 동결 예측 원본 110행. GitHub 공개 자료 바이트 보존 |
| `data/br-b/source/multi-feature-predictions.csv` | 원 T10 Multi-feature 동결 예측 원본 110행. GitHub 공개 자료 바이트 보존 |
| `src/content/br-b-heldout-trials.json` | 두 CSV를 `trial_id`로 결합한 110개 공개 합성 사례(앱 정적 입력) |
| `scripts/build-br-b-heldout.mjs` | 입력 SHA-256과 ID·분류기 판정·혼동행렬·쌍별 FP를 검사하고 동일 JSON 재현 |
| `src/content/br-b-research-contract.json` | 별도 #26에서 이미 고정된 연구 커밋·SHA-256·지표 계약 |
| `tests/br-b-heldout-source.test.mjs` | 원본 해시, 전체 110건, 정적 변환 동등성, 시나리오·오탐·개인정보 7개 시험 |

고정한 연구 커밋:
`daae3300003527958d7cd4a0865fbc8b911d1966`

원본 위치:
- https://github.com/SuperNova080710/ech-beacon-detection/blob/daae3300003527958d7cd4a0865fbc8b911d1966/results/timing-only/main-v1/predictions.csv
- https://github.com/SuperNova080710/ech-beacon-detection/blob/daae3300003527958d7cd4a0865fbc8b911d1966/results/multi-feature/main-v1/predictions.csv

전송이나 재생성 과정의 byte 변경을 피하기 위해 `--check`는 **파일 바이트 SHA-256**을 `contract.source.predictionDigests`에 담긴 이미 검증된 원천 해시와 비교합니다. GitHub blob SHA-1과 바이트 SHA-256을 혼동하지 않습니다.

## 누구를 대상으로 한 데이터인가

- **합성 데이터만 사용**: 원 T10 논문의 통제된 Native ECH HTTPS 실험에서 얻은 `main-v1` 예측 산출물입니다.
- `50 Beacon + 60 Normal`, Held-out 110행입니다. Calibration 90행을 붙이거나 200 전체를 Held-out으로 취급하지 않습니다.
- 각 예측 파일의 샘플을 `trial_id`로 결합하며 **서로 다른 행을 오인해 맞붙이지 않습니다**.
- 원본 `prediction`은 각각 Timing-only 및 Multi-feature의 **이미 결정된 0 또는 1 판정**입니다. 앱의 `groundTruth`는 `trialId` 메타데이터에서 계산한 **사후 평가용 정답**일 뿐 새로운 탐지 입력이 아닙니다.
- 원본 `iat_cv`와 `multi_feature_logit`은 각각 의미가 다른 수치입니다. 같은 기준의 확률이나 동일한 측정 단위처럼 직접 비교하지 않습니다.
- 지터별 Beacon 10건, 정상 세 유형 24/18/18건. 지터별 평가에서는 동일 정상 60건을 재사용하므로 다섯 개 독립 시험으로 합산하지 않습니다.
- Timing-only / Multi-feature 오탐 10/7 및 쌍별 정상 60건 차이 3건을 보존합니다.

## 정적 앱용 필드

`trialId`, `groundTruth`, `jitterPercent`(Beacon에만 숫자), `normalProfile`(Normal에만 문자열), `timingOnlyPrediction`, `multiFeaturePrediction`, `iatCv`, `multiFeatureLogit`. 연구 출처 커밋과 범위를 JSON 최상위 필드에 명시했습니다.

합성 트래픽의 개별 PCAP·사용자·동료의 실명·연락처·비공개 기록, 인증 토큰은 포함되지 않습니다. 이 파일은 **원 논문 작성자 본인의 공개 연구 데이터에 한정**하며, 원천 저장소의 별도 라이선스나 제3자 데이터 사용 권리를 임의로 보장하지 않습니다.

## 실행

```bash
npm run check:brb-data
npm run test
npm run check
```

데이터를 재생성할 때만 아래 명령을 실행합니다.

```bash
node scripts/build-br-b-heldout.mjs --write
```

`--check`는 **읽기 전용**으로 생성 JSON과 디스크 파일을 완전 비교합니다. 입력 변경·SHA-256 불일치·Trial ID 누락/중복·예측 혼동행렬 불일치·출력 변경은 실패하도록 설계합니다.

## 후속 작업과 경계

- #32에서는 **전체 110행으로 F1·Recall·FPR과 프로필별 판정 차이를 다시 계산**하는 별도 회귀 테스트를 보강합니다.
- #27/#28에서 단일 정적 라우트와 시나리오/Trial 선택 UI를 구현하기 전에는 웹 사용자 테스트·공개 URL을 완료로 표시하지 않습니다.
- 본 변경은 공개 자료의 재현 가능한 앱 입력을 준비한 것일 뿐 **새 모델/실시간 악성 트래픽 분석 기능이 아닙니다**.
