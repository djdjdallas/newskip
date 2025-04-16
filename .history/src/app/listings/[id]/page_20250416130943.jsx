// File: app/listings/[id]/page.jsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  Tag,
  Star,
  MapPin,
  User,
  Calendar,
  ShoppingCart,
  Shield,
  ChevronLeft,
  Heart,
  Share2,
  Eye,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Mock listings data (same as on the listings page)
const mockListings = [
  {
    id: "1",
    title: "Rabbit R1 Waitlist Position #156",
    description:
      "Early access to the Rabbit R1 AI assistant. Current estimated delivery: 2 months from now.\n\nI signed up on the first day and managed to get a pretty good position in the queue. The Rabbit R1 is one of the most anticipated AI devices of the year, and this position will let you get it much sooner than ordering now (current wait is 5+ months).\n\nThis waitlist position is transferable via email, and I'll provide proof of position via screenshots of the confirmation email and account page.",
    price: 245,
    is_auction: false,
    company_or_event: "Rabbit Inc.",
    position_number: 156,
    estimated_access_date: "2025-06-15",
    primary_image: "https://placehold.co/800x600/e2e8f0/475569?text=Rabbit+R1",
    images: [
      "https://placehold.co/800x600/e2e8f0/475569?text=Rabbit+R1",
      "https://placehold.co/800x600/e2e8f0/475569?text=Waitlist+Position",
      "https://placehold.co/800x600/e2e8f0/475569?text=Email+Confirmation",
    ],
    category_id: 1,
    category: { name: "Tech Gadgets", slug: "tech-gadgets" },
    seller: {
      id: "user123",
      username: "TechEarly",
      reputation: 4.8,
      avatar_url: "https://placehold.co/100x100/6366f1/ffffff?text=TE",
      joined_date: "2023-11-15",
      listings_count: 12,
      successful_transfers: 9,
    },
    created_at: "2025-03-30T12:00:00Z",
    status: "active",
    verification_method: "screenshot",
    views_count: 56,
    tags: ["tech", "AI", "gadgets", "early access", "Rabbit R1"],
    cancellation_policy:
      "Full refund within 24 hours of purchase if transfer cannot be completed.",
    faqs: [
      {
        question: "How will the transfer be done?",
        answer:
          "I'll update the email address associated with the account to your email. You'll receive a confirmation email, and then you'll be able to set your own password.",
      },
      {
        question: "How soon will I get access after purchase?",
        answer:
          "Transfer will be completed within 24 hours of purchase confirmation.",
      },
      {
        question: "Is the position transferable according to Rabbit's terms?",
        answer:
          "Yes, Rabbit allows transferring waitlist positions by changing the email address on the account.",
      },
    ],
  },
  {
    id: "2",
    title: "PlayStation 6 Pre-Order Spot #78",
    description:
      "Guaranteed day-one delivery for the upcoming PS6 launch. One of the first 100 pre-orders.\n\nThis pre-order position will guarantee you receive the PS6 on launch day, which is expected to sell out immediately and have waiting lists of 3-6 months.\n\nAs one of the first 100 pre-orders, you'll also receive exclusive digital content and possibly a special edition colorway (based on past PlayStation launches).",
    minimum_bid: 300,
    current_bid: 450,
    is_auction: true,
    auction_end_time: "2025-04-25T23:59:59Z",
    company_or_event: "Sony PlayStation",
    position_number: 78,
    estimated_access_date: "2025-11-20",
    primary_image:
      "https://placehold.co/800x600/e2e8f0/475569?text=PlayStation+6",
    images: [
      "https://placehold.co/800x600/e2e8f0/475569?text=PlayStation+6",
      "https://placehold.co/800x600/e2e8f0/475569?text=Pre-Order+Confirmation",
      "https://placehold.co/800x600/e2e8f0/475569?text=Position+Number",
    ],
    category_id: 2,
    category: { name: "Gaming", slug: "gaming" },
    seller: {
      id: "user456",
      username: "GamerPro99",
      reputation: 4.9,
      avatar_url: "https://placehold.co/100x100/6366f1/ffffff?text=GP",
      joined_date: "2024-01-10",
      listings_count: 8,
      successful_transfers: 6,
    },
    created_at: "2025-04-01T10:30:00Z",
    status: "active",
    verification_method: "screenshot",
    views_count: 124,
    tags: ["gaming", "playstation", "ps6", "console", "pre-order"],
    bids: [
      {
        id: "bid1",
        amount: 450,
        bidder: {
          username: "ConsoleFanatic",
          avatar_url: "https://placehold.co/100x100/6366f1/ffffff?text=CF",
        },
        created_at: "2025-04-15T14:23:45Z",
      },
      {
        id: "bid2",
        amount: 425,
        bidder: {
          username: "GameCollector",
          avatar_url: "https://placehold.co/100x100/6366f1/ffffff?text=GC",
        },
        created_at: "2025-04-14T11:15:32Z",
      },
      {
        id: "bid3",
        amount: 400,
        bidder: {
          username: "NextGenGamer",
          avatar_url: "https://placehold.co/100x100/6366f1/ffffff?text=NG",
        },
        created_at: "2025-04-12T19:45:21Z",
      },
      {
        id: "bid4",
        amount: 350,
        bidder: {
          username: "PlayStationFan",
          avatar_url: "https://placehold.co/100x100/6366f1/ffffff?text=PF",
        },
        created_at: "2025-04-10T08:30:15Z",
      },
      {
        id: "bid5",
        amount: 325,
        bidder: {
          username: "EarlyAdopter",
          avatar_url: "https://placehold.co/100x100/6366f1/ffffff?text=EA",
        },
        created_at: "2025-04-08T22:10:05Z",
      },
    ],
    cancellation_policy:
      "No refunds once the auction is completed. Transfer must be completed within 48 hours.",
    faqs: [
      {
        question: "How is the position number verified?",
        answer:
          "I'll provide screenshots of my order confirmation showing the timestamp and position in queue. Sony provides this information in their pre-order portal.",
      },
      {
        question: "What happens if Sony cancels or delays the launch?",
        answer:
          "The pre-order position remains valid for whenever the console launches. If Sony cancels the PS6 altogether (extremely unlikely), a full refund will be provided.",
      },
      {
        question: "Will I get all pre-order bonuses?",
        answer:
          "Yes, all pre-order bonuses associated with this position will transfer to you, including digital content and any special editions.",
      },
    ],
  },
  // Additional mock listings would go here
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
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// React server component
export default function ListingDetailPage({ params }) {
  // In a real app, this would fetch from your database
  const listing = mockListings.find((l) => l.id === params.id);

  // If listing not found, show 404
  if (!listing) {
    notFound();
  }

  // Determine if auction has ended
  const isAuctionEnded =
    listing.is_auction && new Date(listing.auction_end_time) <= new Date();

  // Check if there are bids for auction
  const hasBids = listing.is_auction && listing.bids && listing.bids.length > 0;

  // Get the current highest bid/bidder if it's an auction
  const highestBid = hasBids ? listing.bids[0] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-500">
          <Link
            href="/listings"
            className="hover:text-indigo-600 flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Listings
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/categories/${listing.category.slug}`}
            className="hover:text-indigo-600"
          >
            {listing.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{listing.title}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden mb-6 shadow-sm">
            <div className="relative h-96 bg-gray-100">
              {listing.primary_image ? (
                <div className="relative w-full h-full">
                  <img
                    src={listing.primary_image}
                    alt={listing.title}
                    className="object-contain w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                  <span>No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {listing.images && listing.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mb-6">
              {listing.images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-20 bg-gray-100 rounded cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover rounded w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tabs for Listing Info */}
          <Tabs defaultValue="description" className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent
              value="description"
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{listing.description}</p>
              </div>

              {listing.tags && listing.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  <h4 className="text-sm text-gray-500 mr-2">Tags:</h4>
                  {listing.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Details Tab */}
            <TabsContent
              value="details"
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Listing Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-500">Company/Event</h4>
                  <p className="font-medium">{listing.company_or_event}</p>
                </div>

                {listing.position_number && (
                  <div>
                    <h4 className="text-sm text-gray-500">Position</h4>
                    <p className="font-medium">#{listing.position_number}</p>
                  </div>
                )}

                {listing.estimated_access_date && (
                  <div>
                    <h4 className="text-sm text-gray-500">Estimated Access</h4>
                    <p className="font-medium">
                      {new Date(
                        listing.estimated_access_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm text-gray-500">Category</h4>
                  <p className="font-medium">{listing.category.name}</p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">Listed</h4>
                  <p className="font-medium">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">Views</h4>
                  <p className="font-medium">{listing.views_count || 0}</p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">Verification Method</h4>
                  <p className="font-medium capitalize">
                    {listing.verification_method?.replace("_", " ")}
                  </p>
                </div>

                {listing.cancellation_policy && (
                  <div className="col-span-2">
                    <h4 className="text-sm text-gray-500">
                      Cancellation Policy
                    </h4>
                    <p className="font-medium">{listing.cancellation_policy}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent
              value="faqs"
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold mb-4">
                Frequently Asked Questions
              </h3>

              {listing.faqs && listing.faqs.length > 0 ? (
                <div className="space-y-4">
                  {listing.faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {faq.question}
                      </h4>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No FAQs available for this listing.
                </p>
              )}

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Have a question?</h4>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Similar Listings */}
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Similar Listings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockListings
                .filter(
                  (l) =>
                    l.id !== listing.id && l.category_id === listing.category_id
                )
                .slice(0, 2)
                .map((similar) => (
                  <Link key={similar.id} href={`/listings/${similar.id}`}>
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex overflow-hidden h-32">
                      <div className="w-1/3 bg-gray-100 relative">
                        <img
                          src={similar.primary_image}
                          alt={similar.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="w-2/3 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2">
                            {similar.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {similar.company_or_event}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-900">
                            {similar.is_auction
                              ? formatPrice(
                                  similar.current_bid || similar.minimum_bid
                                )
                              : formatPrice(similar.price)}
                          </p>
                          {similar.is_auction && (
                            <Badge variant="outline" className="text-xs">
                              Auction
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Purchase/Bid Info */}
        <div>
          <Card className="mb-6 sticky top-24">
            <CardHeader>
              <CardTitle>{listing.title}</CardTitle>
              <CardDescription>
                {listing.is_auction ? "Auction" : "Fixed Price"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {listing.is_auction ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Current Bid:</span>
                      <span className="text-2xl font-bold">
                        {formatPrice(
                          listing.current_bid || listing.minimum_bid
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500">Time Remaining:</span>
                      <Badge
                        variant={isAuctionEnded ? "secondary" : "outline"}
                        className="bg-amber-50 text-amber-800 border-amber-200"
                      >
                        {getTimeRemaining(listing.auction_end_time)}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Starting Bid:</span>
                      <span>{formatPrice(listing.minimum_bid)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Auction Ends:</span>
                      <span>
                        {new Date(listing.auction_end_time).toLocaleString()}
                      </span>
                    </div>

                    {/* Bid Form (simplified) */}
                    {!isAuctionEnded && (
                      <div className="mt-6 space-y-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="number"
                            min={
                              (listing.current_bid || listing.minimum_bid) + 1
                            }
                            step="1"
                            placeholder="Enter bid amount"
                            className="pl-8 w-full h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <Button className="w-full">Place Bid</Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Price:</span>
                    <span className="text-2xl font-bold">
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {listing.is_auction ? (
                  isAuctionEnded ? (
                    highestBid && (
                      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-yellow-800">
                          This auction has ended. The winner should complete the
                          purchase.
                        </p>
                      </div>
                    )
                  ) : null
                ) : (
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  <Button variant="outline">
                    <Heart className="mr-2 h-4 w-4" />
                    Watchlist
                  </Button>
                </div>

                <div className="text-center mt-2">
                  <Button variant="link" className="text-sm text-gray-500">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share listing
                  </Button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="border-t mt-6 pt-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-500">
                    Payment is held in escrow until the waitlist position
                    transfer is verified and complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">About the Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  {listing.seller.avatar_url ? (
                    <img
                      src={listing.seller.avatar_url}
                      alt={listing.seller.username}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {listing.seller.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{listing.seller.username}</h3>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{listing.seller.reputation}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {listing.seller.successful_transfers || 0} successful
                      transfers
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Member since{" "}
                    {new Date(listing.seller.joined_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>{listing.seller.listings_count || 0} listings</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                View Seller Profile
              </Button>
            </CardContent>
          </Card>

          {/* Recent Bids for Auctions */}
          {listing.is_auction && listing.bids && listing.bids.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Bids</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {listing.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-200 mr-2">
                          {bid.bidder.avatar_url ? (
                            <img
                              src={bid.bidder.avatar_url}
                              alt={bid.bidder.username}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-indigo-100 text-indigo-600 font-bold text-xs">
                              {bid.bidder.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="text-sm">{bid.bidder.username}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(bid.amount)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(bid.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
