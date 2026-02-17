export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function timeAgo(utcDateString: string): string {
  // Parse as UTC by appending 'Z'
  const date = new Date(utcDateString.replace(" ", "T") + "Z");

  // now is always UTC internally — no timezone needed here
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  if (seconds < 5) return "just now";

  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
  }

  return "just now";
}

export function previewText(str: string, max = 250) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export const sleep = async (ms = 0) =>
  new Promise((res) => setTimeout(res, ms));

const AVATAR_COLORS: string[] = [
  "#F87171", // red-400
  "#FBBF24", // amber-400
  "#34D399", // emerald-400
  "#60A5FA", // blue-400
  "#A78BFA", // violet-400
  "#FB923C", // orange-400
  "#F472B6", // pink-400
  "#22D3EE", // cyan-400
  "#84CC16", // lime-500
  "#F97316", // orange-500
];

export function getAvatarColor(id: number): string {
  const index = Math.abs(id) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
