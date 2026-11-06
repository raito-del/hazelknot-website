// ============================================================
// প্রোডাক্ট: Mini Bunny Plushie
// ফাইল: products/bunny.js
// এখানে এই প্রোডাক্টের সব তথ্য আছে। শুধু মানগুলো বদলান, লাইনগুলো রাখুন।
// ছবি এই নামে রাখুন: images/products/bunny.jpg
// ============================================================

window.HAZEL_PRODUCTS = window.HAZEL_PRODUCTS || [];
window.HAZEL_PRODUCTS.push({
  id: "bunny",                         // ইউনিক আইডি, এটা বদলাবেন না
  name: "Mini Bunny Plushie",                     // প্রোডাক্টের নাম
  category: "amigurumi",                    // amigurumi / accessories / decor
  price: 700,                                  // দাম (টাকা)
  summary: "Handmade · made to order",   // কার্ডে ছোট এক লাইনের লেখা
  image: "images/products/bunny.jpg",   // ছবির পথ। ছবি না থাকলে "" লিখুন
  hue: "#efe3d1",                         // ছবি না থাকলে ব্যাকগ্রাউন্ডের রং
  tone: "#d9c2a4",
  kind: "bunny",                       // ছবি না থাকলে নমুনা আইকনের ধরন
  details: "A small, huggable bunny with soft filling and embroidered eyes. Ready in 3 days.",  // প্রজেক্ট ডিটেইল (বড় করে দেখার পপআপে যাবে)
  options: {
    "Color": [
        "Oatmeal",
        "Dusty pink"
    ],
    "Size": [
        "Small",
        "Medium"
    ]
}   // রং ও সাইজের অপশন। নতুন অপশন যোগ করতে কমা দিয়ে লিখুন
});
