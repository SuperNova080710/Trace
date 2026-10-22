# BR-B T10 동결 데이터 계약 (Issue #26)

BR-B ECH Beacon Explorer는 T10 공개 연구 `main-v1`의 **합성 실험 결과를 탐색하는 애플리케이션**이다. 이 문서는 데이터 출처·집계 단위·표시 범위를 고정한다. 구현 또는 운영 배포 완료라는 의미가 아니다.

## 기준 자료 및 재현 범위

- 연구 공개 저장소: https://github.com/SuperNova080710/ech-beacon-detection
- 고정한 연구 커밋: `daae3300003527958d7cd4a0865fbc8b911d1966`.
- 기계 판독 계약: [src/content/br-b-research-contract.json](../../src/content/br-b-research-contract.json). 논문 공개 원천을 **사람이 검증 후 전사한 상수**만 들어 있다.
- 원본 파일: `results/metrics/main-v1/heldout-evaluation.json`, `results/timing-only/main-v1/predictions.csv`, `results/multi-feature/main-v1/predictions.csv`, `results/metrics/main-v1/processing-cost-benchmark.json`.
- 경로별 원본의 제출 당시 SHA-256/고정 Prediction digest는 계약의 `source.predictionDigests`에 기록. 파일을 실제 복사할 때는 GitHub blob SHA가 아니라 **파일 바이트 SHA-256**으로 검증해야 한다.
- 직접 조회로 확인한 사항: 각 Predictor CSV는 110개 행·110개 유일 `trial_id`를 갖고 두 집합은 동일하다. 동일 `trial_id`의 값만 나란히 비교한다.
- 원본 CSV의 `prediction` 열은 **이미 동결된 결정**이다. `trial_id`에는 정답 클래스를 나타내는 `beacon-`/`normal-` 접두사가 있지만 이것을 추론기의 입력값으로 사용해서는 안 된다. 평가용 정답 라벨과 동결 예측값을 명확히 분리한다.

## 시험 분할·지표 정의

| 구분 | 값 | 주의 |
|---|---:|---|
| 전체 실험 | 200 Trial | 110 Test와 같지 않다 |
| Calibration | 90 Trial | Test에 합치지 않는다 |
| Held-out Test | 110 Trial = Beacon 50 + Normal 60 | 주요 성능의 유일한 분모 |
| 정상 프로필별 Test | interactive-burst 24 · irregular-lognormal 18 · mixed-activity 18 | 합계 60 |
| Beacon 지터별 Test | 0/10/30/50/70%, 각 10개 | 정상 60개를 지터별 분석에서 **반복 사용** |

| 지표 | Timing-only | Multi-feature |
|---|---:|---:|
| TP / FP / TN / FN | 50 / 10 / 50 / 0 | 50 / 7 / 53 / 0 |
| Recall | 1.0000 | 1.0000 |
| Precision | 0.8333 | 0.8772 |
| F1 | 0.9091 | 0.9346 |
| FPR | 0.1667 | 0.1167 |
| 순수 추론 시간, 110개 Feature 배치 중앙값 | 0.080385ms | 1.408802ms |

같은 정상 60건의 쌍별 결과는 모두 오탐 7건, Timing-only만 오탐 3건, Multi-feature만 오탐 0건, 둘 다 정상 50건이다. **차이 난 세 표본은 irregular-lognormal 정상 프로필**에서 발생한다.

비율 `1.408802 / 0.080385 ≈ 17.53`은 **미리 추출된 110행을 처리하는 순수 추론 마이크로벤치마크**의 중앙값 비율이며 PCAP 파싱·특징 추출·파일 I/O·학습은 포함하지 않는다. 이 값을 전체 분석 시간이나 동일 업무 처리 효율의 성능 차이라고 표시하지 않는다.

## 소비 앱의 데이터 계약

- `scenario`: `{type:'beacon-jitter',jitterPercent:0|10|30|50|70}` 또는 `{type:'normal-profile',profile:'interactive-burst'|'irregular-lognormal'|'mixed-activity'}` 중 하나.
- `trialId`: 선택한 Held-out 원본 행의 정확한 ID. 없는 ID/지원하지 않는 시나리오는 안내 UI로 처리한다.
- `label`: 평가용 실제 클래스(Beacon/Normal). **탐지 결과 `prediction`과 구분**해서 UI에 표시한다.
- `timingPrediction`, `multiPrediction`: 원본 두 CSV의 0 또는 1 판정. 같은 ID에서만 결합하며 변조/중복/행 누락을 거부한다.
- `score`: 각기 `iat_cv` 및 `multi_feature_logit`으로 단위와 의미가 달라 같은 척도로 비교하거나 확률로 표기하지 않는다.
- 공개 앱에는 원본의 필수 열만 정적으로 제공한다. 다음 #31에서 데이터 추출과 실제 SHA 대조, #32에서 모든 110행을 사용한 분류 지표 회귀 시험을 담당한다.
- 자동 외부 API 조회나 토큰·원격 계정은 필수가 아니다. 정적 배포 및 개인정보 부재를 우선한다.

## 논문과 발표의 차이 제한

이 연구의 원래 가설인 "높은 지터에서 Multi-feature가 Beacon Recall 우위를 유지할 것"은 **지지되지 않았다**. 동일 표본에서 **오탐이 감소**했다는 사실만 별도로 설명하고, 합성 단일 테스트베드 결과를 실제 운영망 탐지 성능이라고 주장하지 않는다. 관측 결과의 통계적 유의성도 별도 주장하지 않는다.

## 검증

```bash
npm run test
npm run check
```

`tests/br-b-research-contract.test.mjs`는 출처 SHA와 수치 계약, 분할 합계, 혼동행렬·paired Normal 합계, Recall/Precision/F1/FPR, 고정 비용 비율 및 연구 한계 플래그를 검사한다. 이 검증은 **원본 연구 자료를 CI에서 매번 내려받아 바이트 검증하는 시험이 아니며**, 원천 바이트 일치 확인은 #31에서 별도로 구현한다. 수치를 임의로 변경하면 회귀 테스트가 실패한다.
