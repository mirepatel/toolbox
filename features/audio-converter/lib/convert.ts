import { Mp3Encoder } from "@breezystack/lamejs";

export type Mp3Bitrate = 128 | 192 | 320;

// MP3 frames encode 1152 samples at a time — this is lamejs's expected chunk size.
const SAMPLE_BLOCK_SIZE = 1152;

function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const sample = Math.max(-1, Math.min(1, input[i] ?? 0));
    output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
}

/** Concatenates Uint8Array chunks into one concrete ArrayBuffer for Blob construction. */
function concatChunks(chunks: Uint8Array[]): ArrayBuffer {
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const buffer = new ArrayBuffer(totalLength);
  const view = new Uint8Array(buffer);
  let offset = 0;
  for (const chunk of chunks) {
    view.set(chunk, offset);
    offset += chunk.length;
  }
  return buffer;
}

/** Decodes an audio file (WAV, and most formats the browser can decode) and re-encodes it as MP3. */
export async function convertToMp3(file: File, bitrate: Mp3Bitrate = 192): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();

  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch {
    await audioContext.close();
    throw new Error("Couldn't read that file — make sure it's a valid WAV file.");
  }

  const channels = Math.min(audioBuffer.numberOfChannels, 2) as 1 | 2;
  const left = floatTo16BitPCM(audioBuffer.getChannelData(0));
  const right = channels === 2 ? floatTo16BitPCM(audioBuffer.getChannelData(1)) : null;

  const encoder = new Mp3Encoder(channels, audioBuffer.sampleRate, bitrate);
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < left.length; i += SAMPLE_BLOCK_SIZE) {
    const leftChunk = left.subarray(i, i + SAMPLE_BLOCK_SIZE);
    const mp3buf = right
      ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + SAMPLE_BLOCK_SIZE))
      : encoder.encodeBuffer(leftChunk);
    if (mp3buf.length > 0) chunks.push(mp3buf);
  }
  const finalChunk = encoder.flush();
  if (finalChunk.length > 0) chunks.push(finalChunk);

  await audioContext.close();

  return new Blob([concatChunks(chunks)], { type: "audio/mp3" });
}
