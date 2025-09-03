/*
  # Add Test Products from CSV Data

  1. New Data
    - Add 5 test products from the provided CSV data structure
    - Products include Magic: The Gathering items from Southern Hobby distributor
    - All products set as pre-order with proper dates and pricing

  2. Data Structure
    - Uses existing products table schema
    - Maps CSV columns to database columns appropriately
    - Sets proper defaults for missing fields
*/

INSERT INTO products (
  sku,
  name,
  product_line,
  distributor,
  wholesale_price,
  price,
  release_date,
  orders_due_date,
  availability,
  in_stock,
  image_url,
  product_url,
  is_active,
  approved
) VALUES 
(
  'WCMGECLBUN',
  'Magic: The Gathering - Lorwyn Eclipsed Bundle',
  'Magic',
  'Southern Hobby',
  34.0,
  34.0,
  '2026-01-23',
  '2025-09-17',
  'pre-order',
  true,
  'https://southernhobby.com/images/products/small/WCMGECLBUN.jpg?4688',
  'https://www.southernhobby.com/magic-the-gathering-lorwyn-eclipsed-bundle/p74224/',
  true,
  true
),
(
  'WCMGECLCB',
  'Magic: The Gathering - Lorwyn Eclipsed Collector Booster',
  'Magic',
  'Southern Hobby',
  203.0,
  203.0,
  '2026-01-23',
  '2025-09-17',
  'pre-order',
  true,
  'https://southernhobby.com/images/products/small/WCMGECLCB.jpg?4688',
  'https://www.southernhobby.com/magic-the-gathering-lorwyn-eclipsed-collector-booster/p74222/',
  true,
  true
),
(
  'WCMGECLCOM',
  'Magic: The Gathering - Lorwyn Eclipsed Commander Deck Carton (4ct)',
  'Magic',
  'Southern Hobby',
  123.0,
  123.0,
  '2026-01-23',
  '2025-09-17',
  'pre-order',
  true,
  'https://southernhobby.com/images/products/small/WCMGECLCOM.jpg?4688',
  'https://www.southernhobby.com/magic-the-gathering-lorwyn-eclipsed-commander-deck-carton-4ct-/p74223/',
  true,
  true
),
(
  'RAV98820',
  'Lorcana TCG: Fabled Collection Starter Set',
  'Lorcana',
  'Southern Hobby',
  15.75,
  15.75,
  '2025-10-03',
  '2025-09-08',
  'pre-order',
  true,
  'https://southernhobby.com/images/products/small/RAV98820.jpg?4688',
  'https://www.southernhobby.com/lorcana-tcg-fabled-collection-starter-set/p74351/',
  true,
  true
),
(
  'NDPK10123',
  'Pokemon 2025 Fall Collector Chest',
  'Pokemon',
  'Southern Hobby',
  18.75,
  18.75,
  '2025-12-05',
  '2025-09-14',
  'pre-order',
  true,
  'https://southernhobby.com/images/products/small/NDPK10123.jpg?4688',
  'https://www.southernhobby.com/pokemon-2025-fall-collector-chest/p74318/',
  true,
  true
);