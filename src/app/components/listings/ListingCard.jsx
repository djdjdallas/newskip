// File: app/components/listings/ListingCard.jsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ListingCard({ listing }) {
  // Format the price
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

    if (days > 0) return `${days}d ${hours}h left`;

    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    if (hours > 0) return `${hours}h ${minutes}m left`;

    return `${minutes}m left`;
  };

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
        <div className="relative h-48 bg-gray-100">
          {listing.primary_image ? (
            <Image
              src={listing.primary_image}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
              <span>No image</span>
            </div>
          )}
          {listing.is_auction && (
            <Badge variant="default" className="absolute top-2 right-2">
              Auction
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 truncate">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {listing.company_or_event}
          </p>

          {listing.position_number && (
            <p className="text-sm text-gray-700 mt-2">
              Position: #{listing.position_number}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            {listing.is_auction ? (
              <div>
                <p className="font-medium text-gray-900">
                  {formatPrice(listing.current_bid || listing.minimum_bid)}
                </p>
                <p className="text-xs text-gray-500">Current bid</p>
              </div>
            ) : (
              <p className="font-medium text-gray-900">
                {formatPrice(listing.price)}
              </p>
            )}
          </div>

          {listing.is_auction && (
            <Badge variant="warning">{getTimeRemaining()}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
