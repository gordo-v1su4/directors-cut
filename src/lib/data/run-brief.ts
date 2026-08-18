/** Split a canonical comparison-run `question` into display sections. */
export function parseRunQuestion(question: string): {
  creativeBrief: string;
  deliveryNotes: string;
  workflowNotes: string;
} {
  const text = question.trim();
  if (!text) {
    return { creativeBrief: '', deliveryNotes: '', workflowNotes: '' };
  }

  const creativeMatch = text.match(/CREATIVE BRIEF\s*\n([\s\S]*?)(?:\n\s*\nDELIVERY|\nDELIVERY|$)/i);
  const deliveryMatch = text.match(/DELIVERY\s*\n([\s\S]*?)(?:\n\s*\nRAYCAST WORKFLOW|\nRAYCAST WORKFLOW|$)/i);
  const workflowMatch = text.match(/RAYCAST WORKFLOW\s*\n([\s\S]*?)$/i);

  let creativeBrief = creativeMatch?.[1]?.trim() ?? '';
  if (!creativeBrief) {
    // Fallback: strip known headers and use the substantive paragraph(s).
    creativeBrief = text
      .replace(/^PROJECT TITLE[\s\S]*?CREATIVE BRIEF\s*/i, '')
      .replace(/\nDELIVERY[\s\S]*$/i, '')
      .trim();
  }

  // Drop the boilerplate first line if the real idea follows on the next paragraph.
  const lines = creativeBrief.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1 && /^develop two independent premium/i.test(lines[0])) {
    creativeBrief = lines.slice(1).join('\n\n');
  }

  return {
    creativeBrief,
    deliveryNotes: deliveryMatch?.[1]?.trim() ?? '',
    workflowNotes: workflowMatch?.[1]?.trim() ?? '',
  };
}
