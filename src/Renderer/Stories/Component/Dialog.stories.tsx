import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Dialog, DialogHost } from "../../Component/Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Component/Dialog",
  component: Dialog,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function PreviewSurface({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#0b1020] p-6 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold text-white">Underlying view</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            DialogHost keeps this view mounted and draws the dialog layer above it.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {["Library", "Terminal", "Preferences"].map((label) => (
            <div key={label} className="h-32 rounded-lg border border-white/10 bg-[#0f172a]" />
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

export const Alarm: Story = {
  render: () => (
    <DialogHost
      dialog={
        <Dialog
          open
          title="작업이 완료되었습니다"
          description="Wine 설치 작업이 끝났습니다. 바로 다음 단계로 이동할 수 있습니다."
          tone="success"
          icon={Bell}
          actions={[
            { label: "닫기", onClick: () => undefined },
            { label: "확인", icon: Check, variant: "primary", onClick: () => undefined, autoFocus: true },
          ]}
        />
      }
    >
      <PreviewSurface />
    </DialogHost>
  ),
};

export const Warning: Story = {
  render: () => (
    <DialogHost
      dialog={
        <Dialog
          open
          title="업데이트 확인 실패"
          description="업데이트 서버에 연결할 수 없습니다. 네트워크 상태를 확인한 뒤 다시 시도하세요."
          tone="warning"
          actions={[
            { label: "나중에", onClick: () => undefined },
            { label: "다시 시도", variant: "primary", onClick: () => undefined },
          ]}
        />
      }
    >
      <PreviewSurface />
    </DialogHost>
  ),
};

export const DangerConfirm: Story = {
  render: () => (
    <DialogHost
      dialog={
        <Dialog
          open
          title="로그를 삭제할까요?"
          description="현재 세션의 로그 파일이 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
          tone="danger"
          placement="center"
          actions={[
            { label: "취소", onClick: () => undefined },
            { label: "삭제", icon: Trash2, variant: "danger", onClick: () => undefined, autoFocus: true },
          ]}
        />
      }
    >
      <PreviewSurface />
    </DialogHost>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <DialogHost
      dialog={
        <Dialog
          open
          title="다운로드 알림"
          description="백그라운드 작업 상태입니다."
          tone="info"
          actions={[{ label: "확인", variant: "primary", onClick: () => undefined }]}
        >
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>BDIH Launcher update</span>
              <span>72%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-sky-400" />
            </div>
          </div>
        </Dialog>
      }
    >
      <PreviewSurface />
    </DialogHost>
  ),
};
