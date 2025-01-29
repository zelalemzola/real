"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadButton } from "@/utils/uploadthing"

export default function EditProperty() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  // Log the ID from params for debugging
  console.log("Property ID from params:", id)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
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

  useEffect(() => {
    if (!id) {
      setError("No property ID provided")
      setIsLoading(false)
      return
    }
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Log the API request URL for debugging
      console.log("Fetching property from:", `/api/properties/${id}`)

      const response = await axios.get(`/api/properties/${id}`)
      console.log("API Response:", response.data)

      const property = response.data
      setFormData({
        title: property.title || "",
        price: property.price || "",
        description: property.description || "",
        propertyType: property.propertyType || "",
        finishingProgress: property.finishingProgress || "",
        bedrooms: property.bedrooms || "",
        bathrooms: property.bathrooms || "",
        location: property.location || "",
        isForSale: property.isForSale || false,
        isForRent: property.isForRent || false,
        images: property.images || [],
      })
    } catch (error) {
      console.error("Error fetching property:", error)
      const errorMessage = error.response?.data?.error || error.message || "Failed to fetch property"
      setError(errorMessage)

      if (error.response?.status === 404) {
        router.push("/admin/properties")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!id) {
        throw new Error("Property ID is missing")
      }

      // Convert numeric strings to numbers
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
      }

      const response = await axios.put(`/api/properties/${id}`, dataToSubmit)

      if (response.data) {
        router.push("/admin/properties")
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating property:", error)
      setError(error.response?.data?.error || error.message || "Failed to update property")
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

  const handleImageDelete = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToDelete),
    }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading property details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => router.push("/admin/properties")}>
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <Button variant="outline" onClick={() => router.push("/admin/properties")} disabled={isSubmitting}>
          Back to Properties
        </Button>
      </div>

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
            value={formData.propertyType}
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
            value={formData.finishingProgress}
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
          <div className="flex justify-between items-center">
            <p className="font-medium">Current Images</p>
            <p className="text-sm text-muted-foreground">Click on an image to remove it</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer transition-opacity group-hover:opacity-75"
                  onClick={() => handleImageDelete(index)}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white bg-red-500 px-2 py-1 rounded text-sm">Remove</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="font-medium mb-2">Upload New Images</p>
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
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
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

