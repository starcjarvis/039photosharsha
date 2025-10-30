const upload = document.getElementById("upload");
const gallery = document.getElementById("gallery");
const clearBtn = document.getElementById("clear-gallery");

// Load images from browser storage
window.onload = () => {
  const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
  savedImages.forEach(src => addImage(src));
};

// Upload new images
upload.addEventListener("change", () => {
  const files = Array.from(upload.files);
  const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const imageSrc = e.target.result;
      addImage(imageSrc);
      savedImages.push(imageSrc);
      localStorage.setItem("galleryImages", JSON.stringify(savedImages));
    };
    reader.readAsDataURL(file);
  });
});

// Add image to gallery
function addImage(src) {
  const img = document.createElement("img");
  img.src = src;
  gallery.appendChild(img);
}

// Clear all images (admin control)
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all photos?")) {
    gallery.innerHTML = "";
    localStorage.removeItem("galleryImages");
  }
});
