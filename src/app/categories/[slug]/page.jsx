
export default function CategoryPage({ params }) {
  return (
    <div className="container mx-auto py-8">
      <h1>Category: {params.slug}</h1>
      {/* CategoryListings component will go here */}
    </div>
  )
}

