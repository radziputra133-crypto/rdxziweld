
const WHATSAPP = "60176239357";

const products = [
  {
    id: "pagar",
    name: "Pagar Besi",
    icon: "🚪",
    description: "Pagar besi custom mengikut ukuran.",
    price: 80,
    unit: "kaki panjang",
    mode: "length"
  },
  {
    id: "grill",
    name: "Grill Tingkap",
    icon: "▦",
    description: "Grill tingkap untuk rumah dan premis.",
    price: 100,
    unit: "kaki²",
    mode: "area"
  },
  {
    id: "pintu",
    name: "Grill Pintu",
    icon: "🚪",
    description: "Grill pintu mengikut reka bentuk.",
    price: 120,
    unit: "kaki²",
    mode: "area"
  },
  {
    id: "rak",
    name: "Rak Besi",
    icon: "🗄️",
    description: "Rak besi untuk stor dan bengkel.",
    price: 150,
    unit: "unit",
    mode: "fixed"
  },
  {
    id: "repair",
    name: "Repair Welding",
    icon: "🔧",
    description: "Pembaikan struktur dan barang besi.",
    price: 80,
    unit: "kerja",
    mode: "fixed"
  }
];

let cart = [];

const money = value =>
  "RM" + value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function renderProducts() {
  document.getElementById("products").innerHTML =
    products.map(p => `
      <article class="product">
        <div class="symbol">${p.icon}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">
          ${money(p.price)} / ${p.unit}
        </div>

        ${
          p.mode !== "fixed" ? `
            <label>Lebar / panjang (kaki)</label>
            <input type="number" min="0.1" step="0.1"
              id="width-${p.id}" placeholder="Contoh: 4">

            ${p.mode === "area" ? `
              <label>Tinggi (kaki)</label>
              <input type="number" min="0.1" step="0.1"
                id="height-${p.id}" placeholder="Contoh: 5">
            ` : ""}
          ` : `
            <label>Kuantiti</label>
            <input type="number" min="1" step="1"
              id="qty-${p.id}" value="1">
          `
        }

        <button onclick="addToCart('${p.id}')">
          + TAMBAH KE TROLI
        </button>
      </article>
    `).join("");
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  let quantity = 1;
  let description = "";
  let price = p.price;

  if (p.mode === "length") {
    const width = Number(document.getElementById("width-" + id).value);

    if (!width || width <= 0) {
      alert("Sila masukkan panjang pagar dalam kaki.");
      return;
    }

    quantity = width;
    description = `${width} kaki panjang`;
    price = width * p.price;
  }

  else if (p.mode === "area") {
    const width = Number(document.getElementById("width-" + id).value);
    const height = Number(document.getElementById("height-" + id).value);

    if (!width || !height || width <= 0 || height <= 0) {
      alert("Sila masukkan lebar dan tinggi.");
      return;
    }

    quantity = width * height;
    description = `${width} kaki × ${height} kaki = ${quantity} kaki²`;
    price = quantity * p.price;
  }

  else {
    quantity = Number(document.getElementById("qty-" + id).value);

    if (!Number.isInteger(quantity) || quantity < 1) {
      alert("Kuantiti mestilah sekurang-kurangnya 1.");
      return;
    }

    description = `${quantity} unit/kerja`;
    price = quantity * p.price;
  }

  cart.push({
    name: p.name,
    description,
    quantity,
    price
  });

  updateCart();
  document.getElementById("cart").scrollIntoView({
    behavior: "smooth"
  });
}

function updateCart() {
  const items = document.getElementById("cartItems");
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  document.getElementById("count").textContent = cart.length;
  document.getElementById("total").textContent = money(total);

  if (cart.length === 0) {
    items.textContent = "Troli masih kosong.";
    return;
  }

  items.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.description}</small><br>
        <b>${money(item.price)}</b>
      </div>
      <button onclick="removeItem(${index})">Buang</button>
    </div>
  `).join("");
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cart").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("checkout").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Troli masih kosong. Sila pilih produk dahulu.");
    return;
  }

  const form = new FormData(event.target);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const orderLines = cart.map((item, index) =>
    `${index + 1}. ${item.name}\n   Ukuran/kuantiti: ${item.description}\n   Anggaran: ${money(item.price)}`
  );

  const message = [
    "ASSALAMUALAIKUM RADZI WELDING!",
    "Saya ingin membuat pesanan:",
    "",
    ...orderLines,
    "",
    `JUMLAH ANGGARAN: ${money(total)}`,
    "",
    "MAKLUMAT PELANGGAN",
    `Nama: ${form.get("name")}`,
    `Telefon: ${form.get("phone")}`,
    `Lokasi: ${form.get("location")}`,
    `Nota: ${form.get("notes") || "-"}`,
    "",
    "Mohon sahkan harga dan tempahan saya. Terima kasih."
  ].join("\n");

  const url = "https://wa.me/" + WHATSAPP +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
});

renderProducts();
updateCart();
