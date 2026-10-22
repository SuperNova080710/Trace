# Issue #8 — 비공개 최종 제출 패키지 절차

지원 서류 3종은 **내용 검토 완료** 상태이지만 공개 사이트 다운로드는 승인되지 않았습니다. 이 패키지는 로컬에서만 만들고 개인 자료를 공개 저장소에 추가하지 않습니다.

## 입력

- 서류 3종의 DOCX/PDF 총 6개: 기존 검토 완료 판본 `Trace_BR-A_*_ROLES_VERIFIED`
- Issue #7의 합성 입력 기반 재현 ZIP: `generated/private/issue7-reproduction.zip`
- 최종 출력: `generated/private/Trace_BR-A_Private_Submission.zip` (`.gitignore` 적용)

## 사용

서류 폴더는 사용자가 **로컬 기기로 안전하게 내려받아 준비**해야 합니다. 개인 자료가 없는 CI는 서류 패키지를 만들지 않습니다.

```bash
cd ~/ALEPH/Trace
python3 scripts/package-generator.py
python3 scripts/verify-reproduction.py generated/private/issue7-reproduction.zip
python3 scripts/package-private-submission.py \
  --documents /home/sgp/Downloads/Trace_Issue6_roles_clarified
unzip -t generated/private/Trace_BR-A_Private_Submission.zip
sha256sum generated/private/Trace_BR-A_Private_Submission.zip
```

사용자 환경의 실제 서류 위치를 `--documents`에 지정하십시오. 이 경로는 예시일 뿐 실제 폴더 존재를 확인한 것이 아닙니다.

`package-private-submission.py`는 필수 여섯 문서 존재, DOCX 내부 패키지 및 PDF 시그니처, 장치 ZIP 전체 SHA-256 목록, 최종 압축 무결성을 점검합니다. 인쇄 레이아웃이나 PDF 내 모든 링크, 문서 내 민감정보를 자동 검증하는 것은 아닙니다.

**중요:** 문서·PDF 내용에 포함된 실명/동료 실명·전화·이메일·메타데이터는 수동 확인이 여전히 필요합니다. 최종 ZIP은 일반 ZIP이며 암호화되지 않았습니다. 비공개 보관하고, 공개 GitHub·`public/`·Vercel에 업로드하지 마십시오.

## 남은 절차

- [ ] 사용자 로컬 제출 ZIP 생성·무결성 확인
- [ ] 문서별 비공개 정보·메타데이터 최종 수동 확인
- [ ] 공개 지표/지원 문서 여부 결정 (현재 둘 다 비공개)
- [ ] 과제 제출 정책과 URL/ZIP 등록 위치 사용자 확인
- [ ] 사용자 최종 제출 승인
