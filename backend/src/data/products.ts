import { HobbyCategory, Product } from '../types.js';

const product = (values: Partial<Product> & Pick<Product, 'id' | 'title' | 'series' | 'manufacturer' | 'category' | 'price' | 'stock' | 'image' | 'description'>): Product => ({
  status: 'ready',
  statusBadge: 'Ready Stock',
  condition: 'MISB',
  categoryName: 'Scale Figure',
  rating: 5,
  soldCount: 0,
  ...values,
});

type ProductSeed = [string, string, string, HobbyCategory, number, string];

const extraProductSeeds: ProductSeed[] = [
  ['frieren-scale', 'Frieren 1/7 Scale Figure - Beyond Journey\'s End', 'Frieren: Beyond Journey\'s End', 'scale', 2480000, 'Figure Frieren dengan jubah penyihir dan base bertema perjalanan utara.'],
  ['marin-scale', 'Marin Kitagawa 1/7 - My Dress-Up Darling', 'My Dress-Up Darling', 'scale', 2180000, 'Scale figure Marin dengan kostum cosplay dan detail aksesori karakter.'],
  ['nezuko-scale', 'Nezuko Kamado 1/8 Demon Form', 'Demon Slayer: Kimetsu no Yaiba', 'scale', 1760000, 'Figure Nezuko dalam pose bertarung dengan efek visual bertema api.'],
  ['luffy-gear5-scale', 'Monkey D. Luffy Gear 5 - Grandista', 'One Piece', 'scale', 1320000, 'Figure Luffy Gear 5 dengan pose dinamis dan ekspresi khas Nika.'],
  ['power-scale', 'Power 1/7 Scale Figure', 'Chainsaw Man', 'scale', 2390000, 'Figure Power dengan palu besar dan base bertema Chainsaw Man.'],
  ['rem-crystal-scale', 'Rem Crystal Dress 1/7', 'Re:Zero − Starting Life in Another World', 'scale', 2650000, 'Rem dengan gaun kristal transparan dan base dekoratif untuk display.'],
  ['albedo-scale', 'Albedo 1/7 So-Bin Ver.', 'Overlord', 'scale', 3120000, 'Figure Albedo dengan sayap hitam dan kostum detail kolektor.'],
  ['megumin-scale', 'Megumin 1/7 Explosion Ver.', 'KonoSuba', 'scale', 1980000, 'Megumin dalam pose sihir ledakan dengan efek spell pada base.'],
  ['asuka-scale', 'Asuka Langley 1/7 Plugsuit Ver.', 'Neon Genesis Evangelion', 'scale', 2750000, 'Figure Asuka dengan plugsuit merah dan stand display khusus.'],
  ['rengoku-scale', 'Kyojuro Rengoku 1/8 Flame Breathing', 'Demon Slayer: Kimetsu no Yaiba', 'scale', 1890000, 'Figure Rengoku dengan efek visual teknik pernapasan api.'],
  ['bocchi-scale', 'Hitori Gotoh 1/7 Live Stage Ver.', 'Bocchi the Rock!', 'scale', 2250000, 'Figure Bocchi bersama gitar dan base panggung live house.'],
  ['yor-scale', 'Yor Forger 1/7 Thorn Princess', 'Spy x Family', 'scale', 2540000, 'Figure Yor dengan kostum Thorn Princess dan aksesori senjata ikonik.'],
  ['frieren-nendoroid', 'Nendoroid Frieren', 'Frieren: Beyond Journey\'s End', 'nendoroid', 920000, 'Nendoroid Frieren dengan tongkat sihir dan beberapa ekspresi wajah.'],
  ['himmel-nendoroid', 'Nendoroid Himmel the Hero', 'Frieren: Beyond Journey\'s End', 'nendoroid', 890000, 'Nendoroid Himmel dilengkapi pedang, pose heroik, dan aksesori bunga.'],
  ['gojo-nendoroid', 'Nendoroid Satoru Gojo', 'Jujutsu Kaisen', 'nendoroid', 850000, 'Nendoroid Gojo dengan penutup mata, ekspresi senyum, dan efek teknik.'],
  ['yuji-nendoroid', 'Nendoroid Yuji Itadori', 'Jujutsu Kaisen', 'nendoroid', 820000, 'Nendoroid Yuji dengan ekspresi bertarung dan aksesori Sukuna.'],
  ['denji-nendoroid', 'Nendoroid Denji Chainsaw Man', 'Chainsaw Man', 'nendoroid', 880000, 'Nendoroid Denji dengan ekspresi khas, Pochita, dan aksesori chainsaw.'],
  ['power-nendoroid', 'Nendoroid Power', 'Chainsaw Man', 'nendoroid', 860000, 'Nendoroid Power dengan palu, tanduk, dan ekspresi percaya diri.'],
  ['marin-nendoroid', 'Nendoroid Marin Kitagawa', 'My Dress-Up Darling', 'nendoroid', 910000, 'Nendoroid Marin dengan aksesori kamera dan variasi ekspresi ceria.'],
  ['anya-casual-nendoroid', 'Nendoroid Anya Forger Casual Outfit', 'Spy x Family', 'nendoroid', 790000, 'Nendoroid Anya dengan pakaian kasual, Chimera, dan ekspresi waku-waku.'],
  ['rengoku-nendoroid', 'Nendoroid Kyojuro Rengoku', 'Demon Slayer: Kimetsu no Yaiba', 'nendoroid', 870000, 'Nendoroid Rengoku dengan pedang Nichirin dan efek api.'],
  ['nezuko-nendoroid', 'Nendoroid Nezuko Kamado', 'Demon Slayer: Kimetsu no Yaiba', 'nendoroid', 840000, 'Nendoroid Nezuko dengan kotak kayu mini dan ekspresi khas.'],
  ['miku-sakura-nendoroid', 'Nendoroid Hatsune Miku Sakura Miku', 'Character Vocal Series 01: Hatsune Miku', 'nendoroid', 930000, 'Nendoroid Sakura Miku dengan aksesori bunga sakura dan stand khusus.'],
  ['naruto-nendoroid', 'Nendoroid Naruto Uzumaki Sage Mode', 'Naruto Shippuden', 'nendoroid', 900000, 'Nendoroid Naruto Sage Mode dengan kunai, rasengan, dan ekspresi ninja.'],
  ['calibarn-hg', 'HG 1/144 Gundam Calibarn', 'Mobile Suit Gundam: The Witch from Mercury', 'gunpla', 410000, 'Model kit HG Gundam Calibarn dengan shell unit berpendar dan weapon rifle.'],
  ['schwarzette-hg', 'HG 1/144 Gundam Schwarzette', 'Mobile Suit Gundam: The Witch from Mercury', 'gunpla', 395000, 'Model kit HG Schwarzette dengan GUND-BIT dan giant sword yang dapat dikonfigurasi.'],
  ['freedom-mg', 'MG 1/100 ZGMF-X10A Freedom Gundam Ver.2.0', 'Mobile Suit Gundam SEED', 'gunpla', 1120000, 'Master Grade Freedom Ver.2.0 dengan wing unit dan pose display fleksibel.'],
  ['nu-rg', 'RG 1/144 RX-93 Nu Gundam', 'Mobile Suit Gundam: Char\'s Counterattack', 'gunpla', 680000, 'Real Grade Nu Gundam dengan fin funnel yang dapat dipasang dalam formasi.'],
  ['sazabi-rg', 'RG 1/144 MSN-04 Sazabi', 'Mobile Suit Gundam: Char\'s Counterattack', 'gunpla', 920000, 'Real Grade Sazabi dengan armor detail dan cockpit hatch yang dapat dibuka.'],
  ['zaku-char-hg', 'HG 1/144 MS-06S Char\'s Zaku II', 'Mobile Suit Gundam', 'gunpla', 330000, 'Model kit HG Zaku II merah dengan bazooka, machine gun, dan heat hawk.'],
  ['wing-zero-verka-mg', 'MG 1/100 Wing Gundam Zero EW Ver.Ka', 'Mobile Suit Gundam Wing: Endless Waltz', 'gunpla', 1380000, 'Master Grade Ver.Ka dengan empat sayap feather dan twin buster rifle.'],
  ['rx78-origin-hg', 'HG 1/144 RX-78-02 Gundam The Origin', 'Mobile Suit Gundam: The Origin', 'gunpla', 365000, 'Model kit HG RX-78-02 dengan pilihan konfigurasi shoulder cannon.'],
  ['strike-freedom-rg', 'RG 1/144 Strike Freedom Gundam', 'Mobile Suit Gundam SEED Destiny', 'gunpla', 590000, 'Real Grade Strike Freedom dengan dragoon system dan stand pose aerial.'],
  ['exia-mg', 'MG 1/100 Gundam Exia', 'Mobile Suit Gundam 00', 'gunpla', 980000, 'Master Grade Exia dengan GN Sword, GN Shield, dan detail GN Drive.'],
  ['aerial-rebuild-hg', 'HG 1/144 Gundam Aerial Rebuild', 'Mobile Suit Gundam: The Witch from Mercury', 'gunpla', 375000, 'Model kit Aerial Rebuild dengan beam rifle dan shield bit yang dapat dilepas.'],
  ['lfrith-hg', 'HG 1/144 Gundam Lfrith', 'Mobile Suit Gundam: The Witch from Mercury', 'gunpla', 340000, 'Model kit Gundam Lfrith dengan shield, beam sabers, dan shell unit detail.'],
  ['pikachu-plush', 'Pikachu Plush S - Pokemon Center', 'Pokemon', 'merch', 320000, 'Boneka Pikachu ukuran S dari Pokemon Center dengan bahan lembut dan detail wajah bordir.'],
  ['eevee-plush', 'Eevee Plush S - Pokemon Center', 'Pokemon', 'merch', 465000, 'Boneka Eevee ukuran S dari Pokemon Center dengan bulu lembut dan detail karakter.'],
  ['totoro-plush', 'Medium Totoro Plushie', 'My Neighbor Totoro', 'merch', 580000, 'Boneka Totoro ukuran medium dengan bahan lembut untuk koleksi atau display.'],
  ['pochita-plush', 'Pochita Chainsaw Man Plush', 'Chainsaw Man', 'merch', 390000, 'Plush Pochita dengan handle dan chainsaw detail bordir.'],
  ['chopper-plush', 'Tony Tony Chopper Plushie', 'One Piece', 'merch', 425000, 'Boneka Chopper dengan topi khas dan jahitan detail karakter.'],
  ['klee-acrylic', 'Klee Acrylic Stand Spark Knight', 'Genshin Impact', 'merch', 185000, 'Acrylic stand Klee dengan base ilustrasi dan cetak warna dua sisi.'],
  ['kobo-keychain', 'Kobo Kanaeru Rubber Keychain', 'Hololive Indonesia Generation 3', 'merch', 125000, 'Gantungan kunci rubber Kobo Kanaeru dengan strap dan artwork resmi.'],
  ['hololive-mat', 'Hololive English Desk Mat Collection', 'Hololive Production', 'merch', 345000, 'Desk mat koleksi berpermukaan halus dengan jahitan tepi anti-fray.'],
  ['pokemon-terastal-box', 'Pokemon TCG Terastal Festival ex Booster Box', 'Pokemon Card Game Scarlet & Violet', 'tcg', 1680000, 'Booster box Jepang bersegel dengan kartu spesial bertema Eevee dan evolusinya.'],
  ['pokemon-crimson-haze', 'Pokemon TCG Crimson Haze Booster Box', 'Pokemon Card Game Scarlet & Violet', 'tcg', 1180000, 'Booster box Crimson Haze bahasa Jepang dengan 30 pack tersegel.'],
  ['one-piece-op07', 'One Piece Card Game OP-07 500 Years in the Future', 'One Piece Card Game', 'tcg', 1450000, 'Booster box Jepang OP-07 bersegel untuk koleksi dan deck building.'],
  ['one-piece-op09', 'One Piece Card Game OP-09 Emperors in the New World', 'One Piece Card Game', 'tcg', 1520000, 'Booster box OP-09 Jepang dengan kartu karakter para emperor.'],
  ['yugioh-quarter-century', 'Yu-Gi-Oh! Quarter Century Chronicle Box', 'Yu-Gi-Oh! Official Card Game', 'tcg', 980000, 'Set kartu koleksi edisi Quarter Century dengan kemasan Jepang tersegel.'],
  ['pokemon-night-wanderer', 'Pokemon TCG Night Wanderer Booster Box', 'Pokemon Card Game Scarlet & Violet', 'tcg', 1120000, 'Booster box Night Wanderer Jepang berisi pack original tersegel.'],
];

