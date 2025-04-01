
export default function CheckoutPage({ params }) {
  return (
    <div className="container mx-auto py-8">
      <h1>Checkout</h1>
      <p>Listing ID: {params.id}</p>
      {/* Checkout component will go here */}
    </div>
  )
}

