export const uploadFile = async (
  file: File,
  url: string,
  callback?: () => void
): Promise<void> => {
  const buffer = await file.arrayBuffer()
  return fetch(url, {
    method: 'PUT',
    body: buffer,
  }).then(callback)
}
