import { useState } from "react";
import type { DocumentActionComponent } from "sanity";

// Preserve Sanity's native validation, permissions and publish operation.
export function reviewedPublish(useOriginal: DocumentActionComponent): DocumentActionComponent {
  function ReviewedPublish(props: Parameters<DocumentActionComponent>[0]) {
    const original = useOriginal(props);
    const [confirming, setConfirming] = useState(false);
    if (!original) return null;
    return {
      ...original,
      disabled: original.disabled || props.draft?.publicApproved !== true,
      onHandle: () => setConfirming(true),
      dialog: confirming ? {
        type: "confirm" as const,
        message: "Publish public information only? Confirm no owner contacts, full address, house or unit numbers, exact floor, private notes or identifying photos. / 确认文字和照片均可公开，不含业主联系方式、完整地址、门牌、单位号码、具体楼层、内部备注或可识别具体单位的照片？",
        onCancel: () => setConfirming(false),
        onConfirm: () => { setConfirming(false); original.onHandle?.(); },
      } : original.dialog,
    };
  }
  return ReviewedPublish;
}
