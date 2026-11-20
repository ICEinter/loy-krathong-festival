/**
 * Image Compressor Utility
 * Automatically resizes and compresses an image data URL or File to not exceed maxSizeInKB (default 500KB)
 */
export async function compressImageToMaxKB(imageSource, maxSizeInKB = 500) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // 1. Calculate optimal dimensions (max 900x900 maintains crisp selfie quality)
      const maxDim = 900;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Iteratively reduce quality until file size is under maxSizeInKB
      let quality = 0.85;
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      const maxSizeBytes = maxSizeInKB * 1024;

      // Approximate size in bytes of base64 data URL
      const getByteSize = (dataUrl) => {
        const base64Str = dataUrl.split(',')[1] || '';
        return Math.round((base64Str.length * 3) / 4);
      };

      let currentSize = getByteSize(compressedDataUrl);

      while (currentSize > maxSizeBytes && quality > 0.15) {
        quality -= 0.1;
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        currentSize = getByteSize(compressedDataUrl);
      }

      console.log(`[Image Compressor] Output Size: ${(currentSize / 1024).toFixed(1)} KB (Max: ${maxSizeInKB} KB, Quality: ${quality.toFixed(2)})`);
      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      console.error("Image compression error:", err);
      reject(err);
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof File || imageSource instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    } else {
      reject(new Error("Invalid image source"));
    }
  });
}

