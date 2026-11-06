// ============================================================
// প্রোডাক্ট: Tiny Bear Keychain
// ফাইল: products/bear-keychain.js
// এখানে এই প্রোডাক্টের সব তথ্য আছে। শুধু মানগুলো বদলান, লাইনগুলো রাখুন।
// ছবি এই নামে রাখুন: images/products/bear-keychain.jpg
// ============================================================

window.HAZEL_PRODUCTS = window.HAZEL_PRODUCTS || [];
window.HAZEL_PRODUCTS.push({
  id: "bear-keychain",                         // ইউনিক আইডি, এটা বদলাবেন না
  name: "Tiny Bear Keychain",                     // প্রোডাক্টের নাম
  category: "accessories",                    // amigurumi / accessories / decor
  price: 250,                                  // দাম (টাকা)
  summary: "Handmade · made to order",   // কার্ডে ছোট এক লাইনের লেখা
  image: "images/products/bear-keychain.jpg",   // ছবির পথ। ছবি না থাকলে "" লিখুন
  hue: "#d9e4d2",                         // ছবি না থাকলে ব্যাকগ্রাউন্ডের রং
  tone: "#9fb39a",
  kind: "bear",                       // ছবি না থাকলে নমুনা আইকনের ধরন
  details: "A tiny crochet bear on a sturdy keyring. Light and perfect for bags. Ready in 1 to 2 days.",  // প্রজেক্ট ডিটেইল (বড় করে দেখার পপআপে যাবে)
  options: {
    "Color": [
        "Cocoa",
        "Sage",
        "Blush"
    ]
}   // রং ও সাইজের অপশন। নতুন অপশন যোগ করতে কমা দিয়ে লিখুন
});
