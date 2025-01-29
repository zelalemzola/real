import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Property from "@/lib/models/Property"

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const skip = (page - 1) * limit

    const filters = {}

    if (searchParams.get("propertyType")) {
      filters.propertyType = searchParams.get("propertyType")
    }
    if (searchParams.get("minPrice")) {
      filters.price = { $gte: Number.parseInt(searchParams.get("minPrice")) }
    }
    if (searchParams.get("maxPrice")) {
      filters.price = { ...filters.price, $lte: Number.parseInt(searchParams.get("maxPrice")) }
    }
    if (searchParams.get("location")) {
      filters.location = { $regex: searchParams.get("location"), $options: "i" }
    }

    const properties = await Property.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 })

    const total = await Property.countDocuments(filters)

    return NextResponse.json({
      properties,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error in GET /api/properties:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const property = await Property.create(body)
    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/properties:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

