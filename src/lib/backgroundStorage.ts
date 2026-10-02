import { File, Paths } from 'expo-file-system';

/**
 * Uploaded backgrounds are copied into the app's documents folder so they survive the
 * picker's temp files being cleaned up. We store only the file NAME, because the full
 * path of the app folder can change when iOS updates the app.
 */
export function backgroundUriFor(fileName: string): string {
  return new File(Paths.document, fileName).uri;
}

/** Copies a picked image into the app and returns the saved file name. */
export function saveBackground(pickedUri: string): string {
  const fileName = `background-${Date.now()}.jpg`;
  new File(pickedUri).copy(new File(Paths.document, fileName));
  return fileName;
}

export function deleteBackground(fileName: string | null): void {
  if (!fileName) return;
  try {
    const f = new File(Paths.document, fileName);
    if (f.exists) f.delete();
  } catch { /* already gone */ }
}
