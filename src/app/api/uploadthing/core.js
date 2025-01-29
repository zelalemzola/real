import { createUploadthing } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  propertyImage: f({
    image: {
      maxFileSize: "14MB",
      maxFileCount: 10,
    },
  })
    .middleware(() => {
      return { timestamp: Date.now() }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, key: file.key }
    }),
}

export const { uploadRouter } = ourFileRouter

