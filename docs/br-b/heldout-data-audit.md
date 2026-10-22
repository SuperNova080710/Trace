# BR-B 공개 합성 Held-out 데이터 축소 및 무결성 감사 (Issue #31)

## 목적

T10 논문에서 공개한 합성 Native ECH 실험의 **고정 Held-out 110건**을 BR-B 앱이 다운로드 없이 읽을 수 있는 정적 JSON으로 축소한다. 전체 PCAP/Flow Metadata/리추얼/개인정보를 복제하지 않는다.

## 원본 범위

- 원본 저장소: https://github.com/SuperNova080710/ech-beacon-detection
- **정확한 커밋:** `daae3300003527958d7cd4a0865fbc8b911d1966`
- `results/timing-only/main-v1/predictions.csv` · SHA-256 `afb3ab1fd99461e2cd56f54a8acde3e899d7bbdd3fefd9096b7c330b7079642a`
- `results/multi-feature/main-v1/predictions.csv` · SHA-256 `ffa99bcb98eb0b15e0ce9fff3dfa60c58404e39e255c44d28c5705aea67e7ec0`
- `results/metrics/main-v1/heldout-evaluation.json` · SHA-256 `b357dee703565d98b65467b94f488f9681e53f3ed41b1e3153f432279be9f46b`
- 위 세 파일의 원본 바이트를 GitHub에서 고정 커밋으로 조회해 **SHA-256 해시를 계산하고 모두 기대값과 일치함을 별도 확인**함. 이 검사 수행 사실과 커밋은 PR에 기록함.

원본 저장소 루트에서 별도 `LICENSE` 파일은 확인되지 않았다. 두 저장소가 같은 작성자 소유임을 전제로 본인의 공개 합성 실험 데이터 일부만 재사용하며, **이 재사용으로 제3자에게 별도의 재라이선스를 부여한다고 주장하지 않는다.** 관련 공개 사용조건이 변경되면 검토한다.

## 축소 산출물

`src/content/br-b-heldout-trials.json`에 스키마 `1`, `main-v1-heldout`, 원본 저장소·고정 커밋·원본 경로·SHA-256, 총 110개 합성 Trial을 보관한다.

각 Trial의 허용된 필드:

| 필드 | 의미 |
|---|---|
| `id` | 합성 연구 Trial 식별자 (`beacon-j00-t11` 등); 사용자의 실제 행위 정보가 아님 |
| `kind` | 평가용 정답 클래스 `beacon`/`normal`; **분류기 입력값이 아님** |
| `jitterPercent` | Beacon 지터 0/10/30/50/70 또는 `null` |
| `profile` | Normal 프로필 `interactive-burst`/`irregular-lognormal`/`mixed-activity` 또는 `null` |
| `timing.score` | `iat_cv`(무차원 변동계수), 확률이 아님 |
| `timing.prediction` | 원본 Timing-only 동결 예측 0/1 |
| `multi.score` | Multi-feature 원본 `logit`, `iat_cv`와 같은 척도가 아니며 확률이 아님 |
| `multi.prediction` | 원본 Multi-feature 동결 예측 0/1 |

CSV 두 개의 `trial_id`를 기준으로 **유일 ID 110개와 두 집합의 완전한 일치 여부**를 검사한 뒤 연결했다. 결과는 Beacon 50개·Normal 60개이며 Timing-only TP50/FP10/TN50/FN0, Multi-feature TP50/FP7/TN53/FN0로 집계됐다. 같은 정상 표본에서 두 탐지기 모두 오탐 7개, Timing-only만 오탐 3개, Multi-feature만 오탐 0개, 모두 정상 판정 50개였다. 오탐 차이 3개는 `normal-irregular-lognormal-t14/t21/t26`.

**주의:** 원본 ID의 `beacon`/`normal` 구분은 실험의 정답 레이블을 표현할 뿐, 모델이 정답을 안다는 뜻이 아니다. 앱은 동결 예측값을 다시 계산하거나 임의의 새 샘플 판정을 만들어내지 않는다. 0~70% 지터에 따라 공통 정상 60개를 중복 집계하지 않는다.

## 프라이버시·보안

- 라이브 C2 분석·운영망 탐지·새 모델 학습을 구현하지 않는다.
- 실제 사용자 트래픽, 인증 토큰, API 키, 이메일, 동료 이름, 리추얼 원문, BR-A 서류를 포함하지 않는다.
- 현재 JSON은 공개 소스의 정적 자료이며 서버 접근 권한이나 계정이 필요 없다.
- `tests/br-b-heldout-trials.test.mjs` 9개로 전 행 ID·유형·판정·교차 쌍·지터 개수·필드 화이트리스트를 검사한다.
- **한계:** CI는 저장소에 저장된 축소 데이터가 고정 계약과 일치하는지 검사한다. 모든 실행에서 네트워크에 접속해 원본 바이트를 재다운로드하지는 않는다. 이번 작성 과정에서 원본 파일 SHA-256은 직접 확인했다.

## 다음 작업

- #32에서 축소 110행 데이터로 지표를 **재계산**하고 결과 JSON과 더 상세한 동결 수치 동등성을 회귀 검증
- #27·#28에서 공개 UI의 필터/표본 비교에 실제 축소 데이터를 사용
- #33에서 정적 `out/`과 공개 URL의 개인정보·비밀값 검사 범위 확대