const seriesImages: Record<string, string> = {
  'Frieren: Beyond Journey\'s End': 'https://media.kitsu.app/anime/46474/poster_image/large-ec9b98dd5fbf8f92532d1edb45f9e882.jpeg',
  'My Dress-Up Darling': 'https://media.kitsu.app/anime/44382/poster_image/large-8ffc8ea9b6a1f9e79bc626e03baab167.jpeg',
  'Demon Slayer: Kimetsu no Yaiba': 'https://media.kitsu.app/anime/poster_images/41370/large.jpg',
  'One Piece': 'https://media.kitsu.app/anime/poster_images/12/large.jpg',
  'Chainsaw Man': 'https://media.kitsu.app/anime/43806/poster_image/large-815d6008fb3b56f4291b9f0ffa05cd8f.jpeg',
  'Re:Zero − Starting Life in Another World': 'https://media.kitsu.app/anime/poster_images/11209/large.jpg',
  Overlord: 'https://media.kitsu.app/anime/poster_images/9965/large.jpg',
  KonoSuba: 'https://media.kitsu.app/anime/poster_images/10941/large.jpg',
  'Neon Genesis Evangelion': 'https://media.kitsu.app/anime/21/poster_image/large-9a3a9086a1b563e9e72d510118eb7d3c.jpeg',
  'Bocchi the Rock!': 'https://media.kitsu.app/anime/44196/poster_image/large-04fc7c066e52d4d2b9d0217b383597bb.jpeg',
  'Spy x Family': 'https://media.kitsu.app/anime/45398/poster_image/large-c26c1e0b77e881fcd66475af6bd22c57.jpeg',
  'Jujutsu Kaisen': 'https://media.kitsu.app/anime/42765/poster_image/large-5ce19551c1a6cf995b378205b9149b5c.jpeg',
  'Character Vocal Series 01: Hatsune Miku': 'https://media.kitsu.app/character/34883/image/large-b7fb79eea718acf22ad64f20d6c2bbdc.jpeg',
  'Naruto Shippuden': 'https://media.kitsu.app/anime/poster_images/1555/large.jpg',
  'Mobile Suit Gundam: The Witch from Mercury': 'https://media.kitsu.app/anime/45217/poster_image/large-b9851ba27827876261d83154bdb00d8f.jpeg',
  'Mobile Suit Gundam': 'https://media.kitsu.app/anime/poster_images/66/large.jpg',
  'Mobile Suit Gundam SEED': 'https://media.kitsu.app/anime/poster_images/72/large.jpg',
  'Mobile Suit Gundam SEED Destiny': 'https://media.kitsu.app/anime/poster_images/73/large.jpg',
  'Mobile Suit Gundam: Char\'s Counterattack': 'https://media.kitsu.app/anime/poster_images/66/large.jpg',
  'Mobile Suit Gundam Wing: Endless Waltz': 'https://media.kitsu.app/anime/poster_images/70/large.jpg',
  'Mobile Suit Gundam: The Origin': 'https://media.kitsu.app/anime/poster_images/6415/large.jpg',
  'Mobile Suit Gundam 00': 'https://media.kitsu.app/anime/poster_images/2346/large.jpg',
  Pokemon: 'https://media.kitsu.app/anime/486/poster_image/large-d7ec3ada948851369b7eb6726235cc0d.jpeg',
  'My Neighbor Totoro': 'https://media.kitsu.app/anime/poster_images/482/large.jpg',
  'Genshin Impact': 'https://media.kitsu.app/anime/46490/poster_image/large-61e0ba871320791dde9524927f105216.jpeg',
  'Hololive Indonesia Generation 3': 'https://media.kitsu.app/anime/poster_images/43740/large.jpg',
  'Hololive Production': 'https://media.kitsu.app/anime/poster_images/43740/large.jpg',
  'Pokemon Card Game Scarlet & Violet': 'https://media.kitsu.app/anime/47863/poster_image/large-313794ffd02026c0b028a10bab78464f.jpeg',
  'One Piece Card Game': 'https://media.kitsu.app/anime/poster_images/12/large.jpg',
  'Yu-Gi-Oh! Official Card Game': 'https://media.kitsu.app/anime/442/poster_image/large-1a2190b27ea7522d16f8d83148956d00.jpeg',
};

