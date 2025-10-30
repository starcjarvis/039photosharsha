const upload = document.getElementById("upload");
const photoSections = document.getElementById("photo-sections");

upload.addEventListener("change", () => {
  const files = Array.from(upload.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      addPhoto(e.target.result);
    };
    reader.readAsDataURL(file);
  });
});

function addPhoto(src) {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  let section = document.querySelector(`.section[data-date='${dateString}']`);

  if (!section) {
    section = document.createElement("div");
    section.classList.add("section");
    section.setAttribute("data-date", dateString);

    const title = document.createElement("h2");
    title.textContent = dateString;
    const gallery = document.createElement("div");
    gallery.classList.add("gallery");

    section.appendChild(title);
    section.appendChild(gallery);
    photoSections.prepend(section);
  }

  const img = document.createElement("img");
  img.src = src;
  section.querySelector(".gallery").prepend(img);
}
