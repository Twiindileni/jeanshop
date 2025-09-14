export default function SimpleTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Image Test</h1>
      
      <div className="mb-4">
        <p>Testing with a direct image URL:</p>
        <img 
          src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
          alt="Test jeans image"
          className="w-64 h-64 object-cover border rounded"
          onLoad={() => console.log("External image loaded successfully")}
          onError={(e) => console.error("External image failed to load", e)}
        />
      </div>

      <div className="mb-4">
        <p>Testing with Supabase URL structure:</p>
        <p className="text-sm text-gray-600">
          Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET"}
        </p>
      </div>
    </div>
  );
}

