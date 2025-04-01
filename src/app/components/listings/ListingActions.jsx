// File: app/components/listings/ListingActions.jsx
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ListingActions({ listing }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase]);

  const handlePurchase = async () => {
    if (!user) {
      router.push(`/auth/login?redirectTo=/listings/${listing.id}`);
      return;
    }

    setLoading(true);

    try {
      // In a real app, we would handle payment processing here
      // For now, just navigate to a hypothetical checkout page
      router.push(`/checkout/${listing.id}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && user.id === listing.seller_id;
  const isAuctionEnded =
    listing.is_auction && new Date(listing.auction_end_time) <= new Date();
  const isAuctionWinner =
    isAuctionEnded && user && user.id === listing.current_bidder_id;

  return (
    <div className="space-y-3">
      {isOwner ? (
        <>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              router.push(`/dashboard/listings/${listing.id}/edit`)
            }
          >
            Edit Listing
          </Button>
          <Button variant="destructive" className="w-full">
            Cancel Listing
          </Button>
        </>
      ) : listing.is_auction ? (
        isAuctionEnded ? (
          isAuctionWinner ? (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Processing..." : "Complete Purchase"}
            </Button>
          ) : (
            <Button disabled className="w-full">
              Auction Ended
            </Button>
          )
        ) : (
          <Button disabled className="w-full">
            Place a bid below
          </Button>
        )
      ) : (
        <Button onClick={handlePurchase} disabled={loading} className="w-full">
          {loading ? "Processing..." : "Buy Now"}
        </Button>
      )}
    </div>
  );
}
