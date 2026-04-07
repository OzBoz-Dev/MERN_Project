"use client";

import TimeAgo from "react-timeago";

export default function TimeAgoClient({ date }: { date: Date }) {
  return <TimeAgo date={date} />;
}
