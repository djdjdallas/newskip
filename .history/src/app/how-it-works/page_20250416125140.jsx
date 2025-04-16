// File: app/how-it-works/page.jsx
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  CreditCard,
  ShieldCheck,
  Check,
  HandCoins,
  UserCheck,
  BadgeCheck,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          How SkipFurther Works
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-600">
          SkipFurther makes it safe and easy to buy and sell waitlist positions
          for exclusive products, events, and experiences.
        </p>
      </section>

      {/* Main Process Overview */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
              <div className="text-2xl font-bold">1</div>
            </div>
            <h3 className="text-xl font-semibold mb-4">List or Find a Spot</h3>
            <p className="text-gray-600">
              Sellers list their waitlist positions with details and proof.
              Buyers browse available spots across various categories.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
              <div className="text-2xl font-bold">2</div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Secure Transaction</h3>
            <p className="text-gray-600">
              Our secure payment system holds funds in escrow while the waitlist
              position transfer is completed and verified.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
              <div className="text-2xl font-bold">3</div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Complete Transfer</h3>
            <p className="text-gray-600">
              Follow our simple transfer process, confirm receipt, and funds are
              automatically released to the seller.
            </p>
          </div>
        </div>
      </section>

      {/* For Sellers Section */}
      <section className="mb-20">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">For Sellers</h2>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Create a Listing
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sign up for an account, then create a listing with details
                    about your waitlist position:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Position number or estimated wait time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Product, event, or company details</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Upload proof of your position (screenshot)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Set a fixed price or start an auction</span>
                    </li>
                  </ul>
                  <Link href="/create-listing">
                    <Button className="mt-2">
                      Create Your First Listing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Complete the Transfer
                  </h3>
                  <p className="text-gray-600 mb-3">
                    When a buyer purchases your spot, you'll be guided through
                    our secure transfer process:
                  </p>
                  <ol className="space-y-4 mb-4">
                    <li className="pl-8 relative">
                      <div className="absolute left-0 top-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                        1
                      </div>
                      <p className="text-gray-700">
                        Receive purchase notification and transfer instructions
                      </p>
                    </li>
                    <li className="pl-8 relative">
                      <div className="absolute left-0 top-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                        2
                      </div>
                      <p className="text-gray-700">
                        Provide required information to the buyer via our secure
                        messaging system
                      </p>
                    </li>
                    <li className="pl-8 relative">
                      <div className="absolute left-0 top-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                        3
                      </div>
                      <p className="text-gray-700">
                        Buyer confirms receipt and the funds are released to
                        your account
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  <HandCoins className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
                  <p className="text-gray-600 mb-3">
                    Once the buyer confirms the successful transfer, you'll
                    receive your payment:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>
                        Funds are released from escrow to your account
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>
                        Withdraw to your bank account or payment method
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Our fee is only 5% of the final sale price</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Buyers Section */}
      <section className="mb-20">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">For Buyers</h2>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Find the Perfect Spot
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Browse our marketplace to find waitlist positions for
                    exclusive products and experiences:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Search by category or specific product</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>View position details and expected access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Buy instantly or place bids in auctions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Verify authenticity with proof screenshots</span>
                    </li>
                  </ul>
                  <Link href="/listings">
                    <Button className="mt-2">
                      Browse Waitlist Spots
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Purchase Securely
                  </h3>
                  <p className="text-gray-600 mb-3">
                    When you find a waitlist position you want, our process
                    makes purchasing safe:
                  </p>
                  <ol className="space-y-4 mb-4">
                    <li className="pl-8 relative">
                      <div className="absolute left-0 top-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                        1
                      </div>
                      <p className="text-gray-700">
                        Complete checkout with your preferred payment method
                      </p>
                    </li>
                    <li className="pl-8 relative">
                      <div className="absolute left-0 top-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                        2
                      </div>
                      <p className="text-gray-700">
                        Funds are held in escrow until transfer is complete
                      </p>
                    </li>
                    <li className="pl-8 relative">
                      <div className="absolute left-0 top-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                        3
                      </div>
                      <p className="text-gray-700">
                        Communicate with the seller through our secure messaging
                        system
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Receive Your Spot
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Complete the transfer process and take ownership of your new
                    waitlist position:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>
                        Follow the specific transfer method (email, code, etc.)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Verify your new position in the waitlist</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>
                        Confirm receipt to release payment to the seller
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer Methods */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8">Transfer Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              Screenshot Verification
            </h3>
            <p className="text-gray-600 mb-4">
              The seller provides screenshots showing their waitlist position.
              After purchase, they update account info to transfer ownership to
              you.
            </p>
            <div className="text-sm text-gray-500">
              Best for: Most waitlists with visible position numbers
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Invite Code Transfer</h3>
            <p className="text-gray-600 mb-4">
              For waitlists with invite codes, the seller shares their unique
              code, allowing the buyer to skip the line entirely.
            </p>
            <div className="text-sm text-gray-500">
              Best for: Referral-based waitlists and exclusive beta programs
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              Email Account Transfer
            </h3>
            <p className="text-gray-600 mb-4">
              For some waitlists, the seller transfers the email account
              associated with the waitlist registration to the buyer.
            </p>
            <div className="text-sm text-gray-500">
              Best for: Waitlists strictly tied to email addresses
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="mb-20">
        <div className="bg-white rounded-2xl shadow p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">Trust & Safety</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                How We Keep You Safe
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Secure Escrow Payments</p>
                    <p className="text-gray-600">
                      Funds are held until both parties confirm the transfer is
                      complete.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Verified Profiles</p>
                    <p className="text-gray-600">
                      All users undergo identity verification to ensure
                      trustworthiness.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Authentic Listings</p>
                    <p className="text-gray-600">
                      We require proof and verification for all waitlist
                      positions.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Secure Messaging</p>
                    <p className="text-gray-600">
                      All communication happens on our platform for your
                      protection.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Buyer & Seller Protection
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    For Buyers
                  </h4>
                  <p className="text-green-700 text-sm">
                    Your payment is held in escrow and only released when you
                    confirm successful receipt of the waitlist position. If
                    anything goes wrong, our support team will assist in
                    resolving the issue.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    For Sellers
                  </h4>
                  <p className="text-blue-700 text-sm">
                    We verify buyer identity and payment before you transfer
                    your waitlist position. Our clear process ensures you
                    receive payment once the transfer is properly completed.
                  </p>
                </div>

                <Link href="/faq">
                  <Button variant="outline" className="w-full mt-4">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    View Our FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of users buying and selling waitlist positions on
          SkipFurther.
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
              className="border-white text-white hover:bg-indigo-700 text-lg py-6 px-8"
            >
              Sell Your Spot
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
