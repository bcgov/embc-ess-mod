/**
 * @returns fileId padded with 0's
 */
export const padFileIdForSearch = (fileId: string): string => {
  if (!fileId || fileId.startsWith('T')) return fileId;
  return ('00000' + fileId).slice(-6);
};
