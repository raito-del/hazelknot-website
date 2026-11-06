// ============================================================
// প্রোডাক্ট: Crochet Tote Bag
// ফাইল: products/tote.js
// এখানে এই প্রোডাক্টের সব তথ্য আছে। শুধু মানগুলো বদলান, লাইনগুলো রাখুন।
// ছবি এই নামে রাখুন: images/products/tote.jpg
// ============================================================

window.HAZEL_PRODUCTS = window.HAZEL_PRODUCTS || [];
window.HAZEL_PRODUCTS.push({
  id: "tote",                         // ইউনিক আইডি, এটা বদলাবেন না
  name: "Crochet Tote Bag",                     // প্রোডাক্টের নাম
  category: "accessories",                    // amigurumi / accessories / decor
  price: 1200,                                  // দাম (টাকা)
  summary: "Handmade · made to order",   // কার্ডে ছোট এক লাইনের লেখা
  image: "images/products/tote.jpg",   // ছবির পথ। ছবি না থাকলে "" লিখুন
  hue: "#e6dcc9",                         // ছবি না থাকলে ব্যাকগ্রাউন্ডের রং
  tone: "#c9b48f",
  kind: "bag",                       // ছবি না থাকলে নমুনা আইকনের ধরন
  details: "A sturdy everyday tote in cotton yarn with a lined inside. Holds up to 5kg. Ready in 5 days.",  // প্রজেক্ট ডিটেইল (বড় করে দেখার পপআপে যাবে)
  options: {
    "Color": [
        "Natural",
        "Forest green",
        "Terracotta"
    ]
}   // রং ও সাইজের অপশন। নতুন অপশন যোগ করতে কমা দিয়ে লিখুন
});
