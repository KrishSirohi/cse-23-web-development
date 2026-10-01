const express = require('express');
const app = express();
app.use(express.json());

let products = [{ id: 1, name: 'Item 1', category: 'Tech', price: 100, quantity: 5 }];

app.get('/products', (req, res) => res.json(products));

app.get('/products/category/:category', (req, res) => {
    const list = products.filter(p => p.category.toLowerCase() === req.params.category.toLowerCase());
    list.length ? res.json(list) : res.status(404).json({ error: 'Category not found' });
});

app.get('/products/:id', (req, res) => {
    const item = products.find(p => p.id == req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Product not found' });
});

app.post('/products', (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    const deleted = products.splice(index, 1);
    res.json(deleted[0]);
});

app.listen(3000, () => console.log('Server running on port 3000'));