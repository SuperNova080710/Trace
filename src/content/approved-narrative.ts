import type { ApprovedNarrative } from "./public-profile";

/**
 * BR-A personal narrative, explicitly approved by the author on 2026-10-21.
 * Sources used for internal factual review: T09 §1/§4/§5/§7, with T11
 * treated as fictionalized narrative reference only.
 *
 * Privacy: publish approved excerpts only, never the original manuscripts
 * or raw ritual-history logs. evidenceIds are internal pointers, not public URLs.
 * First and last sentences must remain exactly as author wrote them.
 */
export const narrative: readonly ApprovedNarrative[] = [
  {
    id: "br-a-p01",
    chapter: "opening",
    status: "approved",
    evidenceIds: ["T09:5-2","user-2026-10-21"],
    text: "모르는 문제가 생기면 제가 아는 지식 내에서 차근차근 찾아보는 사람입니다.",
  },
  {
    id: "br-a-p02",
    chapter: "difficulty",
    status: "approved",
    evidenceIds: ["T09:5-3","T09:7"],
    text: "2024년 캡스톤디자인에서 ESP32와 Unreal Engine을 연결하는 디지털 트윈 시스템을 개발했습니다. 현실에 있는 장치의 상태를 가상공간에 반영하고, 가상공간에서 실제 장치를 제어하는 것이 목표였습니다. 처음에는 기술을 하나씩 구현하면 자연스럽게 연결될 것이라고 생각했습니다. 하지만 MQTT 메시지가 늦게 전달되거나 전달되지 않았고, Unreal Engine에서 외부 데이터를 처리하는 과정과 영상 스트리밍에서도 문제가 반복되었습니다.",
  },
  {
    id: "br-a-p03",
    chapter: "difficulty",
    status: "approved",
    evidenceIds: ["T09:5-3","T09:7"],
    text: "여러 부분을 동시에 수정해 보았지만 어디에서 문제가 발생했는지 파악하기 어려웠습니다. 작업을 계속하고 있는데도 앞으로 나아가지 못한다는 느낌이 들었습니다. 그래서 해결 방법을 바꾸었습니다. 시스템을 ESP32, 네트워크, 서버, Unreal Engine으로 나누고 각 구간이 정상적으로 동작하는지 하나씩 확인했습니다. 확인할 수 있는 부분부터 검증하며 원인을 좁혀 갔고, 결국 시스템을 연결해 최종 결과물을 완성할 수 있었습니다.",
  },
  {
    id: "br-a-p04",
    chapter: "turning",
    status: "approved",
    evidenceIds: ["T09:5-3"],
    text: "이 경험을 통해 문제를 해결하는 데 중요한 것은 많은 것을 한꺼번에 시도하는 일이 아니라 현재 상태를 정확하게 이해하는 것이라는 사실을 배웠습니다. 막히는 상황에서도 조급하게 수정하기보다 문제를 나누고 다시 확인하는 태도를 갖게 되었습니다.",
  },
  {
    id: "br-a-p05",
    chapter: "turning",
    status: "approved",
    evidenceIds: ["T09:2026-09-09","T09:2026-09-17","T09:2026-09-30"],
    text: "이후에도 같은 방식을 실천하려고 노력했습니다. 2026년 9월 9일에는 몇 시간 동안 해결되지 않던 오류를 로그와 테스트로 추적해 원인을 찾아냈습니다. 9월 17일에는 코드와 구조가 복잡하게 꼬이자 이미 투자한 시간에 매달리지 않고 작업을 정리한 뒤 처음부터 다시 시작했습니다. 9월 30일에는 타입 검사에서 발생한 오류가 이전 테스트 코드의 삭제로 생긴 참조 문제임을 확인했습니다. 이러한 경험은 문제가 생겼을 때 상황을 통제할 수 있는 작은 단위부터 살펴보는 습관으로 이어졌습니다.",
  },
  {
    id: "br-a-p06",
    chapter: "growth",
    status: "approved",
    evidenceIds: ["T09:2026-09-16"],
    text: "문제를 해결하고 난 뒤에는 그 과정을 기록하려고 합니다. 9월 16일에는 프로젝트의 이슈와 시행착오를 작업 기록과 커밋 메시지로 정리했습니다. 결과만 남기면 나중에 같은 문제를 만났을 때 다시 처음부터 고민해야 하지만, 원인과 판단 과정을 남기면 다음 작업의 출발점으로 활용할 수 있기 때문입니다.",
  },
  {
    id: "br-a-p07",
    chapter: "growth",
    status: "approved",
    evidenceIds: ["T09:5-3","T09:7"],
    text: "혼자 해결하는 능력만큼 다른 사람과 작업 과정을 공유하는 일도 중요하게 생각합니다. 캡스톤디자인에서는 여러 기술이 연결되는 시스템을 팀과 함께 개발했습니다. 각 부분의 동작을 이해하고 전체 흐름을 설명하는 과정에서, 제가 확인한 내용을 다른 사람도 이해할 수 있도록 정리하는 일의 중요성을 느꼈습니다. 다만 구체적인 협업 사례는 실제 역할과 행동을 더 확인하여 보완하려고 합니다.",
  },
  {
    id: "br-a-p08",
    chapter: "growth",
    status: "approved",
    evidenceIds: ["T09:2026-10-07"],
    text: "최근에는 AI를 개발 과정에 활용하면서도 제시된 답변을 그대로 적용하지 않으려고 노력합니다. 10월 7일의 기록처럼 제 상황에 적합한 해결 방법인지 확인하고, 필요한 부분만 선택합니다. 새로운 도구가 등장하더라도 문제를 이해하고 결과를 검증하는 책임은 개발자 자신에게 있다고 생각하기 때문입니다.",
  },
  {
    id: "br-a-p09",
    chapter: "growth",
    status: "approved",
    evidenceIds: ["T09:5-3"],
    text: "아직 모든 기술에 익숙하거나 처음부터 정답을 알고 있는 개발자는 아닙니다. 하지만 해결되지 않는 문제를 만났을 때 원인을 추적하고, 필요하면 다시 시작하며, 그 과정을 다음에 활용할 수 있는 경험으로 남기려고 합니다.",
  },
  {
    id: "br-a-p10",
    chapter: "closing",
    status: "approved",
    evidenceIds: ["T09:5-2","user-2026-10-21"],
    text: "앞으로 새로운 기술과 낯선 문제를 피하기보다 구조를 이해하고, 원인을 파악하는 해결 과정을 자신의 경험이나 지식으로 쌓는 개발자가 되려고 합니다.",
  },
];
