import { ReactNode } from "react";
export default function ModalPortal({ children }: { children?: ReactNode }) {
  return children ?? null; // 실제 포털은 이후 모달 단계에서 구현
}
