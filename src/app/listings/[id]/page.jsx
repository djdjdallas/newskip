
export default function ListingDetailPage({ params }) {
  return (
    <div className="container mx-auto py-8">
      <h1>Listing Details</h1>
      <p>Listing ID: {params.id}</p>
      {/* ListingDetail component will go here */}
    </div>
  )
}

