// data/presets.js - 4 Reusable Shop Presets for Live Client Pitches
(function () {
  const PRESETS = {
    grill: {
      id: 'grill',
      brand: {
        nameAr: 'جليسة للمأكولات البدوية',
        nameEn: 'Legleisah Bedouin Grill',
        taglineAr: 'مشويات على الفحم ومأكولات بدوية أصيلة بطعم البادية',
        taglineEn: 'Authentic charcoal grills and traditional Bedouin specialties',
        logoSymbol: '🍖'
      },
      theme: {
        primary: '#b84a14',       // Burnt terracotta
        secondary: '#3e2412',     // Desert dark brown
        accent: '#c9a227',        // Bedouin gold
        bg: '#f8f3ec',            // Sand cream
        cardBg: '#ffffff',        // Clean white
        text: '#2b1a0e',          // Deep roast ink
        fontMain: "'Cairo', 'Tajawal', sans-serif",
        fontHeading: "'Reem Kufi', 'Amiri', serif"
      },
      hero: {
        titleAr: 'طعم البادية الأصيل على أصوله',
        titleEn: 'The Authentic Taste of Bedouin Charcoal Grills',
        descAr: 'مشويات على الفحم طازجة يوميًا مع المندي والمبكبكة، نوصّل لحد باب بيتك سخن ومظبوط.',
        descEn: 'Fresh charcoal grills, rich mandi and Libyan mbakbaka, delivered sizzling hot to your doorstep.',
        bgImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80'
      },
      rating: {
        googleScore: '4.8 ★',
        reviewCount: '2,694 تقييم على Google',
        reviewCountEn: '2,694 reviews on Google',
        platformNoteAr: 'أعلى تقييم مشويات بدوية في المنطقة',
        platformNoteEn: 'Top rated Bedouin grill in the area'
      },
      contact: {
        defaultPhone: '201225334412',
        addressAr: 'شارع الطاقة، شيراتون المطار، النزهة، القاهرة',
        addressEn: 'El Taqa St., Sheraton Airport, El Nozha, Cairo',
        hoursAr: 'يوميًا من 11:00 صباحًا حتى 2:00 صباحًا',
        hoursEn: 'Daily 11:00 AM - 2:00 AM'
      },
      categories: [
        {
          id: 'best_sellers',
          nameAr: 'الأكثر طلبًا 🔥',
          nameEn: 'Top Picks 🔥',
          items: [
            {
              id: 'grill_1',
              nameAr: 'نصف فرخة مشوية على الفحم',
              nameEn: '1/2 Charcoal Grilled Chicken',
              descAr: 'متبلة بخلطة بدوية سرية مشوية على الفحم مع طحينة وعيش طازج وسلطة.',
              descEn: 'Marinated half chicken grilled over real wood charcoal with tahini, fresh bread and salad.',
              price: 210,
              image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=700&auto=format&fit=crop&q=80',
              modifiers: [
                {
                  id: 'grill_heat',
                  nameAr: 'درجة التتبيلة',
                  nameEn: 'Seasoning Level',
                  type: 'single',
                  options: [
                    { nameAr: 'تتبيلة عادية', nameEn: 'Original Spice', priceDelta: 0 },
                    { nameAr: 'حار سبايسي بدوي', nameEn: 'Spicy Bedouin', priceDelta: 0 }
                  ]
                },
                {
                  id: 'grill_sides',
                  nameAr: 'إضافات جانبية',
                  nameEn: 'Side Add-ons',
                  type: 'multiple',
                  options: [
                    { nameAr: 'طبق أرز بسمتي بالخلطة', nameEn: 'Basmati Rice', priceDelta: 35 },
                    { nameAr: 'شوربة لسان عصفور بدوي', nameEn: 'Bedouin Soup', priceDelta: 25 },
                    { nameAr: 'طحينة زيادة', nameEn: 'Extra Tahini', priceDelta: 15 }
                  ]
                }
              ]
            },
            {
              id: 'grill_2',
              nameAr: 'نصف فرخة مندي بدوي',
              nameEn: '1/2 Chicken Mandy',
              descAr: 'مدفونة في برميل المندي على الفحم مع أرز بسمتي معتق ودقوس وشوربة.',
              descEn: 'Slow-cooked in an underground charcoal pit, served over mandi rice with spicy daqous and soup.',
              price: 275,
              image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'grill_3',
              nameAr: 'مبكبكة لحم ضاني بالصلصة',
              nameEn: 'Lamb Mbakbaka Pasta',
              descAr: 'مكرونة مبكبكة ليبية بصلصة الطماطم الغنية وقطع لحم الضاني الفاخر والفلفل الحار.',
              descEn: 'Authentic Libyan pasta simmered in rich tomato gravy with tender chunks of fresh lamb.',
              price: 490,
              image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=700&auto=format&fit=crop&q=80'
            }
          ]
        },
        {
          id: 'family_meals',
          nameAr: 'صواني اللمة والولائم 👑',
          nameEn: 'Family Feasts 👑',
          items: [
            {
              id: 'grill_4',
              nameAr: 'صينية جليسة الملكية (3-4 أفراد)',
              nameEn: 'Royal Legleisah Feast (3-4 Persons)',
              descAr: 'فرخة مشوية كاملة + 8 كفتة + 8 شيش طاووق + كيلو أرز ميكس + 4 شوربة وسلطات وطحينة.',
              descEn: 'Full grilled chicken + 8 kofta + 8 shish tawook + 1kg mixed spiced rice + 4 soups and salads.',
              price: 1350,
              image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80',
              modifiers: [
                {
                  id: 'rice_choice',
                  nameAr: 'نوع الأرز',
                  nameEn: 'Rice Type',
                  type: 'single',
                  options: [
                    { nameAr: 'أرز بسمتي بالمكسرات', nameEn: 'Basmati with Nuts', priceDelta: 0 },
                    { nameAr: 'أرز مندي معتق', nameEn: 'Aged Mandy Rice', priceDelta: 0 },
                    { nameAr: 'ميكس مكرونة مبكبكة وأرز', nameEn: 'Mix Mbakbaka & Rice', priceDelta: 40 }
                  ]
                }
              ]
            },
            {
              id: 'grill_5',
              nameAr: 'كيلو ميكس كباب وكفتة ضاني',
              nameEn: '1 Kg Mix Lamb Kebab & Kofta',
              descAr: 'نصف كيلو كباب ضاني مشوي + نصف كيلو كفتة على الفحم مع خضار مشوي وعيش وطحينة.',
              descEn: '500g charcoal lamb kebab + 500g lamb kofta with grilled vegetables, fresh bread and tahini.',
              price: 920,
              image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=700&auto=format&fit=crop&q=80'
            }
          ]
        }
      ]
    },

    burger: {
      id: 'burger',
      brand: {
        nameAr: 'سماش ماستر برجر',
        nameEn: 'Smash Master Burger',
        taglineAr: 'برجر سماش طازج 100% لحم بلدي مع صوصاتنا السرية',
        taglineEn: '100% Fresh Angus smash patties with signature melting cheeses and sauces',
        logoSymbol: '🍔'
      },
      theme: {
        primary: '#d62828',       // Bold smash red
        secondary: '#1d1e2c',     // Midnight iron black
        accent: '#f77f00',        // Cheddar orange
        bg: '#141419',            // Dark moody background
        cardBg: '#1f2029',        // Dark card elevated
        text: '#f4f4f9',          // Clean light text
        fontMain: "'Cairo', 'Tajawal', sans-serif",
        fontHeading: "'Cairo', sans-serif"
      },
      hero: {
        titleAr: 'أقوى برجر سماش بالجبنة السايحة',
        titleEn: 'The Ultimate Sizzling Smash Burger Experience',
        descAr: 'لحم بقري طازج مضغوط على صاج ملتهب بحواف كرسبي مقرمشة وجبنة أمريكية تذوب في فمك.',
        descEn: 'Fresh beef smashed crisp on blazing cast iron, stacked with gooey melted American cheese.',
        bgImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80'
      },
      rating: {
        googleScore: '4.9 ★',
        reviewCount: '1,840 تقييم حقيقي',
        reviewCountEn: '1,840 Verified Reviews',
        platformNoteAr: 'البرجر الأكثر مبيعًا عبر الإنترنت',
        platformNoteEn: 'Top Online Smashed Burger in Town'
      },
      contact: {
        defaultPhone: '201012345678',
        addressAr: 'شارع 9، المعادي، القاهرة',
        addressEn: 'Road 9, Maadi, Cairo',
        hoursAr: 'يوميًا من 12:00 ظهرًا حتى 3:00 صباحًا',
        hoursEn: 'Daily 12:00 PM - 3:00 AM'
      },
      categories: [
        {
          id: 'smash_burgers',
          nameAr: 'سندوتشات السماش 🍔',
          nameEn: 'Smash Burgers 🍔',
          items: [
            {
              id: 'burger_1',
              nameAr: 'أوريجينال دبل سماش',
              nameEn: 'Original Double Smash',
              descAr: 'قطعتين سماش بلدي مقرمشة الحواف، شريحتين جبنة أمريكية، مخلل وصوص ماستر الخاص في خبز بريوش زبدة.',
              descEn: 'Two smashed beef patties, double American cheese, dill pickles and secret Master sauce on toasted brioche.',
              price: 185,
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
              modifiers: [
                {
                  id: 'burger_patty_size',
                  nameAr: 'حجم الساندوتش',
                  nameEn: 'Burger Size',
                  type: 'single',
                  options: [
                    { nameAr: 'سنجل (قطعة واحدة - 100 جم)', nameEn: 'Single Patty', priceDelta: -35 },
                    { nameAr: 'دبل (قطعتين - 200 جم)', nameEn: 'Double Patty', priceDelta: 0 },
                    { nameAr: 'تريبل عملاق (3 قطع - 300 جم)', nameEn: 'Triple Monster', priceDelta: 55 }
                  ]
                },
                {
                  id: 'burger_addons',
                  nameAr: 'إضافات دلّع ساندوتشك',
                  nameEn: 'Loaded Add-ons',
                  type: 'multiple',
                  options: [
                    { nameAr: 'جبنة شيدر سائلة زيادة', nameEn: 'Extra Melted Cheddar', priceDelta: 25 },
                    { nameAr: 'بيكون بقري مقرمش مدخن', nameEn: 'Smoked Beef Bacon', priceDelta: 35 },
                    { nameAr: 'هالبينو مكسيكي حار', nameEn: 'Spicy Jalapeños', priceDelta: 15 },
                    { nameAr: 'بصل مكرمل بالسكر البني', nameEn: 'Caramelized Onions', priceDelta: 20 }
                  ]
                }
              ]
            },
            {
              id: 'burger_2',
              nameAr: 'سموكي بيكون باربكيو',
              nameEn: 'Smoky Bacon BBQ Burger',
              descAr: 'قطعتين لحم أنجوس، شرائح بيكون بقري مقرمش، حلقات بصل ذهبية، صوص باربكيو مدخن وشيدر معتقة.',
              descEn: 'Double Angus patties, crispy beef bacon, golden onion rings, rich hickory BBQ sauce and aged cheddar.',
              price: 220,
              image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=700&auto=format&fit=crop&q=80',
              modifiers: [
                {
                  id: 'burger_size_2',
                  nameAr: 'الحجم',
                  nameEn: 'Size',
                  type: 'single',
                  options: [
                    { nameAr: 'دبل عادي', nameEn: 'Double', priceDelta: 0 },
                    { nameAr: 'تريبل وحش', nameEn: 'Triple Beast', priceDelta: 55 }
                  ]
                }
              ]
            },
            {
              id: 'burger_3',
              nameAr: 'كرسبي تشيكن فيليه فاير',
              nameEn: 'Crispy Fried Chicken Fire',
              descAr: 'صدر دجاج مقرمش متبل سبايسي 24 ساعة، كول سلو بالمايونيز الياباني، جبنة بيبر جاك وصوص رانش.',
              descEn: '24-hour marinated spicy fried chicken breast, Japanese mayo slaw, pepper jack cheese and ranch.',
              price: 175,
              image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=700&auto=format&fit=crop&q=80'
            }
          ]
        },
        {
          id: 'fries_sides',
          nameAr: 'بطاطس ومقبلات مقرمشة 🍟',
          nameEn: 'Fries & Loaded Sides 🍟',
          items: [
            {
              id: 'burger_4',
              nameAr: 'لوديد تشيزي فرايز ماستر',
              nameEn: 'Loaded Cheesy Master Fries',
              descAr: 'بطاطس مقرمشة مغطاة بجبنة شيدر ذائبة، بصل مقرمش، قطع بيكون وصوص ماستر المدخن.',
              descEn: 'Golden fries smothered in warm cheese sauce, crispy fried onions, bacon bits and house sauce.',
              price: 85,
              image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'burger_5',
              nameAr: 'أصابع موتزاريلا إيطالية (5 قطع)',
              nameEn: 'Italian Mozzarella Sticks (5 pcs)',
              descAr: 'أصابع موتزاريلا طبيعية مقرمشة مع صوص المارينارا الإيطالي بالأعشاب.',
              descEn: 'Crispy herb-crusted 100% real mozzarella fingers served with warm marinara dipping sauce.',
              price: 95,
              image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=700&auto=format&fit=crop&q=80'
            }
          ]
        }
      ]
    },

    pizza: {
      id: 'pizza',
      brand: {
        nameAr: 'لا بيلا بيتزا نابوليتانا',
        nameEn: 'La Bella Pizza Napoletana',
        taglineAr: 'بيتزا إيطالية مخبوزة على الحطب بعجينة متخمرة 48 ساعة',
        taglineEn: 'Authentic 48-hour fermented wood-fired Neapolitan pizza and fresh pasta',
        logoSymbol: '🍕'
      },
      theme: {
        primary: '#b22222',       // Napoli crimson
        secondary: '#1c3124',     // Italian basil deep green
        accent: '#e9a023',        // Warm melted mozzarella gold
        bg: '#fcfbf7',            // Flour white / warm cream
        cardBg: '#ffffff',        // White
        text: '#1a1917',          // Italian slate
        fontMain: "'Cairo', 'Tajawal', sans-serif",
        fontHeading: "'Cairo', sans-serif"
      },
      hero: {
        titleAr: 'طعم إيطاليا الحقيقي من فرن الحطب',
        titleEn: 'Real Wood-Fired Neapolitan Pizza',
        descAr: 'عجينة متخمرة ببطء، طماطم سان مارزانو الإيطالية، وجبنة موتزاريلا فريش بتخبز على درجة 450 مئوية.',
        descEn: 'Slow-fermented artisan crust, San Marzano tomato sauce and fresh fior di latte baked at 450°C.',
        bgImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80'
      },
      rating: {
        googleScore: '4.8 ★',
        reviewCount: '1,420 تقييم لعشاق البيتزا',
        reviewCountEn: '1,420 Pizza Lovers Reviews',
        platformNoteAr: 'أفضل بيتزا إيطالية نابولية في القاهرة',
        platformNoteEn: 'Ranked Best Neapolitan Pizza in Town'
      },
      contact: {
        defaultPhone: '201122334455',
        addressAr: 'ممشى أهل مصر، الزمالك، القاهرة',
        addressEn: 'Ahl Masr Promenade, Zamalek, Cairo',
        hoursAr: 'يوميًا من 1:00 ظهرًا حتى 1:00 صباحًا',
        hoursEn: 'Daily 1:00 PM - 1:00 AM'
      },
      categories: [
        {
          id: 'woodfired_pizza',
          nameAr: 'بيتزا فرن الحطب 🍕',
          nameEn: 'Wood-Fired Pizza 🍕',
          items: [
            {
              id: 'pizza_1',
              nameAr: 'مارجريتا نابوليتانا كلاسيك',
              nameEn: 'Margherita Napoletana',
              descAr: 'صلصة طماطم سان مارزانو، جبنة موتزاريلا فريش، ريحان إيطالي طازج وزيت زيتون بكر ممتاز.',
              descEn: 'San Marzano tomato sauce, fresh fior di latte mozzarella, fresh fragrant basil and extra virgin olive oil.',
              price: 180,
              image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=700&auto=format&fit=crop&q=80',
              modifiers: [
                {
                  id: 'pizza_size',
                  nameAr: 'مقاس البيتزا',
                  nameEn: 'Pizza Size',
                  type: 'single',
                  options: [
                    { nameAr: 'وسط 28 سم (فرد إلى فردين)', nameEn: 'Medium 28cm (1-2 persons)', priceDelta: 0 },
                    { nameAr: 'كبير 34 سم (3 أفراد)', nameEn: 'Large 34cm (3 persons)', priceDelta: 60 }
                  ]
                },
                {
                  id: 'pizza_crust_addons',
                  nameAr: 'خيارات الأطراف والإضافات',
                  nameEn: 'Crust & Extra Toppings',
                  type: 'multiple',
                  options: [
                    { nameAr: 'أطراف محشوة جبنة ريكوتا وموتزاريلا', nameEn: 'Stuffed Cheesy Crust', priceDelta: 45 },
                    { nameAr: 'موتزاريلا بوفالو زيادة', nameEn: 'Extra Buffalo Mozzarella', priceDelta: 40 },
                    { nameAr: 'مشروم فريش بورتوبيللو', nameEn: 'Fresh Portobello Mushrooms', priceDelta: 30 }
                  ]
                }
              ]
            },
            {
              id: 'pizza_2',
              nameAr: 'بيبروني سبايسي ديافولا',
              nameEn: 'Spicy Pepperoni Diavola',
              descAr: 'صلصة طماطم، موتزاريلا، شرائح بيبروني بقري بقري إيطالي فاخر وفلفل أحمر حار مخلل وعسل حار.',
              descEn: 'Tomato sauce, mozzarella, imported spicy beef pepperoni, hot Calabrian chilies and hot honey drizzle.',
              price: 245,
              image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&auto=format&fit=crop&q=80',
              modifiers: [
                {
                  id: 'pizza_diavola_size',
                  nameAr: 'الحجم',
                  nameEn: 'Size',
                  type: 'single',
                  options: [
                    { nameAr: 'وسط 28 سم', nameEn: 'Medium 28cm', priceDelta: 0 },
                    { nameAr: 'كبير 34 سم', nameEn: 'Large 34cm', priceDelta: 60 }
                  ]
                }
              ]
            },
            {
              id: 'pizza_3',
              nameAr: 'كواترو فورماجي (4 أجبان)',
              nameEn: 'Quattro Formaggi (4 Cheeses)',
              descAr: 'موتزاريلا، جبنة جورجونزولا إيطالية معتقة، بارميزان ريجيانو وجبنة إيمنتال سويسرية.',
              descEn: 'White base with fior di latte, aged gorgonzola, shaved Parmigiano-Reggiano and melted Emmental.',
              price: 260,
              image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=700&auto=format&fit=crop&q=80'
            }
          ]
        },
        {
          id: 'pasta_pastries',
          nameAr: 'باستا طازجة 🍝',
          nameEn: 'Fresh Handcrafted Pasta 🍝',
          items: [
            {
              id: 'pizza_4',
              nameAr: 'فيتوتشيني ألفريدو بالدجاج والمشروم',
              nameEn: 'Fettuccine Chicken Alfredo',
              descAr: 'باستا فيتوتشيني فريش بصلصة الكريمة الإيطالية، شرائح صدور دجاج مشوية ومشروم مع جبنة بارميزان.',
              descEn: 'Handmade fettuccine ribbons in rich parmesan cream sauce, grilled chicken strips and sautéed mushrooms.',
              price: 215,
              image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'pizza_5',
              nameAr: 'تيراميسو كلاسيك بالماسكاربوني',
              nameEn: 'Authentic Italian Tiramisu',
              descAr: 'طبقات بسكويت سافوياردي مشبعة بقهوة الإسبريسو وكريمة جبنة ماسكاربوني إيطالية وبودرة كاكاو.',
              descEn: 'Espresso-soaked ladyfingers layered with whipped mascarpone cream and dusted with dark Dutch cocoa.',
              price: 110,
              image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&auto=format&fit=crop&q=80'
            }
          ]
        }
      ]
    },

    cafe: {
      id: 'cafe',
      brand: {
        nameAr: 'أروما أرتيزان كافيه ومخبوزات',
        nameEn: 'Aroma Artisan Café & Bakery',
        taglineAr: 'قهوة مختصة حبوب 100% أرابيكا ومخبوزات فرنسية طازجة من الفرن',
        taglineEn: '100% Specialty Arabica beans, handcrafted brew and warm French viennoiserie',
        logoSymbol: '☕'
      },
      theme: {
        primary: '#6f4e37',       // Roasted coffee brown
        secondary: '#2e1c12',     // Dark espresso
        accent: '#c99a6b',        // Warm caramel latte
        bg: '#faf6f0',            // Warm vanilla cream
        cardBg: '#ffffff',        // White
        text: '#231812',          // Deep roast ink
        fontMain: "'Cairo', 'Tajawal', sans-serif",
        fontHeading: "'Cairo', sans-serif"
      },
      hero: {
        titleAr: 'صباحك يبدأ مع رائحة القهوة المختصة',
        titleEn: 'Start Your Day with the Aroma of Real Specialty Coffee',
        descAr: 'بن محمص طازج، مشروبات قهوة ساخنة وباردة محضرة باحتراف، ومخبوزات بالزبدة الطبيعية.',
        descEn: 'Micro-lot roasted beans, masterfully pulled espresso and golden buttery pastries baked every morning.',
        bgImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80'
      },
      rating: {
        googleScore: '4.9 ★',
        reviewCount: '980 تقييم لعشاق المزاج',
        reviewCountEn: '980 Coffee Aficionado Reviews',
        platformNoteAr: 'الكافيه المفضل للدراسة وجلسات العمل',
        platformNoteEn: 'Top Choice for Remote Work & Coffee Lovers'
      },
      contact: {
        defaultPhone: '201501234567',
        addressAr: 'تريومف، مصر الجديدة، القاهرة',
        addressEn: 'Triumph Sq., Heliopolis, Cairo',
        hoursAr: 'يوميًا من 7:30 صباحًا حتى 12:00 منتصف الليل',
        hoursEn: 'Daily 7:30 AM - 12:00 Midnight'
      },
      categories: [
        {
          id: 'specialty_coffee',
          nameAr: 'مشروبات القهوة المختصة ☕',
          nameEn: 'Specialty Coffee ☕',
          items: [
            {
              id: 'cafe_1',
              nameAr: 'سبانش لاتيه مثلج مميز',
              nameEn: 'Iced Signature Spanish Latte',
              descAr: 'دبل شوت إسبريسو كولومبي مع حليب طازج ومزيج الحليب المكثف المكرمل والثلج.',
              descEn: 'Double shot Colombian espresso over fresh whole milk, sweet condensed milk and crystal ice.',
              price: 95,
              image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&auto=format&fit=crop&q=80',
              modifiers: [
                {
                  id: 'cafe_milk',
                  nameAr: 'نوع الحليب',
                  nameEn: 'Milk Option',
                  type: 'single',
                  options: [
                    { nameAr: 'حليب كامل الدسم فريش', nameEn: 'Fresh Whole Milk', priceDelta: 0 },
                    { nameAr: 'حليب شوفان أورجانيك', nameEn: 'Organic Oat Milk', priceDelta: 20 },
                    { nameAr: 'حليب لوز نباتي', nameEn: 'Almond Milk', priceDelta: 25 }
                  ]
                },
                {
                  id: 'cafe_shots',
                  nameAr: 'إضافات الشوت والنكهات',
                  nameEn: 'Extra Shots & Syrups',
                  type: 'multiple',
                  options: [
                    { nameAr: 'إكسترا شوت إسبريسو', nameEn: 'Extra Espresso Shot', priceDelta: 25 },
                    { nameAr: 'سيروب فانيليا فرنسية', nameEn: 'French Vanilla Syrup', priceDelta: 15 },
                    { nameAr: 'كراميل مملح غني', nameEn: 'Salted Caramel Drizzle', priceDelta: 15 }
                  ]
                }
              ]
            },
            {
              id: 'cafe_2',
              nameAr: 'فلات وايت أسترالي كلاسيك',
              nameEn: 'Classic Australian Flat White',
              descAr: 'دبل ريستريتو غني مع حليب مبخر بفقاعات ميكروفوم حريرية ولمسة لاتيه أرت.',
              descEn: 'Double ristretto blended with velvety steamed micro-foam milk and delicate latte art.',
              price: 80,
              image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'cafe_3',
              nameAr: 'كولد برو منقوع 18 ساعة',
              nameEn: '18-Hour Steeped Cold Brew',
              descAr: 'قهوة إثيوبية يرقاتشيفي منقوعة ببطء لمدة 18 ساعة بنكهات زهرية وفاكهية منعشة.',
              descEn: 'Slow cold-steeped Ethiopian Yirgacheffe with bright floral notes and a smooth chocolate finish.',
              price: 90,
              image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=700&auto=format&fit=crop&q=80'
            }
          ]
        },
        {
          id: 'pastries_desserts',
          nameAr: 'مخبوزات فرنسية وحلويات 🥐',
          nameEn: 'French Bakery & Pastries 🥐',
          items: [
            {
              id: 'cafe_4',
              nameAr: 'كرواسون زبدة فرنسي باللوز',
              nameEn: 'Almond French Butter Croissant',
              descAr: 'مخبوز بالزبدة الفرنسية الطبيعية، محشو بكريمة اللوز الغنية ومغطى بشرائح اللوز المحمص.',
              descEn: 'Flaky pure butter viennoiserie filled with rich frangipane almond cream and toasted sliced almonds.',
              price: 75,
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'cafe_5',
              nameAr: 'كوكيز شوكولاتة بلجيكية سائلة',
              nameEn: 'Molten Belgian Chocolate Cookie',
              descAr: 'كوكيز أمريكي عملاق مقرمش من الحواف وغني بقطع شوكولاتة بلجيكية ذائبة من الداخل ورشة ملح بحري.',
              descEn: 'Giant freshly baked cookie loaded with melting chunks of dark Belgian chocolate and sea salt flakes.',
              price: 65,
              image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&auto=format&fit=crop&q=80'
            }
          ]
        }
      ]
    }
  };

  // Export to global window scope
  if (typeof window !== 'undefined') {
    window.SHOP_PRESETS = PRESETS;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRESETS;
  }
})();
