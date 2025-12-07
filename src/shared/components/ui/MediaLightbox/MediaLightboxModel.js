export function isVideo(mediaUrl) {
  return typeof mediaUrl === 'string' && mediaUrl.endsWith('.mp4')
}
