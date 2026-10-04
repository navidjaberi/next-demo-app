insert into public.foods (name, description, ingredients, price, category, image_url, created_at)
values
  (
    'Italian Pizza',
    'Thin and crispy Neapolitan style pizza baked in a stone oven.',
    'Tomato sauce, mozzarella, fresh basil, olive oil',
    12.50,
    'pizza',
    '/foods/pizza.jpg',
    now()
  ),
  (
    'Tsunami Burger',
    'A big double beef burger with melted cheese and our house sauce.',
    'Beef patty, cheddar, lettuce, tomato, pickles, brioche bun',
    10.90,
    'burger',
    '/foods/burger.jpg',
    now() - interval '1 minute'
  ),
  (
    'Pasta con Sarde',
    'Sicilian pasta with sardines, fennel and toasted breadcrumbs.',
    'Bucatini, sardines, wild fennel, raisins, pine nuts',
    14.00,
    'pasta',
    '/foods/pasta.jpg',
    now() - interval '2 minutes'
  ),
  (
    'Greek Salad',
    'Fresh and light salad with a simple lemon and olive oil dressing.',
    'Tomato, cucumber, red onion, feta cheese, olives',
    8.50,
    'salad',
    null,
    now() - interval '3 minutes'
  ),
  (
    'Chocolate Lava Cake',
    'Warm chocolate cake with a soft and gooey center.',
    'Dark chocolate, butter, eggs, sugar, flour',
    6.75,
    'dessert',
    null,
    now() - interval '4 minutes'
  ),
  (
    'Fresh Lemonade',
    'Homemade lemonade with mint, served cold.',
    'Lemon, mint, sugar, sparkling water',
    3.50,
    'drink',
    null,
    now() - interval '5 minutes'
  );
