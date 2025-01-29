"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadButton } from "@/utils/uploadthing"

export default function NewProperty() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    propertyType: "",
    finishingProgress: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
    isForSale: false,
    isForRent: false,
    images: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await axios.post("/api/properties", formData)
      if (response.data) {
        router.push("/admin/properties")
        router.refresh()
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create property")
      console.error("Error creating property:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="title" placeholder="Property Title" value={formData.title} onChange={handleChange} required />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <Textarea
          name="description"
          placeholder="Property Description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name="propertyType"
            onValueChange={(value) => setFormData((prev) => ({ ...prev, propertyType: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>

          <Select
            name="finishingProgress"
            onValueChange={(value) => setFormData((prev) => ({ ...prev, finishingProgress: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Finishing Progress" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
              <SelectItem value="Fully Finished">Fully Finished</SelectItem>
              <SelectItem value="Started">Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="bedrooms"
            type="number"
            placeholder="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
          />
          <Input
            name="bathrooms"
            type="number"
            placeholder="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
          />
          <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isForSale" checked={formData.isForSale} onChange={handleChange} />
            For Sale
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isForRent" checked={formData.isForRent} onChange={handleChange} />
            For Rent
          </label>
        </div>

        <div className="space-y-4">
          <p className="font-medium">Upload Images</p>
          <UploadButton
            endpoint="propertyImage"
            onClientUploadComplete={(res) => {
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...res.map((file) => ({ url: file.url, key: file.key }))],
              }))
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error)
              setError("Failed to upload images")
            }}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={image.url || "/placeholder.svg"}
                alt={`Property ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Property"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/properties")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

