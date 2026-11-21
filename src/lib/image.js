export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('Unable to read image file'))
    reader.readAsDataURL(file)
  })
}

export function compressImage(dataUrl, maxDimension = 1100, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
      const width = Math.max(1, Math.round(image.width * scale))
      const height = Math.max(1, Math.round(image.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvas is unavailable'))
        return
      }

      ctx.drawImage(image, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    image.onerror = () => reject(new Error('Unable to decode image'))
    image.src = dataUrl
  })
}

export async function fileToPreview(file, maxDimension = 1100) {
  const raw = await readFileAsDataURL(file)
  return compressImage(raw, maxDimension, 0.78)
}

export function formatCoordinate(value, positive, negative) {
  return `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`
}
