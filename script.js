const upload = document.getElementById("upload");
const gallery = document.getElementById("gallery");

upload.addEventListener("change", () => {
  const files = Array.from(upload.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      gallery.prepend(img); // newest photo on top
    };
    reader.readAsDataURL(file);
  });
});
