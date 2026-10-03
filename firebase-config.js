// ============================================
// RAYIS BOZORI — Firebase + Cloudinary
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX_jMlvSTo64seJr1nuAZQdN95_fHI1RI",
  authDomain: "rayis-bozori.firebaseapp.com",
  projectId: "rayis-bozori",
  storageBucket: "rayis-bozori.firebasestorage.app",
  messagingSenderId: "2519056122",
  appId: "1:2519056122:web:ceca980c17a349df0b9343"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ============================================
// CLOUDINARY SOZLAMALARI
// ============================================
const CLOUD_NAME = "dvtsxbye";
const UPLOAD_PRESET = "rayis_bozori_uploads";

// ============================================
// Rasm yuklash — Cloudinary'ga
// ============================================
export async function uploadImage(file, folder = 'products') {
  try {
    const compressed = await compressImage(file, 1200, 0.8);
    const blob = await fetch(compressed).then(r => r.blob());

    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Cloudinary yuklashda xatolik');

    const data = await response.json();

    return {
      success: true,
      url: data.secure_url,
      path: data.public_id
    };
  } catch (error) {
    console.error('Rasm yuklash xatolik:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Rasm o'chirish (Cloudinary)
// ============================================
export async function deleteImage(publicId) {
  console.warn('O\'chirish uchun Cloudinary dashboard ishlatiladi');
  return { success: true, message: 'Cloudinary dashboard orqali o\'chiriladi' };
}

// ============================================
// Rasm siqish (canvas orqali)
// ============================================
function compressImage(file, maxW = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxW) { h = (maxW / w) * h; w = maxW; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch(err) { reject(err); }
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}