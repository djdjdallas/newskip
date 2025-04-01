// File: app/components/listings/ListingForm.jsx
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ListingForm({ initialData = null }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    company_or_event: initialData?.company_or_event || "",
    category_id: initialData?.category_id || "",
    position_number: initialData?.position_number || "",
    estimated_access_date: initialData?.estimated_access_date
      ? new Date(initialData.estimated_access_date).toISOString().split("T")[0]
      : "",
    is_auction: initialData?.is_auction || false,
    price: initialData?.price || "",
    minimum_bid: initialData?.minimum_bid || "",
    auction_end_time: initialData?.auction_end_time
      ? new Date(initialData.auction_end_time).toISOString().split("T")[0]
      : "",
    verification_method: initialData?.verification_method || "screenshot",
    tags: initialData?.tags?.join(", ") || "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (!error) {
        setCategories(data);
        if (data.length > 0 && !formData.category_id) {
          setFormData((prev) => ({ ...prev, category_id: data[0].id }));
        }
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a listing");

      // Process tags
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Prepare listing data
      const listingData = {
        seller_id: user.id,
        title: formData.title,
        description: formData.description,
        company_or_event: formData.company_or_event,
        category_id: formData.category_id,
        verification_method: formData.verification_method,
        tags: tagsArray,
        is_auction: formData.is_auction,
      };

      // Add conditional fields
      if (formData.position_number) {
        listingData.position_number = parseInt(formData.position_number, 10);
      }

      if (formData.estimated_access_date) {
        listingData.estimated_access_date = new Date(
          formData.estimated_access_date
        ).toISOString();
      }

      if (formData.is_auction) {
        if (formData.minimum_bid) {
          listingData.minimum_bid = parseFloat(formData.minimum_bid);
          listingData.current_bid = parseFloat(formData.minimum_bid);
        }

        if (formData.auction_end_time) {
          listingData.auction_end_time = new Date(
            formData.auction_end_time
          ).toISOString();
        }
      } else {
        if (formData.price) {
          listingData.price = parseFloat(formData.price);
        }
      }

      // Insert or update listing
      let listing;
      if (initialData) {
        const { data, error } = await supabase
          .from("waitlist_listings")
          .update(listingData)
          .eq("id", initialData.id)
          .select();

        if (error) throw error;
        listing = data[0];
      } else {
        const { data, error } = await supabase
          .from("waitlist_listings")
          .insert(listingData)
          .select();

        if (error) throw error;
        listing = data[0];
      }

      // Upload images if any
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${listing.id}/${Date.now()}.${fileExt}`;

          // Upload image
          const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from("listing-images")
            .getPublicUrl(fileName);

          // Insert image record
          const { error: imageError } = await supabase
            .from("listing_images")
            .insert({
              listing_id: listing.id,
              url: urlData.publicUrl,
              is_primary: i === 0, // First image is primary
            });

          if (imageError) throw imageError;
        }
      }

      // Redirect to listing page
      router.push(`/listings/${listing.id}`);
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Listing" : "Create New Listing"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Listing Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Rabbit R1 Waitlist Position #156"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your waitlist position, when you signed up, and any other relevant details"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company_or_event" className="text-sm font-medium">
              Company or Event Name
            </label>
            <Input
              id="company_or_event"
              name="company_or_event"
              value={formData.company_or_event}
              onChange={handleChange}
              required
              placeholder="e.g., Rabbit, Nothing Phone, Taylor Swift Concert"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category_id" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                handleSelectChange("category_id", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="position_number" className="text-sm font-medium">
              Position in Waitlist
            </label>
            <Input
              id="position_number"
              name="position_number"
              type="number"
              min="1"
              value={formData.position_number}
              onChange={handleChange}
              placeholder="Your position number (if known)"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="estimated_access_date"
              className="text-sm font-medium"
            >
              Estimated Access Date
            </label>
            <Input
              id="estimated_access_date"
              name="estimated_access_date"
              type="date"
              value={formData.estimated_access_date}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_auction"
              checked={formData.is_auction}
              onCheckedChange={(checked) =>
                handleCheckboxChange("is_auction", checked)
              }
            />
            <label htmlFor="is_auction" className="text-sm font-medium">
              List as auction (instead of fixed price)
            </label>
          </div>

          {formData.is_auction ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="minimum_bid" className="text-sm font-medium">
                  Minimum Bid ($)
                </label>
                <Input
                  id="minimum_bid"
                  name="minimum_bid"
                  type="number"
                  step="0.01"
                  min="0"
                  required={formData.is_auction}
                  value={formData.minimum_bid}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="auction_end_time"
                  className="text-sm font-medium"
                >
                  Auction End Date
                </label>
                <Input
                  id="auction_end_time"
                  name="auction_end_time"
                  type="date"
                  required={formData.is_auction}
                  value={formData.auction_end_time}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required={!formData.is_auction}
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="verification_method"
              className="text-sm font-medium"
            >
              Verification Method
            </label>
            <Select
              value={formData.verification_method}
              onValueChange={(value) =>
                handleSelectChange("verification_method", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select verification method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="screenshot">Screenshot</SelectItem>
                <SelectItem value="invite_code">Invite Code</SelectItem>
                <SelectItem value="email_transfer">Email Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="images" className="text-sm font-medium">
              Upload Images
            </label>
            <Input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload screenshots or proof of your waitlist position. First image
              will be the main image.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., tech, limited edition, exclusive"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "Saving..."
              : initialData
              ? "Update Listing"
              : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
