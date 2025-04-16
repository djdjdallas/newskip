// File: app/page.jsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ListingCard from "./components/listings/ListingCard";
import { Button } from "@/components/ui/button";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = "https://fflbuhhkupsrrrvdczwf.supabase.co";

export const revalidate = 3600; // Revalidate at most every hour

export default async function HomePage() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Fetch featured listings
  const { data: featuredListings } = await supabase
    .from("waitlist_listings")
    .select(
      `
      *,
      profiles:seller_id(username),
      categories:category_id(name)
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);

  // For each listing, fetch the primary image
  for (const listing of featuredListings || []) {
    const { data: images } = await supabase
      .from("listing_images")
      .select("url")
      .eq("listing_id", listing.id)
      .eq("is_primary", true)
      .limit(1);

    listing.primary_image = images?.[0]?.url || null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl mb-12 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Skip the Line. Trade Waitlist Spots.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Buy and sell positions in exclusive waitlists for hyped drops,
            events, and tech products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings">
              <Button className="bg-white text-indigo-700 hover:bg-gray-100 text-lg py-6 px-8">
                Browse Waitlists
              </Button>
            </Link>
            <Link href="/create-listing">
              <Button
                variant="outline"
                className="border-white text-black hover:bg-indigo-700 text-lg py-6 px-8"
              >
                Sell Your Spot
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Categories</h2>
          <Link
            href="/categories"
            className="text-indigo-600 hover:text-indigo-700"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-indigo-600 mb-2">
                {/* You can add an icon here */}
                <span className="text-2xl">{category.icon || "📋"}</span>
              </div>
              <h3 className="font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Waitlists</h2>
          <Link
            href="/listings"
            className="text-indigo-600 hover:text-indigo-700"
          >
            View all listings
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">List Your Spot</h3>
            <p className="text-gray-600">
              Create a listing with details about your waitlist position and set
              your price or open it to bidding.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Transaction</h3>
            <p className="text-gray-600">
              When a buyer is found, our secure escrow system holds funds while
              the transfer is verified.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Complete Transfer</h3>
            <p className="text-gray-600">
              Follow the guided transfer process, buyer confirms receipt, and
              funds are released to you.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gray-900 text-white rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Skip the Wait?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of users buying and selling waitlist positions on
          SkipFurther.
        </p>
        <Link href="/auth/signup">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-lg py-6 px-8">
            Get Started Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
