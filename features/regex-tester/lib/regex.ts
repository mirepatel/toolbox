export interface RegexMatch {
  text: string;
  index: number;
}

export interface RegexSegment {
  text: string;
  isMatch: boolean;
}

export interface RegexTestResult {
  matches: RegexMatch[];
  segments: RegexSegment[];
  error: string | null;
}

const MAX_MATCHES = 1000; // guards against pathological patterns locking up the tab

export function testRegex(pattern: string, flags: string, testText: string): RegexTestResult {
  if (!pattern) {
    return { matches: [], segments: [{ text: testText, isMatch: false }], error: null };
  }

  try {
    const globalFlags = flags.includes("g") ? flags : flags + "g";
    const regex = new RegExp(pattern, globalFlags);
    const matches: RegexMatch[] = [];
    const segments: RegexSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let guard = 0;

    while ((match = regex.exec(testText)) !== null && guard < MAX_MATCHES) {
      guard++;
      matches.push({ text: match[0], index: match.index });
      if (match.index > lastIndex) {
        segments.push({ text: testText.slice(lastIndex, match.index), isMatch: false });
      }
      segments.push({ text: match[0] || " ", isMatch: true });
      lastIndex = match.index + Math.max(match[0].length, 1);
      if (match[0].length === 0) regex.lastIndex++;
    }
    if (lastIndex < testText.length) {
      segments.push({ text: testText.slice(lastIndex), isMatch: false });
    }

    return {
      matches,
      segments: segments.length ? segments : [{ text: testText, isMatch: false }],
      error: null,
    };
  } catch (e) {
    return {
      matches: [],
      segments: [{ text: testText, isMatch: false }],
      error: e instanceof Error ? e.message : "Invalid regular expression",
    };
  }
}