const tcgProductImages: Record<string, string> = {
  'pokemon-terastal-box': 'https://assets.tcgdex.net/en/sv/sv08.5/075/high.png',
  'pokemon-crimson-haze': 'https://assets.tcgdex.net/en/sv/sv06/106/high.png',
  'one-piece-op07': '/product-images/onepiece-op07-038.png',
  'one-piece-op09': '/product-images/onepiece-op09-119.png',
  'yugioh-quarter-century': 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
  'pokemon-night-wanderer': 'https://assets.tcgdex.net/en/sv/sv06.5/039/high.png',
  'pokemon-151': 'https://assets.tcgdex.net/en/sv/sv03.5/006/high.png',
};

const verifiedProductImages: Record<string, string> = {
  'frieren-scale': 'https://img.amiami.com/images/product/main/242/FIGURE-168815.jpg',
  'marin-scale': 'https://img.amiami.com/images/product/main/234/FIGURE-163150.jpg',
  'nezuko-scale': 'https://img.amiami.com/images/product/main/204/FIGURE-120752.jpg',
  'luffy-gear5-scale': 'https://img.amiami.com/images/product/main/263/FIGURE-208033.jpg',
  'power-scale': 'https://img.amiami.com/images/product/main/223/FIGURE-141973.jpg',
  'rem-crystal-scale': 'https://img.amiami.com/images/product/main/201/FIGURE-057552.jpg',
  'albedo-scale': 'https://img.amiami.com/images/product/main/224/FIGURE-149215.jpg',
  'asuka-scale': 'https://img.amiami.com/images/product/main/211/FIGURE-122562.jpg',
  'rengoku-scale': 'https://img.amiami.com/images/product/main/222/FIGURE-138273.jpg',
  'bocchi-scale': 'https://img.amiami.com/images/product/main/234/FIGURE-162713.jpg',
  'yor-scale': 'https://img.amiami.com/images/product/main/223/FIGURE-144828.jpg',
  'frieren-nendoroid': 'https://img.amiami.com/images/product/main/262/FIGURE-201709.jpg',
  'himmel-nendoroid': 'https://img.amiami.com/images/product/main/242/FIGURE-171364.jpg',
  'marin-nendoroid': 'https://img.amiami.com/images/product/main/263/FIGURE-205608.jpg',
  'gojo-nendoroid': 'https://img.amiami.com/images/product/main/262/FIGURE-202256.jpg',
  'yuji-nendoroid': 'https://img.amiami.com/images/product/main/261/FIGURE-199983.jpg',
  'denji-nendoroid': 'https://img.amiami.com/images/product/main/224/FIGURE-147539.jpg',
  'power-nendoroid': 'https://img.amiami.com/images/product/main/224/FIGURE-146103.jpg',
  'anya-casual-nendoroid': 'https://img.amiami.com/images/product/main/244/FIGURE-178470.jpg',
  'nezuko-nendoroid': 'https://img.amiami.com/images/product/main/194/FIGURE-055486.jpg',
  'rengoku-nendoroid': 'https://img.amiami.com/images/product/main/204/FIGURE-122266.jpg',
  'miku-sakura-nendoroid': 'https://img.amiami.com/images/product/main/242/FIGURE-168448.jpg',
  'naruto-nendoroid': 'https://img.amiami.com/images/product/main/201/FIGURE-056536.jpg',
  'calibarn-hg': 'https://img.amiami.com/images/product/main/231/TOY-GDM-6217.jpg',
  'schwarzette-hg': 'https://img.amiami.com/images/product/main/224/TOY-GDM-6161.jpg',
  'freedom-mg': 'https://img.amiami.com/images/product/main/212/TOY-GDM-5472.jpg',
  'nu-rg': 'https://img.amiami.com/images/product/main/192/TOY-GDM-4231.jpg',
  'sazabi-rg': 'https://img.amiami.com/images/product/main/204/TOY-GDM-5203.jpg',
  'zaku-char-hg': 'https://img.amiami.com/images/product/main/201/TOY-GDM-4795.jpg',
  'wing-zero-verka-mg': 'https://img.amiami.com/images/product/main/202/TOY-GDM-4982.jpg',
  'rx78-origin-hg': 'https://img.amiami.com/images/product/main/243/TOY-GDM-6626.jpg',
  'strike-freedom-rg': 'https://img.amiami.com/images/product/main/204/TOY-GDM-5215.jpg',
  'exia-mg': 'https://img.amiami.com/images/product/main/204/TOY-GDM-5184.jpg',
  'aerial-rebuild-hg': 'https://img.amiami.com/images/product/main/224/TOY-GDM-6081.jpg',
  'totoro-plush': 'https://img.amiami.com/images/product/main/214/GOODS-04168009.jpg',
  'pikachu-plush': '/product-images/pokemon-pikachu-plush-s.jpg',
  'eevee-plush': '/product-images/pokemon-eevee-plush-s.jpg',
  'pochita-plush': 'https://img.amiami.com/images/product/main/224/GOODS-04248831.jpg',
  'chopper-plush': 'https://img.amiami.com/images/product/main/124/CGD2-40847.jpg',
  'klee-acrylic': 'https://img.amiami.com/images/product/main/263/GOODS-04855431.jpg',
};

