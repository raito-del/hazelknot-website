// ============================================================
// প্রোডাক্ট: Round Coaster Set (4)
// ফাইল: products/coaster.js
// এখানে এই প্রোডাক্টের সব তথ্য আছে। শুধু মানগুলো বদলান, লাইনগুলো রাখুন।
// ছবি এই নামে রাখুন: images/products/coaster.jpg
// ============================================================

window.HAZEL_PRODUCTS = window.HAZEL_PRODUCTS || [];
window.HAZEL_PRODUCTS.push({
  id: "coaster",                         // ইউনিক আইডি, এটা বদলাবেন না
  name: "Round Coaster Set (4)",                     // প্রোডাক্টের নাম
  category: "decor",                    // amigurumi / accessories / decor
  price: 450,                                  // দাম (টাকা)
  summary: "Handmade · made to order",   // কার্ডে ছোট এক লাইনের লেখা
  image: "images/products/coaster.jpg",   // ছবির পথ। ছবি না থাকলে "" লিখুন
  hue: "#d7e0d0",                         // ছবি না থাকলে ব্যাকগ্রাউন্ডের রং
  tone: "#a8bb9f",
  kind: "coaster",                       // ছবি না থাকলে নমুনা আইকনের ধরন
  details: "A set of four heat-friendly coasters in cotton yarn. Ready in 2 days.",  // প্রজেক্ট ডিটেইল (বড় করে দেখার পপআপে যাবে)
  options: {
    "Colour": [
        "Sage & cream",
        "Cocoa & cream"
    ]
}   // রং ও সাইজের অপশন। নতুন অপশন যোগ করতে কমা দিয়ে লিখুন
});
