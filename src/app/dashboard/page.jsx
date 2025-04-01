"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  Clock,
  Heart,
  Settings,
  User,
  ListChecks,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    activeListings: 0,
    activeBids: 0,
    completedTransactions: 0,
    watchlistItems: 0,
  });
  const [recentListings, setRecentListings] = useState([]);
  const [recentBids, setRecentBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          router.push("/auth/login");
          return;
        }

        setUser(user);

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profileError) {
          setProfile(profile);
        }

        // Get active listings count
        const { count: activeListingsCount } = await supabase
          .from("waitlist_listings")
          .select("*", { count: "exact", head: true })
          .eq("seller_id", user.id)
          .eq("status", "active");

        // Get active bids count
        const { count: activeBidsCount } = await supabase
          .from("bids")
          .select("*", { count: "exact", head: true })
          .eq("bidder_id", user.id)
          .eq("status", "active");

        // Get completed transactions count
        const { count: completedTransactionsCount } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .eq("status", "completed");

        // Get watchlist count
        const { count: watchlistCount } = await supabase
          .from("watchlist")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setStats({
          activeListings: activeListingsCount || 0,
          activeBids: activeBidsCount || 0,
          completedTransactions: completedTransactionsCount || 0,
          watchlistItems: watchlistCount || 0,
        });

        // Get recent listings
        const { data: recentListingsData } = await supabase
          .from("waitlist_listings")
          .select(
            `
            id,
            title,
            company_or_event,
            price,
            current_bid,
            is_auction,
            created_at,
            status
          `
          )
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (recentListingsData) {
          setRecentListings(recentListingsData);
        }

        // Get recent bids
        const { data: recentBidsData } = await supabase
          .from("bids")
          .select(
            `
            id,
            amount,
            created_at,
            status,
            listing:waitlist_listings(
              id,
              title,
              company_or_event
            )
          `
          )
          .eq("bidder_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (recentBidsData) {
          setRecentBids(recentBidsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase, router]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.username || user?.email}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/create-listing">
            <Button>Create New Listing</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 bg-indigo-100 p-2 rounded-full">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Listings
              </p>
              <h3 className="text-2xl font-bold">{stats.activeListings}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 bg-green-100 p-2 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Bids
              </p>
              <h3 className="text-2xl font-bold">{stats.activeBids}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 bg-blue-100 p-2 rounded-full">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Transactions
              </p>
              <h3 className="text-2xl font-bold">
                {stats.completedTransactions}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 bg-red-100 p-2 rounded-full">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Watchlist
              </p>
              <h3 className="text-2xl font-bold">{stats.watchlistItems}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/listings" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex items-start flex-row space-x-4 pb-2">
              <Package className="h-6 w-6 text-indigo-600" />
              <div>
                <CardTitle>My Listings</CardTitle>
                <CardDescription>
                  Manage your waitlist spots for sale
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View, edit, and manage all the waitlist spots you have listed
                for sale.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/bids" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex items-start flex-row space-x-4 pb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle>My Bids</CardTitle>
                <CardDescription>
                  Track your active bids on auctions
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor and manage your bids on waitlist spots being auctioned.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/transactions" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex items-start flex-row space-x-4 pb-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Your purchase and sale history
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View the history of your completed and pending transactions.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/watchlist" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex items-start flex-row space-x-4 pb-2">
              <Heart className="h-6 w-6 text-red-600" />
              <div>
                <CardTitle>Watchlist</CardTitle>
                <CardDescription>
                  Waitlist spots you're interested in
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track waitlist spots you've saved to watch for later.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/profile" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex items-start flex-row space-x-4 pb-2">
              <User className="h-6 w-6 text-orange-600" />
              <div>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your public profile</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your profile information, photo, and reputation settings.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex items-start flex-row space-x-4 pb-2">
              <Settings className="h-6 w-6 text-slate-600" />
              <div>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your password, notification preferences, and payment
                methods.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
            <CardDescription>
              Your most recently created listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentListings.length > 0 ? (
              <div className="space-y-4">
                {recentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <Link href={`/listings/${listing.id}`}>
                        <p className="font-medium text-indigo-600 hover:underline">
                          {listing.title}
                        </p>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {listing.company_or_event}
                      </p>
                      <p className="text-xs mt-1">
                        {formatDate(listing.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {listing.is_auction
                          ? formatPrice(listing.current_bid || 0)
                          : formatPrice(listing.price || 0)}
                      </p>
                      <Badge
                        variant={
                          listing.status === "active" ? "default" : "secondary"
                        }
                        className="ml-2"
                      >
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No listings yet</p>
                <Link href="/create-listing" className="mt-2 inline-block">
                  <Button variant="outline" size="sm">
                    Create Your First Listing
                  </Button>
                </Link>
              </div>
            )}

            {recentListings.length > 0 && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/listings">
                  <Button variant="outline" size="sm">
                    View All Listings
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bids */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bids</CardTitle>
            <CardDescription>
              Your most recent bids on waitlist spots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBids.length > 0 ? (
              <div className="space-y-4">
                {recentBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <Link href={`/listings/${bid.listing.id}`}>
                        <p className="font-medium text-indigo-600 hover:underline">
                          {bid.listing.title}
                        </p>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {bid.listing.company_or_event}
                      </p>
                      <p className="text-xs mt-1">
                        {formatDate(bid.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(bid.amount)}</p>
                      <Badge
                        variant={
                          bid.status === "active"
                            ? "default"
                            : bid.status === "won"
                            ? "success"
                            : "secondary"
                        }
                        className="ml-2"
                      >
                        {bid.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No bids yet</p>
                <Link href="/listings" className="mt-2 inline-block">
                  <Button variant="outline" size="sm">
                    Browse Auctions
                  </Button>
                </Link>
              </div>
            )}

            {recentBids.length > 0 && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/bids">
                  <Button variant="outline" size="sm">
                    View All Bids
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
