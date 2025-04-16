// File: app/listings/page.jsx
import Link from "next/link";
import Image from "next/image";
import {
  Filter,
  Search,
  SlidersHorizontal,
  Check,
  ArrowUpDown,
  Clock,
  Clock3,
  Tag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock categories for filtering
const mockCategories = [
  { id: 1, name: "Tech Gadgets", slug: "tech-gadgets" },
  { id: 2, name: "Gaming", slug: "gaming" },
  { id: 3, name: "Events & Concerts", slug: "events-concerts" },
  { id: 4, name: "Limited Edition Products", slug: "limited-edition" },
  { id: 5, name: "Software & Apps", slug: "software-apps" },
  { id: 6, name: "Dining & Restaurants", slug: "dining" },
];

// Mock listings data
const mockListings = [
  {
    id: 1,
    title: "Rabbit R1 Waitlist Position #156",
    description:
      "Early access to the Rabbit R1 AI assistant. Current estimated delivery: 2 months from now.",
    price: 245,
    is_auction: false,
    company_or_event: "Rabbit Inc.",
    position_number: 156,
    estimated_access_date: "2025-06-15",
    primary_image: "/images/rabbit-r1.jpg", // This would be a URL to your image
    category_id: 1,
    category: { name: "Tech Gadgets", slug: "tech-gadgets" },
    seller: { username: "TechEarly", reputation: 4.8 },
    created_at: "2025-03-30T12:00:00Z",
    status: "active",
    verification_method: "screenshot",
    views_count: 56,
  },
  {
    id: 2,
    title: "PlayStation 6 Pre-Order Spot #78",
    description:
      "Guaranteed day-one delivery for the upcoming PS6 launch. One of the first 100 pre-orders.",
    minimum_bid: 300,
    current_bid: 450,
    is_auction: true,
    auction_end_time: "2025-04-25T23:59:59Z",
    company_or_event: "Sony PlayStation",
    position_number: 78,
    estimated_access_date: "2025-11-20",
    primary_image: "/images/ps6-placeholder.jpg",
    category_id: 2,
    category: { name: "Gaming", slug: "gaming" },
    seller: { username: "GamerPro99", reputation: 4.9 },
    created_at: "2025-04-01T10:30:00Z",
    status: "active",
    verification_method: "screenshot",
    views_count: 124,
  },
  {
    id: 3,
    title: "Taylor Swift Eras Tour 2025 - Front Row Waitlist",
    description:
      "Chance to purchase front row tickets for the upcoming Taylor Swift Eras Tour 2025.",
    price: 800,
    is_auction: false,
    company_or_event: "Live Nation",
    position_number: 12,
    estimated_access_date: "2025-05-01",
    primary_image: "/images/concert-ticket.jpg",
    category_id: 3,
    category: { name: "Events & Concerts", slug: "events-concerts" },
    seller: { username: "MusicFan22", reputation: 4.7 },
    created_at: "2025-03-28T14:15:00Z",
    status: "active",
    verification_method: "invite_code",
    views_count: 210,
  },
  {
    id: 4,
    title: "Nothing Phone (2) Limited Edition - Position #23",
    description:
      "Early access to purchase the new limited glow-in-the-dark Nothing Phone (2) Special Edition.",
    minimum_bid: 150,
    current_bid: 280,
    is_auction: true,
    auction_end_time: "2025-04-20T23:59:59Z",
    company_or_event: "Nothing Technology",
    position_number: 23,
    estimated_access_date: "2025-05-30",
    primary_image: "/images/nothing-phone.jpg",
    category_id: 1,
    category: { name: "Tech Gadgets", slug: "tech-gadgets" },
    seller: { username: "TechCollector", reputation: 4.6 },
    created_at: "2025-04-05T09:45:00Z",
    status: "active",
    verification_method: "email_transfer",
    views_count: 98,
  },
  {
    id: 5,
    title: "Noma Copenhagen Reservation - Party of 4",
    description:
      "Reservation for 4 people at Noma restaurant in Copenhagen. One of the world's best restaurants with a 6-month waiting list.",
    price: 500,
    is_auction: false,
    company_or_event: "Noma Restaurant",
    position_number: null,
    estimated_access_date: "2025-07-15",
    primary_image: "/images/restaurant-table.jpg",
    category_id: 6,
    category: { name: "Dining & Restaurants", slug: "dining" },
    seller: { username: "FoodieExplorer", reputation: 5.0 },
    created_at: "2025-04-08T11:20:00Z",
    status: "active",
    verification_method: "screenshot",
    views_count: 76,
  },
  {
    id: 6,
    title: "Apple Vision Pro 2 - Waitlist Position #45",
    description:
      "Early access to purchase the upcoming Apple Vision Pro 2 with improved specs and lighter design.",
    minimum_bid: 400,
    current_bid: 680,
    is_auction: true,
    auction_end_time: "2025-04-30T23:59:59Z",
    company_or_event: "Apple",
    position_number: 45,
    estimated_access_date: "2025-06-01",
    primary_image: "/images/vision-pro.jpg",
    category_id: 1,
    category: { name: "Tech Gadgets", slug: "tech-gadgets" },
    seller: { username: "AppleFanatic", reputation: 4.9 },
    created_at: "2025-04-10T13:15:00Z",
    status: "active",
    verification_method: "screenshot",
    views_count: 183,
  },
  {
    id: 7,
    title: "Starfield 2 Beta Access - Early Tester",
    description:
      "Guaranteed spot in the first wave of Starfield 2 beta testers. Experience the game months before public release.",
    price: 190,
    is_auction: false,
    company_or_event: "Bethesda",
    position_number: 68,
    estimated_access_date: "2025-05-20",
    primary_image: "/images/game-beta.jpg",
    category_id: 2,
    category: { name: "Gaming", slug: "gaming" },
    seller: { username: "RPGMaster", reputation: 4.7 },
    created_at: "2025-04-07T16:40:00Z",
    status: "active",
    verification_method: "invite_code",
    views_count: 112,
  },
  {
    id: 8,
    title: "OpenAI Claude API Early Access - Position #18",
    description:
      "Early access to the upcoming Claude API with groundbreaking new features. Get ahead of the competition.",
    minimum_bid: 500,
    current_bid: 950,
    is_auction: true,
    auction_end_time: "2025-04-22T23:59:59Z",
    company_or_event: "OpenAI",
    position_number: 18,
    estimated_access_date: "2025-05-01",
    primary_image: "/images/ai-api.jpg",
    category_id: 5,
    category: { name: "Software & Apps", slug: "software-apps" },
    seller: { username: "AIEnthusiast", reputation: 4.8 },
    created_at: "2025-04-11T08:30:00Z",
    status: "active",
    verification_method: "email_transfer",
    views_count: 201,
  },
  {
    id: 9,
    title: "Nike x Travis Scott Limited Edition - #42 in Line",
    description:
      "Pre-order access to the highly anticipated Nike x Travis Scott collaboration. Limited edition of only 1000 pairs worldwide.",
    price: 350,
    is_auction: false,
    company_or_event: "Nike",
    position_number: 42,
    estimated_access_date: "2025-06-10",
    primary_image: "/images/limited-shoes.jpg",
    category_id: 4,
    category: { name: "Limited Edition Products", slug: "limited-edition" },
    seller: { username: "SneakerCollector", reputation: 4.9 },
    created_at: "2025-04-09T10:20:00Z",
    status: "active",
    verification_method: "screenshot",
    views_count: 156,
  },
  {
    id: 10,
    title: "Adele World Tour 2025 - VIP Package Waitlist",
    description:
      "Position to purchase VIP package for Adele's upcoming world tour with backstage access and meet-and-greet.",
    minimum_bid: 600,
    current_bid: 1250,
    is_auction: true,
    auction_end_time: "2025-04-28T23:59:59Z",
    company_or_event: "Live Nation",
    position_number: 8,
    estimated_access_date: "2025-07-01",
    primary_image: "/images/concert-vip.jpg",
    category_id: 3,
    category: { name: "Events & Concerts", slug: "events-concerts" },
    seller: { username: "MusicVIP", reputation: 5.0 },
    created_at: "2025-04-12T14:50:00Z",
    status: "active",
    verification_method: "invite_code",
    views_count: 228,
  },
  {
    id: 11,
    title: "Tesla Cybertruck Plaid - Reservation #157",
    description:
      "Reservation for the Tesla Cybertruck Plaid edition with priority production slot.",
    price: 1200,
    is_auction: false,
    company_or_event: "Tesla",
    position_number: 157,
    estimated_access_date: "2025-08-15",
    primary_image: "/images/cybertruck.jpg",
    category_id: 1,
    category: { name: "Tech Gadgets", slug: "tech-gadgets" },
    seller: { username: "ElectricFuture", reputation: 4.7 },
    created_at: "2025-04-02T15:30:00Z",
    status: "active",
    verification_method: "email_transfer",
    views_count: 176,
  },
  {
    id: 12,
    title: "Soho House New York - Membership Sponsor",
    description:
      "Skip the 2-year Soho House membership waitlist with a guaranteed sponsorship from a current member.",
    minimum_bid: 800,
    current_bid: 1550,
    is_auction: true,
    auction_end_time: "2025-05-10T23:59:59Z",
    company_or_event: "Soho House",
    position_number: null,
    estimated_access_date: "2025-06-01",
    primary_image: "/images/exclusive-club.jpg",
    category_id: 4,
    category: { name: "Limited Edition Products", slug: "limited-edition" },
    seller: { username: "SocialElite", reputation: 4.8 },
    created_at: "2025-04-14T09:15:00Z",
    status: "active",
    verification_method: "invite_code",
    views_count: 143,
  },
];

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Helper function to calculate time remaining
const getTimeRemaining = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const timeRemaining = end - now;

  if (timeRemaining <= 0) return "Auction ended";

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) return `${days}d ${hours}h left`;

  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m left`;

  return `${minutes}m left`;
};

// Helper function for default image
const getImagePlaceholder = (category) => {
  const placeholders = {
    "Tech Gadgets":
      "https://placehold.co/400x300/e2e8f0/475569?text=Tech+Gadget",
    Gaming: "https://placehold.co/400x300/e2e8f0/475569?text=Gaming",
    "Events & Concerts":
      "https://placehold.co/400x300/e2e8f0/475569?text=Event+Ticket",
    "Limited Edition Products":
      "https://placehold.co/400x300/e2e8f0/475569?text=Limited+Edition",
    "Software & Apps":
      "https://placehold.co/400x300/e2e8f0/475569?text=Software",
    "Dining & Restaurants":
      "https://placehold.co/400x300/e2e8f0/475569?text=Dining",
    default: "https://placehold.co/400x300/e2e8f0/475569?text=Waitlist",
  };

  return placeholders[category] || placeholders.default;
};

export default function ListingsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Browse Waitlist Spots</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Find and purchase positions in exclusive waitlists for products,
          events, and experiences.
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4 mb-6 lg:mb-0">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-gray-500"
              >
                Clear All
              </Button>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Listing Type</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="fixed-price"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="fixed-price"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Fixed Price
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="auction"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="auction"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Auction
                  </label>
                </div>
              </div>
            </div>

            {/* Categories Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {mockCategories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      defaultChecked
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min-price" className="sr-only">
                    Minimum Price
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    placeholder="Min"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="sr-only">
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    placeholder="Max"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Access Date */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Estimated Access</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="access-30"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="access-30"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Within 30 days
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="access-90"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="access-90"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Within 90 days
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="access-any"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="access-any"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Any time
                  </label>
                </div>
              </div>
            </div>

            {/* Verification Method */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Verification Method</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="method-screenshot"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="method-screenshot"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Screenshot
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="method-invite"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="method-invite"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Invite Code
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="method-email"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="method-email"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Email Transfer
                  </label>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          {/* Sort & Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <SlidersHorizontal className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium">Sort by:</span>
              <select className="ml-2 text-sm rounded-md border-gray-300 py-1.5 focus:border-indigo-500 focus:ring-indigo-500">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Ending Soon</option>
                <option>Most Popular</option>
              </select>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search listings..."
                className="pl-10 w-full md:w-64 h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Listings Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing <span className="font-medium">{mockListings.length}</span>{" "}
            listings
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockListings.map((listing) => (
              <Link
                href={`/listings/${listing.id}`}
                key={listing.id}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden border border-gray-100">
                  <div className="relative h-48 bg-gray-100">
                    <div className="w-full h-full">
                      <div className="relative w-full h-full">
                        <img
                          src={getImagePlaceholder(listing.category.name)}
                          alt={listing.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    {listing.is_auction && (
                      <Badge
                        variant="default"
                        className="absolute top-2 right-2 bg-blue-600"
                      >
                        Auction
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="outline" className="bg-white/80">
                        <Clock3 className="h-3 w-3 mr-1" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                        {listing.title}
                      </h3>
                      {listing.verification_method && (
                        <Badge
                          variant="outline"
                          className="text-xs ml-1 whitespace-nowrap"
                        >
                          {listing.verification_method === "screenshot" &&
                            "Screenshot"}
                          {listing.verification_method === "invite_code" &&
                            "Invite Code"}
                          {listing.verification_method === "email_transfer" &&
                            "Email Transfer"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.company_or_event}
                    </p>

                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{listing.category.name}</span>
                    </div>

                    {listing.position_number && (
                      <div className="mt-1 text-sm text-gray-700">
                        Position: #{listing.position_number}
                      </div>
                    )}

                    {listing.estimated_access_date && (
                      <div className="mt-1 text-sm text-gray-700 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Est. Access:{" "}
                        {new Date(
                          listing.estimated_access_date
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
                    <div>
                      {listing.is_auction ? (
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatPrice(
                              listing.current_bid || listing.minimum_bid
                            )}
                          </p>
                          <p className="text-xs text-gray-500">Current bid</p>
                        </div>
                      ) : (
                        <p className="font-medium text-gray-900">
                          {formatPrice(listing.price)}
                        </p>
                      )}
                    </div>

                    {listing.is_auction && listing.auction_end_time && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-800 border-amber-200"
                      >
                        {getTimeRemaining(listing.auction_end_time)}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results State (hidden by default) */}
          <div className="hidden text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any listings matching your criteria. Try
              adjusting your filters or search terms.
            </p>
            <Button variant="outline">Clear All Filters</Button>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.77 10l4 3.71a.75.75 0 11-1.02 1.1l-4.5-4.18a.75.75 0 010-1.1l4.5-4.18a.75.75 0 011.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      aria-current="page"
                      className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    >
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                    <a
                      href="#"
                      className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    >
                      8
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      9
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      10
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </nav>
          </div>

          {/* Newsletter Sign-Up */}
          <div className="mt-16 bg-indigo-50 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Get notified about new listings
                </h3>
                <p className="text-gray-600 mt-1">
                  Sign up to receive alerts when new waitlist spots matching
                  your criteria become available.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
                  />
                  <Button>Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
