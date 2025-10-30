
const upload = document.getElementById("upload");
const photoSections = document.getElementById("photo-sections");

upload.addEventListener("change", () => {
  const files = Array.from(upload.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "120px";
      img.style.height = "120px";
      img.style.margin = "5px";
      photoSections.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});
