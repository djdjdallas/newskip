// File: app/components/listings/BidForm.jsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BidForm({ listing }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate minimum allowed bid
  const minBid = (listing.current_bid || listing.minimum_bid) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to place a bid");

      // Check if user is the seller
      if (user.id === listing.seller_id) {
        throw new Error("You cannot bid on your own listing");
      }

      // Validate bid amount
      const bidAmount = parseFloat(amount);
      if (isNaN(bidAmount) || bidAmount < minBid) {
        throw new Error(`Bid must be at least ${formatPrice(minBid)}`);
      }

      // Check if auction is still active
      const now = new Date();
      const endTime = new Date(listing.auction_end_time);
      if (now > endTime) {
        throw new Error("This auction has ended");
      }

      // Place bid
      const { error: bidError } = await supabase.from("bids").insert({
        listing_id: listing.id,
        bidder_id: user.id,
        amount: bidAmount,
      });

      if (bidError) throw bidError;

      // Update current bid on listing
      const { error: updateError } = await supabase
        .from("waitlist_listings")
        .update({
          current_bid: bidAmount,
          current_bidder_id: user.id,
        })
        .eq("id", listing.id);

      if (updateError) throw updateError;

      // Reset form and refresh
      setAmount("");
      router.refresh();
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Your Bid ({formatPrice(minBid)} minimum)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={minBid}
            step="0.01"
            required
            placeholder={minBid.toString()}
            className="pl-7"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Placing Bid..." : "Place Bid"}
      </Button>
    </form>
  );
}
