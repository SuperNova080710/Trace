import type { ComponentPropsWithoutRef } from "react";

export function RouteLink(props: ComponentPropsWithoutRef<"a">) {
  // Native navigation lets the browser run a cross-document view transition.
  return <a {...props} />;
}
