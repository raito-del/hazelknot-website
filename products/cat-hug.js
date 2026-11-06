// ============================================================
// প্রোডাক্ট: Cat Hug Amigurumi
// ফাইল: products/cat-hug.js
// এখানে এই প্রোডাক্টের সব তথ্য আছে। শুধু মানগুলো বদলান, লাইনগুলো রাখুন।
// ছবি এই নামে রাখুন: images/products/cat-hug.jpg
// ============================================================

window.HAZEL_PRODUCTS = window.HAZEL_PRODUCTS || [];
window.HAZEL_PRODUCTS.push({
  id: "cat-hug",                         // ইউনিক আইডি, এটা বদলাবেন না
  name: "Cat Hug Amigurumi",                     // প্রোডাক্টের নাম
  category: "amigurumi",                    // amigurumi / accessories / decor
  price: 850,                                  // দাম (টাকা)
  summary: "Handmade · made to order",   // কার্ডে ছোট এক লাইনের লেখা
  image: "images/products/cat-hug.jpg",   // ছবির পথ। ছবি না থাকলে "" লিখুন
  hue: "#f2c6b4",                         // ছবি না থাকলে ব্যাকগ্রাউন্ডের রং
  tone: "#e9b7a0",
  kind: "cat",                       // ছবি না থাকলে নমুনা আইকনের ধরন
  details: "A soft amigurumi cat hugging a little friend. Made with soft cotton yarn. Ready in 3 to 4 days.",  // প্রজেক্ট ডিটেইল (বড় করে দেখার পপআপে যাবে)
  options: {
    "Color": [
        "Peach",
        "Cream",
        "Brown"
    ],
    "Size": [
        "Small (15cm)",
        "Medium (22cm)"
    ]
}   // রং ও সাইজের অপশন। নতুন অপশন যোগ করতে কমা দিয়ে লিখুন
});
