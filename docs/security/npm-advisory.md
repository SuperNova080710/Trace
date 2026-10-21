# Trace 의존성 보안 검토

기준일: 2026-10-21  
관련 이슈: #1  
근거: 사용자 제공 `npm audit` 로그 및 [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)

## 현황

- 전체 `npm audit`: `5 high severity vulnerabilities` 보고.
- 같은 취약점이 `braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next` 경로를 따라 표시된다.
- 취약점: `braces`의 깊이 중첩된 패턴 처리 중 스택 소진 가능성.
- 사용자 로그 기준 `eslint-config-next`는 프로젝트의 `devDependencies`이므로, 이 경로는 개발/검증 도구 체인에 속한다.
- GitHub Advisory에는 조회 기준일 현재 `Patched versions: None`으로 표시된다.
- `npm audit fix --force` 제안은 `eslint-config-next@14.2.35`로 변경하며 현재 Next.js 16 설정과 호환성 위험이 있어 실행하지 않는다.

## 위험 범위

- 현재 Trace는 `output: "export"`를 사용한 정적 사이트이며, `eslint-config-next`를 사용자 브라우저에서 실행하지 않는다.
- 이 취약점의 주요 위험은 개발/CI 과정에서 악의적인 패턴 입력을 처리하는 상황이다. 외부 입력을 다루는 빌드/검증 환경을 신뢰해서는 안 된다.
- `npm audit --omit=dev`로 운영 의존성 별도 검증을 CI에 추가한다. 이 검사는 **devDependencies의 잔여 취약점을 해결하거나 면제하는 것이 아니다.**
- CI 실행 성공 여부는 실제 실행 기록에서만 통과로 판정한다.

## 후속 조치

1. `npm audit --omit=dev` 결과가 High 이상 0건인지 확인한다.
2. 정기적으로 `npm audit`와 공식 Advisory의 패치 버전 변경 여부를 확인한다.
3. 공급자 패치가 릴리스되면 최소 범위 업데이트 및 잠금 파일 재생성 후 전체 CI 검증한다.
4. 의존성이 설치된 환경에 외부 입력으로 생성된 glob 패턴을 전달하지 않으며, PR 작성/실행 권한을 제한한다.
5. 배포/제출 전에 보안 공지 상태를 다시 점검한다.

## 주의

`npm ci`, 빌드 및 테스트 통과만으로 취약점이 수정되었다고 주장하지 않는다.
