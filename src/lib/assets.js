/* التقاط الصور واللوجو تلقائيًا من مجلد src/assets بأي امتداد (png/jpg/webp/svg…) */

const images = import.meta.glob(
  "../assets/images/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP}",
  { eager: true, query: "?url", import: "default" }
);

const logos = import.meta.glob("../assets/logo.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const baseName = (path) =>
  path
    .split("/")
    .pop()
    .replace(/\.[^.]+$/, "")
    .toLowerCase();

const byName = {};
for (const [path, url] of Object.entries(images)) byName[baseName(path)] = url;

/** يرجّع رابط الصورة من اسمها (من غير امتداد) أو null لو مش موجودة */
export const resolveImage = (name) =>
  byName[String(name || "").replace(/\.[^.]+$/, "").toLowerCase()] || null;

/** رابط اللوجو لو موجود في src/assets */
export const logoUrl = Object.values(logos)[0] || null;
