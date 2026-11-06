// ============================================================
// প্রোডাক্ট: Bloom Flower Bouquet
// ফাইল: products/bouquet.js
// এখানে এই প্রোডাক্টের সব তথ্য আছে। শুধু মানগুলো বদলান, লাইনগুলো রাখুন।
// ছবি এই নামে রাখুন: images/products/bouquet.jpg
// ============================================================

window.HAZEL_PRODUCTS = window.HAZEL_PRODUCTS || [];
window.HAZEL_PRODUCTS.push({
  id: "bouquet",                         // ইউনিক আইডি, এটা বদলাবেন না
  name: "Bloom Flower Bouquet",                     // প্রোডাক্টের নাম
  category: "decor",                    // amigurumi / accessories / decor
  price: 650,                                  // দাম (টাকা)
  summary: "Handmade · made to order",   // কার্ডে ছোট এক লাইনের লেখা
  image: "images/products/bouquet.jpg",   // ছবির পথ। ছবি না থাকলে "" লিখুন
  hue: "#f7d9cf",                         // ছবি না থাকলে ব্যাকগ্রাউন্ডের রং
  tone: "#e7a48e",
  kind: "flower",                       // ছবি না থাকলে নমুনা আইকনের ধরন
  details: "A crochet flower bouquet that never wilts. Five blooms on wire stems. Ready in 4 days.",  // প্রজেক্ট ডিটেইল (বড় করে দেখার পপআপে যাবে)
  options: {
    "Colour": [
        "Pastel mix",
        "Warm tones"
    ]
}   // রং ও সাইজের অপশন। নতুন অপশন যোগ করতে কমা দিয়ে লিখুন
});
