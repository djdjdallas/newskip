// File: app/listings/[id]/page.jsx
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import BidForm from "@/components/listings/BidForm"; // We'll need to create this component
import ListingActions from "@/components/listings/ListingActions"; // We'll need to create this component
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const revalidate = 60; // Revalidate at most every minute

export default async function ListingDetailPage({ params }) {
  const supabase = createClient();

  // Fetch listing
  const { data: listing, error } = await supabase
    .from("waitlist_listings")
    .select(
      `
      *,
      seller:profiles!waitlist_listings_seller_id_fkey(id, username, avatar_url, reputation),
      category:categories!waitlist_listings_category_id_fkey(id, name, slug)
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !listing) {
    notFound();
  }

  // Fetch listing images
  const { data: images } = await supabase
    .from("listing_images")
    .select("*")
    .eq("listing_id", listing.id)
    .order("is_primary", { ascending: false });

  // Fetch bids if it's an auction
  let bids = [];
  if (listing.is_auction) {
    const { data: bidsData } = await supabase
      .from("bids")
      .select(
        `
        *,
        bidder:profiles!bids_bidder_id_fkey(id, username, avatar_url)
      `
      )
      .eq("listing_id", listing.id)
      .order("amount", { ascending: false })
      .limit(10);

    bids = bidsData || [];
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate time remaining if it's an auction
  const getTimeRemaining = () => {
    if (!listing.is_auction || !listing.auction_end_time) return null;

    const now = new Date();
    const endTime = new Date(listing.auction_end_time);
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) return "Auction ended";

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${days}d ${hours}h ${minutes}m`;
  };

  // Update view count (in a real app, you'd want to do this with a Supabase function)
  await supabase
    .from("waitlist_listings")
    .update({ views_count: (listing.views_count || 0) + 1 })
    .eq("id", listing.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden mb-6">
            <div className="relative h-96 bg-gray-100">
              {images && images.length > 0 ? (
                <Image
                  src={images[0].url}
                  alt={listing.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                  <span>No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {images && images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mb-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative h-20 bg-gray-100 rounded"
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{listing.description}</p>

              {listing.tags && listing.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Purchase/Bid Info */}
        <div>
          <Card className="mb-6">
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
                      <Badge variant="warning">{getTimeRemaining()}</Badge>
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

              <div className="mb-6">
                <ListingActions listing={listing} />
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200">
                  {listing.seller.avatar_url ? (
                    <Image
                      src={listing.seller.avatar_url}
                      alt={listing.seller.username || "Seller"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-indigo-100 text-indigo-600 font-bold">
                      {listing.seller.username
                        ? listing.seller.username[0].toUpperCase()
                        : "S"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {listing.seller.username || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Reputation: {listing.seller.reputation || 0}
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-yellow-50 p-4 mb-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  Verification Method
                </h4>
                <p className="text-sm text-yellow-700">
                  {listing.verification_method === "screenshot" &&
                    "Screenshot verification"}
                  {listing.verification_method === "invite_code" &&
                    "Invite code transfer"}
                  {listing.verification_method === "email_transfer" &&
                    "Email account transfer"}
                </p>
              </div>

              <Button variant="outline" className="w-full">
                Contact Seller
              </Button>
            </CardContent>
          </Card>

          {/* Bid Form for Auctions */}
          {listing.is_auction &&
            new Date(listing.auction_end_time) > new Date() && (
              <Card>
                <CardHeader>
                  <CardTitle>Place a Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  <BidForm listing={listing} />
                </CardContent>
              </Card>
            )}

          {/* Recent Bids */}
          {listing.is_auction && bids.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Bids</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-200 mr-2">
                          {bid.bidder.avatar_url ? (
                            <Image
                              src={bid.bidder.avatar_url}
                              alt={bid.bidder.username || "Bidder"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-indigo-100 text-indigo-600 font-bold text-xs">
                              {bid.bidder.username
                                ? bid.bidder.username[0].toUpperCase()
                                : "B"}
                            </div>
                          )}
                        </div>
                        <span className="text-sm">
                          {bid.bidder.username || "Anonymous"}
                        </span>
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
