// File: app/categories/page.jsx
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Music,
  Ticket,
  Smartphone,
  Gamepad,
  Utensils,
  PenTool,
  Globe,
  HardDrive,
  Zap,
  Search,
} from "lucide-react";

export const revalidate = 3600; // Revalidate at most every hour

// Map for category icons based on slug or name
const getCategoryIcon = (slug) => {
  const iconMap = {
    tech: <Smartphone className="h-8 w-8" />,
    gadgets: <Smartphone className="h-8 w-8" />,
    games: <Gamepad className="h-8 w-8" />,
    gaming: <Gamepad className="h-8 w-8" />,
    music: <Music className="h-8 w-8" />,
    concerts: <Music className="h-8 w-8" />,
    events: <Ticket className="h-8 w-8" />,
    food: <Utensils className="h-8 w-8" />,
    dining: <Utensils className="h-8 w-8" />,
    restaurants: <Utensils className="h-8 w-8" />,
    products: <ShoppingBag className="h-8 w-8" />,
    art: <PenTool className="h-8 w-8" />,
    travel: <Globe className="h-8 w-8" />,
    software: <HardDrive className="h-8 w-8" />,
    apps: <HardDrive className="h-8 w-8" />,
    experiences: <Zap className="h-8 w-8" />,
    // Default icon if no match is found
    default: <ShoppingBag className="h-8 w-8" />,
  };

  // Try to match by slug, then check if any key is included in the slug
  if (iconMap[slug]) return iconMap[slug];

  const matchingKey = Object.keys(iconMap).find(
    (key) => slug.includes(key) || key.includes(slug)
  );

  return matchingKey ? iconMap[matchingKey] : iconMap.default;
};

// Sample categories data to use if database fetch fails
const sampleCategories = [
  {
    id: 1,
    name: "Tech Gadgets",
    slug: "tech-gadgets",
    description: "The latest tech waitlists for cutting-edge gadgets",
    listingCount: 24,
  },
  {
    id: 2,
    name: "Gaming",
    slug: "gaming",
    description: "Game consoles, beta access, and early releases",
    listingCount: 16,
  },
  {
    id: 3,
    name: "Events & Concerts",
    slug: "events-concerts",
    description: "Exclusive event tickets and early access",
    listingCount: 19,
  },
  {
    id: 4,
    name: "Limited Edition Products",
    slug: "limited-edition",
    description: "Rare drops and limited edition releases",
    listingCount: 12,
  },
  {
    id: 5,
    name: "Software & Apps",
    slug: "software-apps",
    description: "Early access to software and app betas",
    listingCount: 15,
  },
  {
    id: 6,
    name: "Dining & Restaurants",
    slug: "dining",
    description: "Reservations for exclusive restaurants",
    listingCount: 8,
  },
  {
    id: 7,
    name: "Exclusive Memberships",
    slug: "memberships",
    description: "Private clubs and membership-only services",
    listingCount: 6,
  },
  {
    id: 8,
    name: "Travel Experiences",
    slug: "travel",
    description: "Unique travel opportunities and experiences",
    listingCount: 9,
  },
];

export default async function CategoriesPage() {
  let categoriesWithCounts = [];

  try {
    const supabase = createClient();

    // Fetch all categories
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      // Fall back to sample data if there's an error
      categoriesWithCounts = sampleCategories;
    } else {
      // For each category, fetch the count of active listings
      categoriesWithCounts = await Promise.all(
        (categories || []).map(async (category) => {
          try {
            const { count, error: countError } = await supabase
              .from("waitlist_listings")
              .select("*", { count: "exact", head: true })
              .eq("category_id", category.id)
              .eq("status", "active");

            return {
              ...category,
              listingCount: countError ? 0 : count,
            };
          } catch (countingError) {
            console.error("Error counting listings:", countingError);
            return {
              ...category,
              listingCount: 0,
            };
          }
        })
      );
    }
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
    // Fall back to sample data if there's an error
    categoriesWithCounts = sampleCategories;
  }

  // Sort categories for popular section
  const popularCategories = [...categoriesWithCounts]
    .sort((a, b) => b.listingCount - a.listingCount)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore waitlist positions across different products, events, and
          experiences. Find exactly what you're looking for or discover new
          opportunities.
        </p>
      </section>

      {/* Search & Filter Section */}
      <section className="mb-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search categories..."
                className="pl-10 w-full h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Sort by Name</Button>
              <Button variant="outline">Most Popular</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesWithCounts.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col overflow-hidden group">
                <div className="p-6 flex-grow">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {getCategoryIcon(
                        category.slug || category.name.toLowerCase()
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    {category.description ||
                      `Explore waitlists for ${category.name}`}
                  </p>
                </div>
                <div className="bg-gray-50 py-3 px-6 text-center border-t">
                  <span className="text-sm font-medium text-gray-600">
                    {category.listingCount}{" "}
                    {category.listingCount === 1 ? "listing" : "listings"}{" "}
                    available
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-3">
                    {getCategoryIcon(
                      category.slug || category.name.toLowerCase()
                    )}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.listingCount}{" "}
                    {category.listingCount === 1 ? "listing" : "listings"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
        <div className="bg-gray-50 rounded-xl p-8">
          <p className="text-gray-600 mb-6">
            We're constantly expanding our marketplace to include more
            categories. Here are some upcoming additions:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Fashion Drops",
              "NFT Collections",
              "Limited Sneakers",
              "Premium Subscriptions",
            ].map((name) => (
              <div
                key={name}
                className="bg-white rounded-lg p-4 text-center border border-dashed border-gray-300"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-gray-800">{name}</h3>
                <p className="text-sm text-gray-500 mt-1">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center bg-indigo-600 rounded-2xl p-10 text-white">
        <h2 className="text-2xl font-bold mb-4">
          Don't See What You're Looking For?
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          We're always adding new categories. Let us know what specific waitlist
          you're interested in buying or selling.
        </p>
        <Button className="bg-white text-indigo-700 hover:bg-gray-100">
          Request a Category
        </Button>
      </section>
    </div>
  );
}
