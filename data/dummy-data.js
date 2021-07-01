import Product from '../models/product';

const PRODUCTS = [
	new Product(
		'p1',
		'u1',
		'Coca Cola x12 pack',
		'https://content2.rozetka.com.ua/goods/images/big/10718382.jpg',
		'A red t-shirt, perfect for days with non-red weather.',
		29.99
	),
	new Product(
		'p2',
		'u1',
		'Pepsi x12 pack',
		'https://main-cdn.goods.ru/mid9/hlr-system/210/215/547/812/212/0/100024030257b0.jpg',
		'Fits your red shirt perfectly. To stand on. Not to wear it.',
		99.99
	),
	new Product(
		'p3',
		'u2',
		'Sprite x12 pack',
		'https://www.barista-ltd.ru/components/com_jshopping/files/img_products/sprite_033_canpack-24.jpg',
		'Can also be used for tea!',
		8.99
	),
	new Product(
		'p4',
		'u3',
		'Fanta x12 pack',
		'https://images-na.ssl-images-amazon.com/images/I/71rNnwaLvpL._AC_SX522_.jpg',
		"What the content is? Why would that matter? It's a limited edition!",
		15.99
	),
	new Product(
		'p5',
		'u3',
		'7UP x12 pack',
		'https://www.barista-ltd.ru/components/com_jshopping/files/img_products/7up_330_12pack_high-tin-can_2020.jpg',
		'Awesome hardware, crappy keyboard and a hefty price. Buy now before a new one is released!',
		2299.99
	),
	new Product(
		'p6',
		'u1',
		'Mtn Dew x12 pack',
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHp4QUo2RW31B81kbIVBKWL6ZigOiSHGE3GA&usqp=CAU',
		"Can be used for role-playing (not the kind of role-playing you're thinking about...).",
		5.49
	),
];

export default PRODUCTS;
