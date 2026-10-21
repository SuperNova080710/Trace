# Issue #7 — 결정적 근거 후보 생성기 (1차 구현)

## 현재 범위

- **독립 브랜치**로 구현하며 Issue #4의 미병합 변경사항을 침범하지 않는다.
- 기존 수기 출석/리추얼 원본 JSON을 바로 사이트로 노출하지 않으며, 입력은 **비식별·검토된 요약 스키마**다.
- 출력은 세 역량별 후보 문구 및 해당 날짜, 출석/과제/리추얼 개별 지표, 미확정 상태이며 반드시 `pending`이다.
- 날짜 정렬과 객체 키 정규화로 동일 입력의 byte-for-byte 결과 및 SHA-256을 재현한다.
- `src/content/`, `public/` 또는 승인 명부에 자동 쓰기하지 않는다.
- **아직 원본 리추얼 JSON 변환, 승인 게이트 구현, ZIP 패키징 및 클린룸 검증은 미완료**이며 다음 단계다.

## 입력 예시 (가상의 샘플)

```json
{
  "schema": "trace.generator-input.v1",
  "rituals": {"days": [
    {"date":"2026-01-01","openHasText":true,"closeHasText":true,"focusTags":["self_regulation"]},
    {"date":"2026-01-02","openHasText":true,"closeHasText":false,"focusTags":[]}
  ]},
  "attendance": {"enrolledDays":4,"presentDays":2,"pendingDays":2,"absentDays":0},
  "challenges": {"coreTotal":3,"coreApproved":2,"finalA":"in_progress","finalB":"locked"}
}
```

`focusTags`는 사용자가 기록을 읽고 실제 행동에 대해 **직접 검토 후 부여하는 태그**다. 원본 텍스트를 자동으로 추론하지 않는다.

## 실행

사용자 입력은 git에 커밋되지 않는 `data/private/`에 보관한다.

```bash
node scripts/build-candidates.mjs data/private/candidate-input.json generated/private/candidates.json
node --test tests/generator.test.mjs
sha256sum generated/private/candidates.json
```

같은 파일로 두 번 실행하고 해시가 같은지 확인한다. 파일 모드는 0600이며 저장 위치는 `generated/private/`로 제한한다.

## 완료 전 남은 작업

- [ ] 리추얼 원본과 미확정 출석/챌린지 요약의 **로컬 전용 변환/연계**
- [ ] 승인 후보 ID와 승인 파일의 검증, 사용자 공개 승인 게이트
- [ ] 원본 변경 → 숫자 요약 및 후보 변경 시연
- [ ] 원본 없이도 설치되는 클린 환경 README·독립 테스트 패키지 ZIP
- [ ] 공개 소스 개인정보 수동/자동 검사, 사이트 배포 전 점검
