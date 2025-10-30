import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://cksuswghafnksktbkbvg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3Vzd2doYWZua3NrdGJrYnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzU4NjAsImV4cCI6MjA3NzMxMTg2MH0.xvlF24-bse44uqnc35ew4KMqw_qIZYcIedT6zIhQXCM";
const supabase = createClient(supabaseUrl, supabaseKey);

const gallery = document.getElementById('gallery');
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');

async function loadGallery() {
  gallery.innerHTML = '';
  const { data, error } = await supabase.storage.from('photos').list('', { limit: 100 });
  if (error) {
    console.error(error);
    return;
  }

  for (const file of data.reverse()) {
    const { data: urlData } = await supabase.storage.from('photos').getPublicUrl(file.name);
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('photo');
    photoDiv.innerHTML = `
      <img src="${urlData.publicUrl}" alt="${file.name}">
      <button class="delete-btn" onclick="deletePhoto('${file.name}')">🗑</button>
    `;
    gallery.appendChild(photoDiv);
  }
}

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return alert("Select a file first!");

  const { error } = await supabase.storage.from('photos').upload(file.name, file);
  if (error) {
    alert("Error uploading file: " + error.message);
  } else {
    fileInput.value = '';
    loadGallery();
  }
});

window.deletePhoto = async (filename) => {
  const pass = prompt("Enter admin password to delete:");
  if (pass !== "039admin") return alert("Wrong password!");

  const { error } = await supabase.storage.from('photos').remove([filename]);
  if (error) {
    alert("Error deleting: " + error.message);
  } else {
    loadGallery();
  }
};

loadGallery();
