const { Product, Category } = require('../../src/models/product');
const { ProductFactory } = require('../factories');

describe('Product Model', () => {

    describe('Product Creation', () => {
        test('should create a product and assert that it exists', () => {
            const productData = {
                name: 'Fedora',
                description: 'A red hat',
                price: 12.50,
                available: true,
                category: Category.CLOTHS
            };

            const product = new Product(productData);

            expect(product).toBeDefined();
            expect(product.id).toBeNull();
            expect(product.name).toBe('Fedora');
            expect(product.description).toBe('A red hat');
            expect(product.available).toBe(true);
            expect(product.price).toBe(12.50);
            expect(product.category).toBe(Category.CLOTHS);
        });

        test('should add a product to the database', async () => {
            const products = await Product.findAll();
            expect(products).toEqual([]);

            const productData = ProductFactory.build();
            delete productData.id;

            const product = await Product.create(productData);

            expect(product.id).toBeDefined();

            const allProducts = await Product.findAll();
            expect(allProducts.length).toBe(1);

            const newProduct = allProducts[0];

            expect(newProduct.name).toBe(productData.name);
            expect(newProduct.description).toBe(productData.description);
            expect(parseFloat(newProduct.price)).toBe(productData.price);
            expect(newProduct.available).toBe(productData.available);
            expect(newProduct.category).toBe(productData.category);
        });
    });

    describe('Product Model - Read', () => {
        test('should read a product', async () => {
            const productData = ProductFactory.build();
            delete productData.id;

            const savedProduct = await Product.create(productData);

            expect(savedProduct.id).toBeDefined();

            const foundProduct = await Product.findByPk(savedProduct.id);

            expect(foundProduct.id).toBe(savedProduct.id);
            expect(foundProduct.name).toBe(productData.name);
            expect(foundProduct.description).toBe(productData.description);
            expect(parseFloat(foundProduct.price)).toBe(productData.price);
        });
    });

    describe('Product Model - Update', () => {
        test('should update a product', async () => {
            const productData = ProductFactory.build();
            delete productData.id;

            const savedProduct = await Product.create(productData);

            expect(savedProduct.id).toBeDefined();

            savedProduct.description = 'testing';

            const originalId = savedProduct.id;

            await savedProduct.save();

            expect(savedProduct.id).toBe(originalId);
            expect(savedProduct.description).toBe('testing');

            const products = await Product.findAll();

            expect(products.length).toBe(1);
            expect(products[0].id).toBe(originalId);
            expect(products[0].description).toBe('testing');
        });
    });

    describe('Product Model - Delete', () => {
        test('should delete a product', async () => {
            const { id, ...dataToCreate } = ProductFactory.build();

            const savedProduct = await Product.create(dataToCreate);

            let products = await Product.findAll();

            expect(products.length).toBe(1);

            await savedProduct.destroy();

            products = await Product.findAll();

            expect(products.length).toBe(0);
        });
    });

    describe('Product Model - List', () => {
        test('should list all products in the database', async () => {
            let products = await Product.findAll();

            expect(products.length).toBe(0);

            for (let i = 0; i < 5; i++) {
                const productData = ProductFactory.build();
                delete productData.id;

                await Product.create(productData);
            }

            products = await Product.findAll();

            expect(products.length).toBe(5);
        });
    });

    describe('Product Model - Find by Name', () => {
        test('should find a product by name', async () => {
            const products = await ProductFactory.createList(5);

            const name = products[0].name;

            const count = products.filter(
                product => product.name === name
            ).length;

            const found = await Product.findByName(name);

            expect(found.length).toBe(count);

            for (const product of found) {
                expect(product.name).toBe(name);
            }
        });
    });

    describe('Product Model - Find by Category', () => {
        test('should find products by category', async () => {
            const products = await ProductFactory.createList(10);

            const category = products[0].category;

            const count = products.filter(
                product => product.category === category
            ).length;

            const found = await Product.findByCategory(category);

            expect(found.length).toBe(count);

            for (const product of found) {
                expect(product.category).toBe(category);
            }
        });
    });

});