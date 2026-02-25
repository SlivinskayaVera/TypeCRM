// TODO: типы и проверки ⚠️

// Нет проверки типа файла
export function isImageFile(file: any) {
  return file?.type?.startsWith('image/');
}

// Нет проверки размера
export function isFileTooBig(file: any, maxSize: any) {
  return file?.size > maxSize;
}

// Создаёт dataURL, но может упасть
export function readFileAsDataURL(file: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Нет обработки ошибок
export function formatFileSize(bytes: any) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}
