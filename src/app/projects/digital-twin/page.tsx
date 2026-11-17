import type { Metadata } from "next";
import Link from "next/link";
import "./project.css";

export const metadata: Metadata = {
  title: "디지털 트윈 기반 스마트 캠퍼스 | TRACE",
  description: "ESP32, MQTT, 서버, Unreal Engine을 연결해 실제 장치와 가상 캠퍼스를 양방향으로 연동한 프로젝트.",
};

const flows = [
  {
    name: "상태 반영",
    stages: [
      { title: "실제 장치", description: "ESP32가 장치 상태를 보냅니다." },
      { title: "통신·서버", description: "MQTT로 상태 메시지를 전달합니다." },
      { title: "가상 캠퍼스", description: "Unreal Engine이 상태를 화면에 반영합니다." },
    ],
  },
  {
    name: "장치 제어",
    stages: [
      { title: "가상 캠퍼스", description: "Unreal Engine에서 제어 명령을 보냅니다." },
      { title: "통신·서버", description: "MQTT로 제어 명령을 전달합니다." },
      { title: "실제 장치", description: "ESP32가 명령에 따라 장치를 제어합니다." },
    ],
  },
];

export default function DigitalTwinProject() {
  return (
    <main className="twin-project">
      <Link className="twin-back" href="/#approach">← 프로젝트 목록</Link>
      <header className="twin-intro">
        <h1>디지털 트윈 기반 스마트 캠퍼스</h1>
        <p>실제 IoT 장치의 상태를 가상 캠퍼스에 반영하고, 가상 캠퍼스에서 실제 장치를 제어하는 시스템입니다.</p>
        <p><strong>본인 역할</strong> 3D 모델링을 제외한 시스템 전반을 직접 구현했습니다. ESP32 장치, MQTT 통신, 서버, Unreal Engine을 연결해 양방향 연동을 완성했습니다.</p>
      </header>

      <section className="twin-section" aria-labelledby="twin-diagram-title">
        <h2 id="twin-diagram-title">시스템 구성도</h2>
        <figure className="twin-diagram">
          {flows.map(({ name, stages }) => (
            <div key={name} className="twin-flow">
              <h3>{name}</h3>
              <ol aria-label={name}>
                {stages.map(({ title, description }, index) => (
                  <li key={title}>
                    {index > 0 && <span className="twin-arrow" aria-hidden="true">→</span>}
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <figcaption>위쪽은 실제 장치의 상태가 화면에 반영되는 흐름이고, 아래쪽은 가상 공간의 명령이 실제 장치에 전달되는 흐름입니다.</figcaption>
        </figure>
      </section>

      <section className="twin-section" aria-labelledby="twin-debugging-title">
        <h2 id="twin-debugging-title">MQTT 메시지 지연을 구간별로 추적</h2>
        <p>MQTT 메시지가 늦게 도착하거나 전달되지 않고, Unreal Engine에서 외부 데이터를 처리하는 과정에서도 오류가 반복됐습니다. 여러 부분을 동시에 수정하면 어느 변경이 영향을 줬는지 파악하기 어려웠습니다.</p>
        <p>ESP32, 네트워크, 서버, Unreal Engine으로 흐름을 나누고 각 구간이 정상적으로 동작하는지 차례대로 확인했습니다. 확인한 구간을 기준으로 원인을 좁혀 실제 장치와 가상 캠퍼스의 연결을 완성했습니다.</p>
      </section>

      <section className="twin-section" aria-labelledby="twin-publication-title">
        <h2 id="twin-publication-title">시연과 논문 게재</h2>
        <p>2024년 캡스톤에서 개발을 시작했고, 팀은 장치 상태 반영과 원격 제어를 시연했습니다. 같은 프로젝트를 논문경진대회로 이어갔으며, 2025년 디지털콘텐츠학회논문지(KCI 등재)에 게재했습니다.</p>
        <p>「디지털 트윈 및 메타버스 융합형 스마트 캠퍼스 설계 및 구현」<br />디지털콘텐츠학회논문지, 26권 12호, 3391–3397쪽</p>
        <a href="https://doi.org/10.9728/dcs.2025.26.12.3391">게재 논문 보기 <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
