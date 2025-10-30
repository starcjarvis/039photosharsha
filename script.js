import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔹 Replace with your real project URL and anon key from Supabase → Settings → API
const supabaseUrl = "https://cksuswghafnksktbkbvg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3Vzd2doYWZua3NrdGJrYnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzU4NjAsImV4cCI6MjA3NzMxMTg2MH0.xvlF24-bse44uqnc35ew4KMqw_qIZYcIedT6zIhQXCM";

// 🔹 Connect to Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

const gallery = document.getElementById('gallery');
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');

// 🔹 Load all photos from bucket
async function loadGallery() {
  gallery.innerHTML = "<p>Loading photos...</p>";

  const { data: files, error } = await supabase.storage.from('photos').list('', { limit: 100 });
  if (error) {
    console.error("Error loading photos:", error);
    gallery.innerHTML = "<p>Error loading photos.</p>";
    return;
  }

  if (!files || files.length === 0) {
    gallery.innerHTML = "<p>No photos yet. Upload some!</p>";
    return;
  }

  gallery.innerHTML = '';

  for (const file of files.reverse()) {
    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(file.name);
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo';
    photoDiv.innerHTML = `
      <img src="${urlData.publicUrl}" alt="${file.name}">
      <button class="delete-btn" onclick="deletePhoto('${file.name}')">🗑</button>
    `;
    gallery.appendChild(photoDiv);
  }
}

// 🔹 Upload photo to Supabase
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return alert("Please select a photo first!");

  const { error } = await supabase.storage.from('photos').upload(file.name, file, {
    cacheControl: '3600',
    upsert: false
  });

  if (error) {
    alert("Upload failed: " + error.message);
  } else {
    alert("Uploaded successfully!");
    fileInput.value = '';
    loadGallery();
  }
});

// 🔹 Delete photo (admin only)
window.deletePhoto = async (filename) => {
  const pass = prompt("Enter admin password to delete:");
  if (pass !== "039admin") return alert("Wrong password!");

  const { error } = await supabase.storage.from('photos').remove([filename]);
  if (error) {
    alert("Error deleting photo: " + error.message);
  } else {
    alert("Photo deleted!");
    loadGallery();
  }
};

// 🔹 Load gallery on page load
loadGallery();
