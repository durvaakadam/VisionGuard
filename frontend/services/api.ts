export async function predictImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to predict image");
  }

  return res.json();
}
