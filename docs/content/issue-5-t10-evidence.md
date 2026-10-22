# Issue #5 T10 연구 근거 및 T13 예정 슬롯

공개 소스: https://github.com/SuperNova080710/ech-beacon-detection

- 연구 원고: https://github.com/SuperNova080710/ech-beacon-detection/blob/main/docs/paper-t10-ko.md
- Held-out 평가: https://github.com/SuperNova080710/ech-beacon-detection/blob/main/results/metrics/main-v1/heldout-evaluation.json
- PCAP 200개: https://github.com/SuperNova080710/ech-beacon-detection/releases/tag/main-v1-pcap-v1
- 연구 기록: https://github.com/SuperNova080710/ech-beacon-detection/blob/main/docs/research-log.md

## 비교 기준

- 전체 합성 실험 200개, 고정 분할 Calibration 90개, Held-out 110개.
- Held-out Beacon 50 / Normal 60.
- Timing-only: TP50 FP10 TN50 FN0, F1 0.9091.
- Multi-feature: TP50 FP7 TN53 FN0, F1 0.9346.
- 두 탐지기 Recall 1.0: 고지터 재현율 우위 가설 **지지되지 않음**.
- Multi-feature의 오탐 개선과 더 높은 추론 비용을 함께 언급.
- 합성 단일 통제환경 실험이며 실제 악성 공격 일반화를 주장하지 않음.
- ALEPH T10 연구 원고는 과거 Digital Twin 학술 논문과 **다른 연구**.
- 공개 GitHub 링크의 존재는 확인했으나 익명 브라우저 HTTPS 접근은 별도 확인 필요.

## 역할/SAR

상황: Native ECH 환경에서 지터가 적용된 HTTPS 비콘 분류.
행동: 테스트베드 구성, 200개 Trial 설계/실행, 고정 분할 후 탐지기 비교 및 재현 자료 관리.
결과: 정상 오탐 10→7, F1 0.9091→0.9346, 두 모델 Recall 동일.

이는 프로젝트 수행 범위를 나타내며 외부의 독립적 개인 기여율 검증으로 주장하지 않는다.

## T13

현재 미완료 예정 슬롯이다. 실제 앱의 스택, 출시, 성과, 배포 주소를 만들지 않는다.

## 남은 확인

- [ ] 브라우저에서 익명 HTTPS 공개 근거 링크 열기
- [ ] 모바일/키보드 화면 검사
- [ ] GitHub Actions 완료
- [ ] 사용자 병합 결정