const verifiedExistingProductImages: Record<string, string> = {
  'prod-mg-barbatos': 'https://img.amiami.com/images/product/main/193/TOY-GDM-4393.jpg',
  'prod-nendo-pekora': 'https://img.amiami.com/images/product/main/263/FIGURE-208058.jpg',
  'prod-pokemon-151': tcgProductImages['pokemon-151'],
  'prod-hg-wing-zero': 'https://img.amiami.com/images/product/main/204/TOY-GDM-5200.jpg',
  'prod-rg-unicorn': 'https://img.amiami.com/images/product/main/204/TOY-GDM-5218.jpg',
};

const categoryNames: Record<HobbyCategory, string> = {
  scale: 'Scale Figure',
  nendoroid: 'Nendoroid/Figma',
  gunpla: 'Gunpla/Mecha',
  merch: 'Merch/Plushie',
  tcg: 'TCG/Cards',
};

const manufacturers: Record<HobbyCategory, string[]> = {
  scale: ['Good Smile Company', 'Kotobukiya', 'SEGA Fave', 'eStream'],
  nendoroid: ['Good Smile Company', 'Max Factory'],
  gunpla: ['Bandai Spirits'],
  merch: ['SEGA', 'Bandai Spirits', 'Hololive Official Store'],
  tcg: ['The Pokemon Company Japan', 'Bandai Card Games', 'Konami'],
};

