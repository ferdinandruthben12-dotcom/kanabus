-- Migration pour ajouter les colonnes manquantes à la table products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS weights TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS terpenes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS effects_fr TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS effects_kr TEXT[] DEFAULT '{}';

-- Insertion des données initiales (Seed)
INSERT INTO public.products (
  slug, name, category, description_fr, description_kr, 
  cbd_value, price_usd, price_htg, origin, image_url, 
  badge_fr, badge_kr, weights, terpenes, effects_fr, effects_kr, status
) VALUES 
(
  'citadelle-gold', 'Citadelle Gold', 'fleurs', 
  'Une variété rare cultivée en haute altitude près de la Citadelle Laferrière. Notes d''agrumes tropicaux, finale terreuse, expérience d''exception pour les connaisseurs.',
  'Yon varyete ki ra, kiltive nan wo altitid pre Sitadèl Laferyè. Nòt sitwon twopikal, finisyon latè, eksperyans eksepsyonèl pou koneseur yo.',
  22, 55, 7250, 'Massif du Nord, Haïti', '/assets/hero-flower.jpg', 
  'Signature', 'Siyati', ARRAY['1g', '3g', '5g', '10g'], ARRAY['Limonène', 'Myrcène', 'Caryophyllène'], 
  ARRAY['Euphorique', 'Créatif', 'Détente profonde'], ARRAY['Euforik', 'Kreyatif', 'Detant pwofon'], 'published'
),
(
  'hibiscus-gold', 'Hibiscus Gold', 'fleurs', 
  'Une infusion unique mêlant la force du CBD organique du Cap-Haïtien et la douceur florale de l''hibiscus sauvage.',
  'Yon enfizyon inik ki melanje fòs CBD òganik Cap-Ayisyen ak dousè flè ibiskis sovaj.',
  18, 38, 5000, 'Cap-Haïtien, Nord', '/assets/featured-product.jpg', 
  'Nouveauté', 'Nouvo', ARRAY['1g', '3g', '5g'], ARRAY['Limonène', 'Pinène'], 
  ARRAY['Énergisant', 'Focus', 'Vibrant'], ARRAY['Enèjizan', 'Konsantrasyon', 'Vivan'], 'published'
),
(
  'small-buds-nord', 'Small Buds Nord', 'fleurs', 
  'Petites têtes denses et résineuses, parfaites pour un usage quotidien sans compromis sur la qualité.',
  'Ti tèt dans ak rezinè, pafè pou itilizasyon chak jou san konpwomi sou kalite.',
  14, 22, 2900, 'Plaine du Nord', '/assets/cat-fleurs.jpg', 
  NULL, NULL, ARRAY['3g', '5g', '10g'], ARRAY['Myrcène', 'Linalool'], 
  ARRAY['Doux', 'Quotidien', 'Apaisant'], ARRAY['Dous', 'Chak jou', 'Pasifyan'], 'published'
),
(
  'gummies-mango-kush', 'Gummies Mango Kush', 'gummies', 
  'Gummies bio infusées au CBD full-spectrum, saveur mangue Kush. 25mg par gomme. Dosage précis, plaisir garanti.',
  'Gummies bio enfize ak CBD full-spectrum, gou mango Kush. 25mg pa gòm. Dozaj presi, plezi garanti.',
  25, 32, 4200, 'Atelier KanaBus', '/assets/cat-gummies.jpg', 
  'Full Spectrum', 'Full Spectrum', ARRAY['20 pcs'], ARRAY['Limonène'], 
  ARRAY['Tropical', 'Énergie douce', 'Bonne humeur'], ARRAY['Twopikal', 'Enèji dous', 'Bon imè'], 'published'
),
(
  'the-bleu-citronelle', 'Thé Bleu Citronelle', 'the', 
  'Infusion artisanale à base de citronnelle, hibiscus et CBD. Cérémonie du soir, retour au calme.',
  'Enfizyon atizanal ak sitwonèl, ibiskis epi CBD. Seremoni nan aswè, retounen nan kalm.',
  15, 28, 3700, 'Récolte locale, Nord', '/assets/cat-the.jpg', 
  NULL, NULL, ARRAY['40g'], ARRAY['Linalool', 'Limonène'], 
  ARRAY['Zen', 'Sommeil', 'Digestion'], ARRAY['Zen', 'Dòmi', 'Dijestyon'], 'published'
),
(
  'miel-hibiscus', 'Miel Hibiscus', 'miel', 
  'Miel sauvage récolté localement, infusé au CBD. Idéal en cuillère du soir ou dans une infusion chaude.',
  'Siwo myèl sovaj rekòlte lokalman, enfize ak CBD. Ideyal nan kiyè nan aswè oswa nan yon enfizyon cho.',
  200, 32, 4200, 'Apiculteurs du Nord', '/assets/cat-miel.jpg', 
  'Miel infusé', 'Siwo myèl enfize', ARRAY['180ml'], ARRAY['Myrcène'], 
  ARRAY['Apaisant', 'Sucré', 'Réconfort'], ARRAY['Pasifyan', 'Sikre', 'Konfò'], 'published'
),
(
  'cacao-de-labadee', 'Cacao de Labadee', 'chocolat', 
  'Tablette de chocolat noir 75% au cacao haïtien, infusée au CBD. Plaisir intense et apaisement.',
  'Tablèt chokola nwa 75% ak kakawo ayisyen, enfize ak CBD. Plezi entans epi pasifikasyon.',
  25, 18, 2400, 'Cacao haïtien', '/assets/cat-chocolat.jpg', 
  'Chocolat noir 75%', 'Chokola nwa 75%', ARRAY['50g'], ARRAY['Caryophyllène'], 
  ARRAY['Gourmand', 'Anti-stress', 'Indulgent'], ARRAY['Gou', 'Anti-estrès', 'Endiljan'], 'published'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description_fr = EXCLUDED.description_fr,
  description_kr = EXCLUDED.description_kr,
  cbd_value = EXCLUDED.cbd_value,
  price_usd = EXCLUDED.price_usd,
  price_htg = EXCLUDED.price_htg,
  origin = EXCLUDED.origin,
  image_url = EXCLUDED.image_url,
  badge_fr = EXCLUDED.badge_fr,
  badge_kr = EXCLUDED.badge_kr,
  weights = EXCLUDED.weights,
  terpenes = EXCLUDED.terpenes,
  effects_fr = EXCLUDED.effects_fr,
  effects_kr = EXCLUDED.effects_kr,
  status = EXCLUDED.status;
