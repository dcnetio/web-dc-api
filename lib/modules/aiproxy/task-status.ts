export type AITaskStatusState = "pending" | "success" | "failed" | "unknown";

export const getAITaskStatusState = (origin: any): AITaskStatusState => {
  if (!origin || typeof origin !== "object") return "unknown";

  const statusFinishedRe = /(?:success|succeeded|finished|completed|done)/i;
  const statusFailedRe = /(?:failed|failure|error|fail|canceled|cancelled|timeout|unknown)/i;
  const statusPendingRe = /(?:pending|queued|processing|running|in_progress|submitted)/i;
  const readStatus = (value: any): string => {
    if (!value || typeof value !== "object") return "";
    return String(
      value.status ?? value.state ?? value.task_status ?? value.job_status ?? "",
    ).trim();
  };
  const statuses = Array.isArray(origin.items) && origin.items.length > 0
    ? origin.items.map(readStatus).filter(Boolean)
    : [readStatus(origin), readStatus(origin.output), readStatus(origin.data), readStatus(origin.result)].filter(Boolean);
  if (statuses.some((status: string) => statusPendingRe.test(status))) return "pending";
  if (statuses.some((status: string) => statusFailedRe.test(status))) return "failed";
  if (statuses.length > 0 && statuses.every((status: string) => statusFinishedRe.test(status))) return "success";
  return "unknown";
};