const createAdditionalProduct = (seed: ProductSeed, index: number): Product => {
  const [slug, title, series, category, price, description] = seed;
  const status: Product['status'] = index % 10 === 8 ? 'preorder' : index % 7 === 6 ? 'promo' : 'ready';
  const originalPrice = status === 'promo' ? Math.round(price * 1.15 / 10000) * 10000 : undefined;
  const image = verifiedProductImages[slug] || tcgProductImages[slug] || seriesImages[series];

  if (!image) throw new Error(`No image URL configured for ${series}`);

  return product({
    id: `prod-extra-${slug}`,
    title,
    series,
    manufacturer: manufacturers[category][index % manufacturers[category].length],
    category,
    categoryName: categoryNames[category],
    status,
    statusBadge: status === 'preorder' ? 'Pre-Order' : status === 'promo' ? 'Special Promo' : 'Ready Stock',
    condition: category === 'merch' || category === 'tcg' ? 'New Sealed' : 'MISB',
    price,
    originalPrice,
    downPayment: status === 'preorder' ? Math.ceil(price * 0.3 / 50000) * 50000 : undefined,
    stock: 3 + (index * 7) % 19,
    soldCount: (index * 41) % 280,
    rating: Number((4.65 + (index % 4) * 0.08).toFixed(2)),
    image,
    description,
  });
};

