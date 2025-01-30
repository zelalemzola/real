import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Property from "@/models/Property"

export async function GET(request) {
  await dbConnect()
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page")) || 1
  const limit = Number.parseInt(searchParams.get("limit")) || 10
  const skip = (page - 1) * limit

  const filters = {}
  for (const [key, value] of searchParams.entries()) {
    if (["propertyType", "finishingProgress", "location"].includes(key) && value) {
      filters[key] = value
    }
    if (["isForSale", "isForRent"].includes(key)) {
      filters[key] = value === "true"
    }
    if (["minPrice", "maxPrice"].includes(key) && value) {
      filters.price = filters.price || {}
      if (key === "minPrice") filters.price.$gte = Number.parseInt(value)
      if (key === "maxPrice") filters.price.$lte = Number.parseInt(value)
    }
    if (key === "title" && value) {
      filters.title = { $regex: value, $options: "i" }
    }
  }

  const properties = await Property.find(filters).skip(skip).limit(limit)
  const total = await Property.countDocuments(filters)

  return NextResponse.json({ properties, total, page, limit })
}

export async function POST(request) {
  await dbConnect()
  const data = await request.json()
  const property = await Property.create(data)
  return NextResponse.json(property)
}

