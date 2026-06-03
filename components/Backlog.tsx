"use client";

import { useCallback, useState } from "react";
import { OPTIONS, type SubmissionPayload } from "@/lib/options";
import { buildSelection, type Pick } from "@/lib/selection";
import OptionsGrid from "./OptionsGrid";
import FinalQuestion, { type SubmitStatus } from "./FinalQuestion";
import SuccessScreen from "./SuccessScreen";

export default function Backlog() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [picks, setPicks] = useState<Record<string, Pick>>({});
  const [customText, setCustomText] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [success, setSuccess] = useState(false);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const pickChange = useCallback((id: string, next: Pick) => {
    setPicks((prev) => ({ ...prev, [id]: next }));
  }, []);

  const onYes = useCallback(async () => {
    setStatus("loading");

    const selections = OPTIONS.filter((o) => selectedIds.has(o.id)).map((o) =>
      buildSelection(o, picks[o.id] ?? {})
    );

    const payload: SubmissionPayload = {
      selections,
      customText: customText.trim() || undefined,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setSuccess(true);
    } catch {
      setStatus("error");
    }
  }, [selectedIds, picks, customText]);

  if (success) return <SuccessScreen />;

  return (
    <>
      <OptionsGrid
        selectedIds={selectedIds}
        picks={picks}
        customText={customText}
        onToggle={toggle}
        onPickChange={pickChange}
        onCustomTextChange={setCustomText}
      />
      <FinalQuestion status={status} onYes={onYes} />
    </>
  );
}