export const products: Product[] = [
  product({ id: 'prod-anya-nendoroid', title: 'Nendoroid Anya Forger - Spy x Family', series: 'Spy x Family', manufacturer: 'Good Smile Company', category: 'nendoroid', categoryName: 'Nendoroid/Figma', price: 850000, originalPrice: 950000, stock: 8, rating: 4.9, soldCount: 142, image: '/product-images/nendoroid_anya_1789641315285.jpg', description: 'Nendoroid resmi Anya Forger dengan aksesori dan ekspresi ikonik.' }),
  product({ id: 'prod-miku-symphony', title: 'Scale 1/7 Hatsune Miku Symphony 2022', series: 'Vocaloid / Hatsune Miku', manufacturer: 'Good Smile Company', category: 'scale', price: 2450000, stock: 3, rating: 4.9, soldCount: 87, image: '/product-images/scale_miku_1789641335408.jpg', description: 'Scale figure Hatsune Miku edisi Symphony untuk kolektor.' }),
  product({ id: 'prod-gundam-aerial', title: 'HG Gundam Aerial', series: 'Mobile Suit Gundam: The Witch from Mercury', manufacturer: 'Bandai Spirits', category: 'gunpla', categoryName: 'Gunpla/Mecha', price: 620000, stock: 12, rating: 4.8, soldCount: 211, image: '/product-images/gundam_aerial_1789641348337.jpg', description: 'Gunpla HG Gundam Aerial dengan detail dan artikulasi tinggi.' }),
  product({ id: 'prod-gojo', title: 'Satoru Gojo 1/7 Scale Figure', series: 'Jujutsu Kaisen', manufacturer: 'eStream', category: 'scale', price: 1950000, stock: 5, rating: 4.8, soldCount: 63, image: '/product-images/gojo_figure_1789641362163.jpg', description: 'Figure kolektor Satoru Gojo dengan pose Unlimited Void.' }),
  product({ id: 'prod-denji', title: 'Figma Denji', series: 'Chainsaw Man', manufacturer: 'Max Factory', category: 'nendoroid', categoryName: 'Nendoroid/Figma', status: 'preorder', statusBadge: 'Pre-Order', price: 1150000, downPayment: 300000, stock: 10, rating: 4.7, soldCount: 49, image: '/product-images/figma_denji_1789641396864.jpg', description: 'Figma Denji dengan aksesori chainsaw lengkap.' }),
  product({ id: 'prod-pokemon-151', title: 'Pokemon TCG Scarlet & Violet 151', series: 'Pokemon TCG', manufacturer: 'The Pokemon Company', category: 'tcg', categoryName: 'TCG/Cards', price: 1250000, stock: 6, rating: 4.9, soldCount: 95, image: '/product-images/pokemon_tcg_1789641421429.jpg', description: 'Booster box koleksi Pokemon TCG 151 original.' }),
  product({ id: 'prod-anya-plush', title: 'Anya Forger Premium Plushie', series: 'Spy x Family', manufacturer: 'SEGA', category: 'merch', categoryName: 'Merch/Plushie', status: 'promo', statusBadge: 'Special Promo', price: 390000, originalPrice: 450000, stock: 15, rating: 4.6, soldCount: 71, image: '/product-images/anya_plush_1789641439293.jpg', description: 'Plushie Anya premium yang lembut dan cocok untuk koleksi.' }),
  product({ id: 'prod-hg-wing-zero', title: 'HG 1/144 Wing Gundam Zero EW', series: 'Mobile Suit Gundam Wing: Endless Waltz', manufacturer: 'Bandai Spirits', category: 'gunpla', categoryName: 'Gunpla/Mecha', price: 280000, originalPrice: 340000, stock: 11, rating: 4.9, soldCount: 198, image: '/product-images/wing_gundam_zero.svg', scale: 'High Grade (HG) 1/144', description: 'Gunpla Wing Gundam Zero EW dengan twin buster rifle dan sayap Bird Mode yang dapat dibuka-tutup.' }),
  product({ id: 'prod-mg-barbatos', title: 'MG 1/100 Gundam Barbatos', series: 'Mobile Suit Gundam: Iron-Blooded Orphans', manufacturer: 'Bandai Spirits', category: 'gunpla', categoryName: 'Gunpla/Mecha', status: 'preorder', statusBadge: 'Pre-Order', price: 1450000, downPayment: 500000, stock: 8, rating: 4.9, soldCount: 54, image: '/product-images/barbatos_gundam.svg', scale: 'Master Grade (MG) 1/100', description: 'Master Grade Gundam Barbatos dengan inner frame detail dan mace raksasa untuk kolektor.' }),
  product({ id: 'prod-rg-unicorn', title: 'RG 1/144 RX-0 Unicorn Gundam', series: 'Mobile Suit Gundam UC', manufacturer: 'Bandai Spirits', category: 'gunpla', categoryName: 'Gunpla/Mecha', status: 'promo', statusBadge: 'Special Promo', price: 420000, originalPrice: 540000, stock: 6, rating: 5, soldCount: 312, image: '/product-images/unicorn_gundam.svg', scale: 'Real Grade (RG) 1/144', description: 'Real Grade Unicorn Gundam dengan Psycho-frame clear red dan transformasi Unicorn ke Destroy Mode.' }),
  product({ id: 'prod-nendo-pekora', title: 'Nendoroid Usada Pekora - Hololive', series: 'Hololive Production', manufacturer: 'Good Smile Company', category: 'nendoroid', categoryName: 'Nendoroid/Figma', price: 1100000, originalPrice: 1250000, stock: 7, rating: 5, soldCount: 231, image: '/product-images/pekora_hololive.svg', description: 'Nendoroid Usada Pekora dengan ekspresi khas Peko, aksesori wortel, dan layar stream mini.' }),
  product({ id: 'prod-hololive-acrylic-set', title: 'Hololive Gen 3 Acrylic Stand Set', series: 'Hololive Production', manufacturer: 'Hololive Official Store', category: 'merch', categoryName: 'Merch/Plushie', status: 'promo', statusBadge: 'Special Promo', price: 340000, originalPrice: 450000, stock: 15, rating: 4.8, soldCount: 477, image: '/product-images/hololive_acrylic_set.svg', description: 'Set acrylic stand premium Hololive Gen 3 dengan akrilik tebal dan cetak foil full-color.' }),
  product({ id: 'prod-scale-ina', title: 'Scale 1/7 Ninomae Ina\'nis - Hololive EN', series: 'Hololive EN (Myth)', manufacturer: 'Kotobukiya', category: 'scale', categoryName: 'Scale Figure', status: 'preorder', statusBadge: 'Pre-Order', price: 2800000, downPayment: 900000, stock: 10, rating: 4.9, soldCount: 63, image: '/product-images/ina_hololive.svg', scale: '1/7 Scale PVC Pre-Painted', description: 'Scale figure Ninomae Ina\'nis dengan base Takodachi dan detail kostum Ancient One.' }),
  ...extraProductSeeds.map(createAdditionalProduct),
];

for (const item of products) {
  const verifiedImage = verifiedExistingProductImages[item.id];
  if (verifiedImage) item.image = verifiedImage;
}