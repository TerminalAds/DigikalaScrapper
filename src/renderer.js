import Alpine from '../node_modules/alpinejs/dist/module.esm.js';

window.Alpine = Alpine;

Alpine.data('categories', () => ({
    loading: false,
    categories: [],
    selectedCategory: null,
    breadCrumbs: [],
    _products: '',
    init() {
        this.loading = true;

        getCategories().then(res => {
            this.categories = res;
            this.loading = false;
        });
    },
    get products() {
        return this._products;
    },
    set products(val) {
        this._products = decodeURI(val.replace(`/^$
        /`, ''));
    },
    selectCategory(category) {
        this.selectedCategory = category.id;
        this.breadCrumbs.push(category);
    },
    goToCrumb(crumb) {
        this.selectedCategory = crumb.parent_id;
        this.breadCrumbs.splice(
            this.breadCrumbs.indexOf(crumb),
            this.breadCrumbs.length
        );
    },
    async submitProducts() {
        this.loading = true;

        const items = this._products.matchAll(/dkp-(\d+)/g);

        for (let item of items) {
            const product = await getDigikalaProduct(item[1]);
            await this.storeProduct(product);
        }

        this.loading = false;
    },
    async storeProduct(product) {
        const details = product?.specifications?.[0]?.attributes?.map(item => ({
            label: item.title,
            value: item.values.join('\n')
        })) ?? [{
            label: '',
            value: ''
        }];

        const color = product?.variants.find(x => x.color) ? product?.variants?.map(variant => ({
                color: variant.color.hex_code,
                color_name: variant.color.title,
                inventory: "",
                max_order: "",
                price: 0,
                discount: ""
            }
        )) : [];

        const size = product?.variants.find(x => x.size) ? product?.variants?.map(variant => ({
            size: variant.size.title,
            inventory: "",
            max_order: "",
            price: 0,
            discount: ""
        })) : []

        let images = [];

        if (product?.images?.main?.url?.[0]) {
            const image = await uploadFile({
                url: product?.images?.main?.url?.[0],
                title: product.title_fa,
                category: this.breadCrumbs[this.breadCrumbs.length - 1].title
            });

            images.push({
                "name": image.title,
                "title": image.title,
                "url": image.full_path,
                "description": "",
                "link": "",
                "id": image.id
            });
        }


        const data = {
            "title": product.title_fa,
            "data": {
                "title": product.title_fa,
                "content": product?.expert_reviews?.description,
                "price": product?.default_variant?.price?.selling_price,
                "discount": "",
                "discount_type": "percent",
                "packing_price": 0,
                "options": {
                    color,
                    size
                },
                "sub_products": {
                    "count": [],
                    "type": [],
                    "weight": []
                },
                details,
                "gallery": [
                    {
                        "name": "",
                        images
                    }
                ],
                "brand": product?.data_layer?.brand,
                "inventory": null,
                "order_limit": null,
                "qr_id": null,
                "slug": "dkp-" + product.id,
                "description": product?.expert_reviews?.description,
                "discount_amount": "",
                extra: [
                    {
                        "label": "",
                        "value": ""
                    }
                ],
                "quantity": null
            },
            "category_id": this.selectedCategory
        };

        console.log(data);

        return await storeProduct(data);
    }
}))

Alpine.start();