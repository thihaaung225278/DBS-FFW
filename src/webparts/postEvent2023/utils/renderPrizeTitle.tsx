import * as React from 'react';

/** Bundled post-event.json prize strings may include `<sup>` only — no raw HTML inject. */
export function renderPrizeTitle(prize: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const pattern = /<sup>(.*?)<\/sup>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(prize)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(prize.slice(lastIndex, match.index));
    }

    nodes.push(<sup key={`sup-${key++}`}>{match[1]}</sup>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < prize.length) {
    nodes.push(prize.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : prize;
}
